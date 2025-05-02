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
    const [uploading, setUploading] = useState(false);
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
            nutritionalInfo: {
                calories: product.nutritionalInfo.calories,
                proteins: product.nutritionalInfo.proteins,
                carbohydrates: product.nutritionalInfo.carbohydrates,
                fats: product.nutritionalInfo.fats,
            },
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
            const productData = {
                ...values,
                nutritionalInfo: {
                    calories: values.nutritionalInfo.calories,
                    proteins: values.nutritionalInfo.proteins,
                    carbohydrates: values.nutritionalInfo.carbohydrates,
                    fats: values.nutritionalInfo.fats,
                },
                images: fileList.map(file => file.url || file.response?.url)
            };

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
        setUploading(true);
        
        const formData = new FormData();
        formData.append('image', file);
        console.log("formData");
        console.log(formData);
        try {
            const response = await axios.post('https://hellogassy-backend.onrender.com/api/upload', formData, {
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
            setUploading(false);
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
                        name="ingredients"
                        label="Ingrédients"
                        rules={[{ required: true, message: 'Veuillez entrer les ingrédients' }]}
                    >
                        <Select mode="tags" style={{ width: '100%' }} placeholder="Ajouter des ingrédients" />
                    </Form.Item>

                    <Form.Item
                        name="preparationTime"
                        label="Temps de préparation"
                        rules={[{ required: true, message: 'Veuillez entrer le temps de préparation' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="allergens"
                        label="Allergènes"
                        rules={[{ required: true, message: 'Veuillez entrer les allergènes' }]}
                    >
                        <Select mode="tags" style={{ width: '100%' }} placeholder="Ajouter des allergènes" />
                    </Form.Item>

                    <Form.Item
                        name={['nutritionalInfo', 'calories']}
                        label="Calories"
                        rules={[{ required: true, message: 'Veuillez entrer le nombre de calories' }]}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name={['nutritionalInfo', 'proteins']}
                        label="Protéines (g)"
                        rules={[{ required: true, message: 'Veuillez entrer la quantité de protéines' }]}
                    >
                        <InputNumber min={0} step={0.1} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name={['nutritionalInfo', 'carbohydrates']}
                        label="Glucides (g)"
                        rules={[{ required: true, message: 'Veuillez entrer la quantité de glucides' }]}
                    >
                        <InputNumber min={0} step={0.1} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        name={['nutritionalInfo', 'fats']}
                        label="Lipides (g)"
                        rules={[{ required: true, message: 'Veuillez entrer la quantité de lipides' }]}
                    >
                        <InputNumber min={0} step={0.1} style={{ width: '100%' }} />
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