import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Modal, message } from 'antd';
import { getAllOrders, deliverOrder, Order } from '../../services/orderService';

const OrderManagement: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await getAllOrders() ;
            setOrders(data);
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
            dataIndex: 'user',
            key: 'user',
            render: (user: any) => user?.email || 'N/A',
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
            <Table
                columns={columns}
                dataSource={orders}
                rowKey="_id"
                loading={loading}
                expandable={{
                    expandedRowRender: (record) => (
                        <div>
                            <h4>Détails de la commande</h4>
                            <p>Adresse de livraison: {record.shippingAddress.address}</p>
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