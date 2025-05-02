import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Spin, Typography } from 'antd';
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
import { getAllOrders, Order } from '../../services/orderService';
import { productService, Product } from '../../services/productService';

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

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        try {
            setLoading(true);
            const orders = await getAllOrders();
            const totalOrders = orders.length;
            const pendingOrders = orders.filter((order: Order) => !order.isDelivered).length;
            const deliveredOrders = orders.filter((order: Order) => order.isDelivered).length;
            const totalRevenue = orders.reduce((sum: number, order: Order) => sum + order.totalPrice, 0);
            const paidOrders = orders.filter((order: Order) => order.isPaid).length;
            const unpaidOrders = orders.filter((order: Order) => !order.isPaid).length;

            // Evolution mensuelle des commandes
            const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
            const ordersByMonth = Array(12).fill(0).map((_, i) => ({ month: months[i], count: 0 }));
            orders.forEach((order: Order) => {
                const date = new Date(order.createdAt);
                ordersByMonth[date.getMonth()].count++;
            });

            // Récupérer les produits les plus vendus
            const products = await productService.getAllProducts();
            const topProducts = products
                .sort((a: Product, b: Product) => (b.salesCount || 0) - (a.salesCount || 0))
                .slice(0, 5)
                .map((product: Product) => ({
                    name: product.name,
                    sales: product.salesCount || 0
                }));

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
    };

    if (loading) {
        return <Spin size="large" />;
    }

    return (
        <div style={{ padding: '24px' }}>
            <Typography.Title level={2} style={{ marginBottom: 32, textAlign: 'center', color: '#0088FE' }}>
                Statistiques Générales
            </Typography.Title>
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
                            valueStyle={{ color: '#d81b60', fontWeight: 700 }}
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
        </div>
    );
};

export default StatisticsDashboard; 