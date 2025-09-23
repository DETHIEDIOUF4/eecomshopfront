import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Card, Statistic, Spin, Typography, Table, Button, Tag, message, DatePicker } from 'antd';
import dayjs from 'dayjs';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    ResponsiveContainer
} from 'recharts';
import { getAllOrders, markOrderAsPaid, Order } from '../../services/orderService';
import { generateOrderPDF } from '../../services/pdfService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface Statistics {
    totalOrders: number;
    pendingOrders: number;
    deliveredOrders: number;
    totalRevenue: number;
    paidOrders: number;
    unpaidOrders: number;
    topProducts: Array<{ name: string; sales: number }>;
    ordersByStatus: Array<{ name: string; value: number }>;
    ordersByMonth: Array<{ month: string; count: number }>;
    paymentStatus: Array<{ name: string; value: number }>;
}

const StatisticsDashboard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([dayjs().startOf('day'), dayjs().endOf('day')]);
    const [selectedPeriod, setSelectedPeriod] = useState<string>('today');
    const [statistics, setStatistics] = useState<Statistics>({
        totalOrders: 0,
        pendingOrders: 0,
        deliveredOrders: 0,
        totalRevenue: 0,
        paidOrders: 0,
        unpaidOrders: 0,
        topProducts: [],
        ordersByStatus: [],
        ordersByMonth: [],
        paymentStatus: []
    });

    const fetchStatistics = useCallback(async () => {
        try {
            setLoading(true);
            const orders = await getAllOrders();
            
            // Filtrer les commandes par période
            const filteredOrders = orders.filter((order: Order) => {
                const orderDate = dayjs(order.createdAt);
                return orderDate.isAfter(dateRange[0]) && orderDate.isBefore(dateRange[1]);
            });
            
            // Récupérer les 10 commandes les plus récentes
            const sortedOrders = [...filteredOrders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setRecentOrders(sortedOrders.slice(0, 10));
            const totalOrders = filteredOrders.length;
            const pendingOrders = filteredOrders.filter((order: Order) => !order.isDelivered).length;
            const deliveredOrders = filteredOrders.filter((order: Order) => order.isDelivered).length;
            const totalRevenue = filteredOrders
                .filter((order: Order) => order.isPaid) // Seulement les commandes payées
                .reduce((sum: number, order: Order) => sum + order.totalPrice, 0);
            const paidOrders = filteredOrders.filter((order: Order) => order.isPaid).length;
            const unpaidOrders = filteredOrders.filter((order: Order) => !order.isPaid).length;

            // Evolution mensuelle des commandes
            const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
            const ordersByMonth = Array(12).fill(0).map((_, i) => ({ month: months[i], count: 0 }));
            filteredOrders.forEach((order: Order) => {
                const date = new Date(order.createdAt);
                ordersByMonth[date.getMonth()].count++;
            });

            // Calculer les produits les plus vendus à partir des commandes
            const productSales: { [key: string]: number } = {};
            
            filteredOrders.forEach((order: Order) => {
                order.orderItems.forEach((item) => {
                    const productName = item.name;
                    if (productSales[productName]) {
                        productSales[productName] += item.quantity;
                    } else {
                        productSales[productName] = item.quantity;
                    }
                });
            });

            const topProducts = Object.entries(productSales)
                .map(([name, sales]) => ({ name, sales }))
                .sort((a, b) => b.sales - a.sales)
                .slice(0, 5);

            // Statistiques des commandes par statut
            const ordersByStatus = [
                { name: 'En attente', value: pendingOrders },
                { name: 'Livrées', value: deliveredOrders }
            ];

            // Statut paiement
            const paymentStatus = [
                { name: 'Payées', value: paidOrders },
                { name: 'Non payées', value: unpaidOrders }
            ];

            setStatistics({
                totalOrders,
                pendingOrders,
                deliveredOrders,
                totalRevenue,
                paidOrders,
                unpaidOrders,
                topProducts,
                ordersByStatus,
                ordersByMonth,
                paymentStatus
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des statistiques:', error);
        } finally {
            setLoading(false);
        }
    }, [dateRange]);

    useEffect(() => {
        fetchStatistics();
    }, [fetchStatistics]);

    const handleMarkAsPaid = async (orderId: string) => {
        try {
            await markOrderAsPaid(orderId);
            message.success('Commande marquée comme payée');
            fetchStatistics(); // Rafraîchir les données
        } catch (error) {
            message.error('Erreur lors de la mise à jour du statut de paiement');
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

    const handlePrintTicket = (order: Order) => {
        try {
            generateOrderPDF(order);
            message.success('PDF généré avec succès');
        } catch (error) {
            message.error('Erreur lors de la génération du PDF');
        }
    };

    const columns = [
        {
            title: 'ID Commande',
            dataIndex: '_id',
            key: '_id',
            render: (id: string) => id.substring(0, 8) + '...',
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
            render: (personalInfo: any) => personalInfo?.firstName || 'N/A',
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
                <Tag color={isPaid ? 'green' : 'volcano'}>
                    {isPaid ? 'Payé' : 'Non payé'}
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
                </div>
            ),
        },
    ];

    if (loading) {
        return <Spin size="large" />;
    }

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: 32,
                flexWrap: 'wrap',
                gap: '16px'
            }}>
                <Typography.Title level={2} style={{ margin: 0, color: '#0088FE' }}>
                    Tableau de bord
                </Typography.Title>
                
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    flexWrap: 'wrap'
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
            <Row gutter={[24, 24]} justify="center">
                <Col xs={24} sm={12} md={6}>
                    <Card bordered style={{ background: '#e3f2fd', borderRadius: 16 }}>
                        <Statistic
                            title="Total Commandes"
                            value={statistics.totalOrders}
                            valueStyle={{ color: '#1976d2', fontWeight: 700 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card bordered style={{ background: '#fffde7', borderRadius: 16 }}>
                        <Statistic
                            title="En Attente"
                            value={statistics.pendingOrders}
                            valueStyle={{ color: '#fbc02d', fontWeight: 700 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card bordered style={{ background: '#e8f5e9', borderRadius: 16 }}>
                        <Statistic
                            title="Livrées"
                            value={statistics.deliveredOrders}
                            valueStyle={{ color: '#43a047', fontWeight: 700 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card bordered style={{ background: '#fce4ec', borderRadius: 16 }}>
                        <Statistic
                            title="Revenu Total"
                            value={statistics.totalRevenue}
                            valueStyle={{ color: '#0ea5e9', fontWeight: 700 }}
                            formatter={(value) => `${value.toLocaleString('fr-FR')} FCFA`}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[24, 24]} style={{ marginTop: 32 }}>
                <Col xs={24} md={12}>
                    <Card title="Évolution des Commandes par Mois" bordered style={{ borderRadius: 16 }}>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={statistics.ordersByMonth} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="count" stroke="#1976d2" strokeWidth={3} dot={{ r: 5 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card title="Répartition Paiement" bordered style={{ borderRadius: 16 }}>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={statistics.paymentStatus}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={90}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                    {statistics.paymentStatus.map((entry, index) => (
                                        <Cell key={`cell-pay-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[24, 24]} style={{ marginTop: 32 }}>
                <Col xs={24} md={12}>
                    <Card title="Produits les Plus Vendus" bordered style={{ borderRadius: 16 }}>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={statistics.topProducts}
                                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="sales" fill="#43a047" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card title="Répartition des Commandes" bordered style={{ borderRadius: 16 }}>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={statistics.ordersByStatus}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={90}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                    {statistics.ordersByStatus.map((entry, index) => (
                                        <Cell key={`cell-status-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[24, 24]} style={{ marginTop: 32 }}>
                <Col xs={24}>
                    <Card title="Commandes Récentes" bordered style={{ borderRadius: 16 }}>
                        <Table
                            columns={columns}
                            dataSource={recentOrders}
                            rowKey="_id"
                            pagination={false}
                            size="small"
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default StatisticsDashboard; 