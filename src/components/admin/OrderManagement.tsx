import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Modal, message, Input, Select } from 'antd';
import { getAllOrders, deliverOrder, Order } from '../../services/orderService';

const { Option } = Select;

const OrderManagement: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await getAllOrders();
            // Trie du plus récent au plus ancien
            const sortedOrders = [...data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setOrders(sortedOrders);
        } catch (error) {
            message.error('Erreur lors de la récupération des commandes');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsDelivered = async (orderId: string) => {
        try {
            await deliverOrder(orderId);
            message.success('Commande marquée comme livrée');
            fetchOrders();
        } catch (error) {
            message.error('Erreur lors de la mise à jour de la commande');
        }
    };

    // Filtrage par nom client et statut livraison
    const filteredOrders = orders.filter((order: any) => {
        const matchesSearch = order.personalInfo?.firstName?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !statusFilter || (statusFilter === 'delivered' ? order.isDelivered : !order.isDelivered);
        return matchesSearch && matchesStatus;
    });

    const columns = [
        {
            title: 'ID Commande',
            dataIndex: '_id',
            key: '_id',
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Client',
            dataIndex: 'personalInfo',
            key: 'personalInfo',
            render: (personalInfo: any) => personalInfo?.firstName   || 'N/A',
        },
        {
            title: 'Numero Telephone',
            dataIndex: 'personalInfo',
            key: 'personalInfo',
            render: (personalInfo: any) => personalInfo?.phone || 'N/A',
        },
        {
            title: 'Total',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (price: number) => `${price.toLocaleString('fr-FR')} FCFA`,
        },
        {
            title: 'Statut Paiement',
            dataIndex: 'isPaid',
            key: 'isPaid',
            render: (isPaid: boolean) => (
                <Tag color={isPaid ? 'green' : 'red'}>
                    {isPaid ? 'Payé' : 'Non payé'}
                </Tag>
            ),
        },
        {
            title: 'Statut Livraison',
            dataIndex: 'isDelivered',
            key: 'isDelivered',
            render: (isDelivered: boolean, record: Order) => (
                <Tag color={isDelivered ? 'green' : 'orange'}>
                    {isDelivered ? 'Livré' : 'En cours'}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Order) => (
                !record.isDelivered && (
                    <Button 
                        type="primary" 
                        onClick={() => handleMarkAsDelivered(record._id)}
                    >
                        Marquer comme livré
                    </Button>
                )
            ),
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                <Input
                    placeholder="Rechercher par nom de client..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{ width: 250 }}
                />
                <Select
                    placeholder="Filtrer par statut livraison"
                    value={statusFilter}
                    onChange={value => setStatusFilter(value)}
                    allowClear
                    style={{ width: 200 }}
                >
                    <Option value="">Tous les statuts</Option>
                    <Option value="delivered">Livré</Option>
                    <Option value="pending">En cours</Option>
                </Select>
            </div>
            <Table
                columns={columns}
                dataSource={filteredOrders}
                rowKey="_id"
                loading={loading}
                expandable={{
                    expandedRowRender: (record) => (
                        <div>
                            <h4>Détails de la commande</h4>
                            <p>Adresse de livraison: { record.shippingPrice == 0 ?  "Retrait Magasin" :record.shippingAddress.city  }</p>
                            {/* <p>Rue: { record.shippingPrice == 0 ?  "" :record.shippingAddress.postalCode  }</p> */}

                            <p>Méthode de paiement: {record.paymentMethod}</p>
                            <h4>Produits commandés:</h4>
                            <ul>
                                {record.orderItems.map((item, index) => (
                                    <li key={index}>
                                        {item.name} - {item.quantity} x {item.price.toLocaleString('fr-FR')} FCFA
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ),
                }}
            />
        </div>
    );
};

export default OrderManagement; 