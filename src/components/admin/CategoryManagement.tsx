import React, { useState, useEffect } from 'react';
import { categoryService } from '../../services/categoryService';
import { Button, Table, Modal, Form, Input, message } from 'antd';

const CategoryManagement: React.FC = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await categoryService.getAllCategories();
            setCategories(data);
        } catch (error) {
            message.error('Erreur lors de la récupération des catégories');
        }
    };

    const handleAddCategory = () => {
        setEditingCategory(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEditCategory = (category: any) => {
        setEditingCategory(category);
        form.setFieldsValue(category);
        setIsModalVisible(true);
    };

    const handleDeleteCategory = async (id: string) => {
        try {
            await categoryService.deleteCategory(id);
            message.success('Catégorie supprimée avec succès');
            fetchCategories();
        } catch (error) {
            message.error('Erreur lors de la suppression de la catégorie');
        }
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            if (editingCategory) {
                await categoryService.updateCategory(editingCategory._id, values);
                message.success('Catégorie mise à jour avec succès');
            } else {
                await categoryService.createCategory(values);
                message.success('Catégorie créée avec succès');
            }
            setIsModalVisible(false);
            fetchCategories();
        } catch (error) {
            message.error('Erreur lors de la sauvegarde de la catégorie');
        }
    };

    const columns = [
        {
            title: 'Nom',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: any) => (
                <div>
                    <Button type="link" onClick={() => handleEditCategory(record)}>
                        Modifier
                    </Button>
                    <Button type="link" danger onClick={() => handleDeleteCategory(record._id)}>
                        Supprimer
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <Button type="primary" onClick={handleAddCategory} style={{ marginBottom: 16 }}>
                Ajouter une catégorie
            </Button>
            <Table dataSource={categories} columns={columns} rowKey="_id" />

            <Modal
                title={editingCategory ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={() => setIsModalVisible(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Nom"
                        rules={[{ required: true, message: 'Veuillez entrer le nom de la catégorie' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <Input.TextArea />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CategoryManagement; 