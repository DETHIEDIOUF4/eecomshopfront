import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Modal, message, Input, Select, DatePicker } from 'antd';
import dayjs from 'dayjs';
import { getAllOrders, deliverOrder, markOrderAsPaid, Order } from '../../services/orderService';
import { generateOrderPDF } from '../../services/pdfService';

const { Option } = Select;

const OrderManagement: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([dayjs().startOf('day'), dayjs().endOf('day')]);
    const [selectedPeriod, setSelectedPeriod] = useState<string>('today');

    useEffect(() => {
        fetchOrders();
    }, [dateRange]);

    const fetchOrders = async () => {
        try {
            const data = await getAllOrders();
            
            // Filtrer les commandes par période
            const filteredOrders = data.filter((order: Order) => {
                const orderDate = dayjs(order.createdAt);
                return orderDate.isAfter(dateRange[0]) && orderDate.isBefore(dateRange[1]);
            });
            
            // Trie du plus récent au plus ancien
            const sortedOrders = [...filteredOrders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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

    const handleMarkAsPaid = async (orderId: string) => {
        try {
            await markOrderAsPaid(orderId);
            message.success('Commande marquée comme payée');
            fetchOrders();
        } catch (error) {
            message.error('Erreur lors de la mise à jour du statut de paiement');
        }
    };

    const handlePrintTicket = (order: Order) => {
        try {
            console.log(order);
            generateOrderPDF(order);
            message.success('PDF généré avec succès');
        } catch (error) {
            message.error('Erreur lors de la génération du PDF');
        }
    };

    const handlePeriodChange = (period: string) => {
        setSelectedPeriod(period);
        let newDateRange: [dayjs.Dayjs, dayjs.Dayjs];
        
        switch (period) {
            case 'today':
                newDateRange = [dayjs().startOf('day'), dayjs().endOf('day')];
                break;
            case 'last7days':
                newDateRange = [dayjs().subtract(7, 'day').startOf('day'), dayjs().endOf('day')];
                break;
            case 'last30days':
                newDateRange = [dayjs().subtract(30, 'day').startOf('day'), dayjs().endOf('day')];
                break;
            default:
                newDateRange = [dayjs().startOf('day'), dayjs().endOf('day')];
        }
        
        setDateRange(newDateRange);
    };

    const handleDateRangeChange = (dates: any) => {
        if (dates && dates.length === 2) {
            setDateRange([dates[0].startOf('day'), dates[1].endOf('day')]);
            setSelectedPeriod('custom');
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
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Button 
                        type="primary" 
                        onClick={() => handlePrintTicket(record)}
                        size="small"
                    >
                        Imprimer
                    </Button>
                    {!record.isPaid && (
                        <Button 
                            type="default" 
                            onClick={() => handleMarkAsPaid(record._id)}
                            size="small"
                            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', color: 'white' }}
                        >
                            Marquer payé
                        </Button>
                    )}
                    {!record.isDelivered && (
                        <Button 
                            type="default" 
                            onClick={() => handleMarkAsDelivered(record._id)}
                            size="small"
                        >
                            Livrer
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div>
            <div style={{ 
                display: 'flex', 
                gap: 16, 
                marginBottom: 16,
                flexWrap: 'wrap',
                alignItems: 'center'
            }}>
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
                
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    marginLeft: 'auto'
                }}>
                    <Button 
                        type={selectedPeriod === 'today' ? 'primary' : 'default'}
                        onClick={() => handlePeriodChange('today')}
                        size="small"
                    >
                        Aujourd'hui
                    </Button>
                    <Button 
                        type={selectedPeriod === 'last7days' ? 'primary' : 'default'}
                        onClick={() => handlePeriodChange('last7days')}
                        size="small"
                    >
                        7 derniers jours
                    </Button>
                    <Button 
                        type={selectedPeriod === 'last30days' ? 'primary' : 'default'}
                        onClick={() => handlePeriodChange('last30days')}
                        size="small"
                    >
                        30 derniers jours
                    </Button>
                    <DatePicker.RangePicker
                        value={dateRange}
                        onChange={handleDateRangeChange}
                        format="DD MMM YYYY"
                        placeholder={['Date début', 'Date fin']}
                        size="small"
                        style={{ width: '280px' }}
                    />
                </div>
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