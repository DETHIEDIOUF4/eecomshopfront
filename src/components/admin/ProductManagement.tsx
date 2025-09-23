import React, { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { Button, Table, Modal, Form, Input, InputNumber, Select, message, Upload, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { TextArea } = Input;
const { Option } = Select;

const ProductManagement: React.FC = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<any[]>([]);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await productService.getAllProducts();
            // Trie les produits du plus récent au plus ancien
            const sortedProducts = [...data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setProducts(sortedProducts);
        } catch (error) {
            message.error('Erreur lors de la récupération des produits');
        }
    };

    const fetchCategories = async () => {
        try {
            const data = await categoryService.getAllCategories();
            setCategories(data);
        } catch (error) {
            message.error('Erreur lors de la récupération des catégories');
        }
    };

    const handleAddProduct = () => {
        setEditingProduct(null);
        form.resetFields();
        setFileList([]);
        setIsModalVisible(true);
    };

    const handleEditProduct = (product: any) => {
        setEditingProduct(product);
        form.setFieldsValue({
            ...product,
            features: product.features || [],
            specsText: product.specs ? Object.entries(product.specs).map(([k,v]: [string, any]) => `${k}=${v}`).join('\n') : ''
        });
        setFileList(product.images.map((url: string) => ({
            uid: url,
            name: url.split('/').pop(),
            status: 'done',
            url: url
        })));
        setIsModalVisible(true);
    };

    const handleDeleteProduct = async (id: string) => {
        try {
            await productService.deleteProduct(id);
            message.success('Produit supprimé avec succès');
            fetchProducts();
        } catch (error) {
            message.error('Erreur lors de la suppression du produit');
        }
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            // Transform specs text area into object
            const specs: Record<string, string> = {};
            if (values.specsText) {
                String(values.specsText).split('\n').forEach((line: string) => {
                    const idx = line.indexOf('=');
                    if (idx > 0) {
                        const key = line.slice(0, idx).trim();
                        const val = line.slice(idx+1).trim();
                        if (key) specs[key] = val;
                    }
                });
            }
            const productData: any = {
                ...values,
                images: fileList.map(file => file.url || file.response?.url)
            };
            // Cleanup UI-only fields
            delete productData.specsText;
            if (Object.keys(specs).length) productData.specs = specs;

            if (editingProduct) {
                await productService.updateProduct(editingProduct._id, productData);
                message.success('Produit mis à jour avec succès');
            } else {
                await productService.createProduct(productData);
                message.success('Produit créé avec succès');
            }
            setIsModalVisible(false);
            fetchProducts();
        } catch (error) {
            message.error('Erreur lors de la sauvegarde du produit');
        }
    };

    const handleUpload = async (options: any) => {
        const { file, onSuccess, onError } = options;
        
        
        const formData = new FormData();
        formData.append('image', file);
        console.log("formData");
        console.log(formData);
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:4000/api'}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            const imageUrl = `${response.data.imageUrl}`;
            onSuccess(imageUrl);
            setFileList(prev => [...prev, { 
                uid: imageUrl, 
                name: file.name, 
                status: 'done', 
                url: imageUrl 
            }]);
        } catch (error) {
            onError('Erreur lors de l\'upload de l\'image');
            message.error('Erreur lors de l\'upload de l\'image');
        } finally {
        }
    };

    const handleRemove = (file: any) => {
        setFileList(prev => prev.filter(f => f.uid !== file.uid));
    };

    // Trie et filtre les produits
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = !categoryFilter || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const columns = [
        {
            title: 'Nom',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Catégorie',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Prix',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => `${price.toLocaleString('fr-FR')} FCFA`,
        },
        {
            title: 'Stock',
            dataIndex: 'stock',
            key: 'stock',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <Space>
                    <Button type="link" onClick={() => handleEditProduct(record)}>
                        Modifier
                    </Button>
                    <Button type="link" danger onClick={() => handleDeleteProduct(record._id)}>
                        Supprimer
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                <Input
                    placeholder="Rechercher un produit..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{ width: 250 }}
                />
                <Select
                    placeholder="Filtrer par catégorie"
                    value={categoryFilter}
                    onChange={value => setCategoryFilter(value)}
                    allowClear
                    style={{ width: 200 }}
                >
                    <Option value="">Toutes les catégories</Option>
                    {categories.map((category: any) => (
                        <Option key={category._id} value={category.name}>{category.name}</Option>
                    ))}
                </Select>
            </div>
            <Button type="primary" onClick={handleAddProduct} style={{ marginBottom: 16 }}>
                Ajouter un produit
            </Button>
            <Table dataSource={filteredProducts} columns={columns} rowKey="_id" />

            <Modal
                title={editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={() => setIsModalVisible(false)}
                width={800}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Nom"
                        rules={[{ required: true, message: 'Veuillez entrer le nom du produit' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item name="description" label="Description courte">
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="detailedDescription"
                        label="Description détaillée"
                        rules={[{ required: true, message: 'Veuillez entrer la description détaillée' }]}
                    >
                        <TextArea rows={4} />
                    </Form.Item>

                    <Form.Item
                        name="price"
                        label="Prix"
                        rules={[{ required: true, message: 'Veuillez entrer le prix' }]}
                    >
                        <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="category"
                        label="Catégorie"
                        rules={[{ required: true, message: 'Veuillez sélectionner une catégorie' }]}
                    >
                        <Select>
                            {categories.map((category) => (
                                <Option key={category._id} value={category.name}>
                                    {category.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="brand"
                        label="Marque"
                        rules={[{ required: true, message: 'Veuillez entrer la marque' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="modelName"
                        label="Modèle"
                        rules={[{ required: true, message: 'Veuillez entrer le modèle' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="features"
                        label="Caractéristiques (tags)"
                    >
                        <Select mode="tags" style={{ width: '100%' }} placeholder="Ajouter des caractéristiques" />
                    </Form.Item>

                    <Form.Item
                        name="warrantyMonths"
                        label="Garantie (mois)"
                    >
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name="specsText"
                        label="Spécifications (clé=valeur par ligne)"
                        tooltip="Exemple: RAM=16 Go\nStockage=512 Go"
                    >
                        <TextArea rows={4} placeholder={'RAM=16 Go\nStockage=512 Go'} />
                    </Form.Item>

                    <Form.Item
                        name="stock"
                        label="Stock"
                        rules={[{ required: true, message: 'Veuillez entrer la quantité en stock' }]}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item label="Images">
                        <Upload
                            customRequest={handleUpload}
                            fileList={fileList}
                            onRemove={handleRemove}
                            multiple
                            listType="picture-card"
                            accept="image/*"
                        >
                            <div>
                                <UploadOutlined />
                                <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ProductManagement; 