import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Spin } from 'antd';
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
    Cell
} from 'recharts';
import { getAllOrders, Order } from '../../services/orderService';
import { productService, Product } from '../../services/productService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface Statistics {
    totalOrders: number;
    pendingOrders: number;
    deliveredOrders: number;
    totalRevenue: number;
    topProducts: Array<{ name: string; sales: number }>;
    ordersByStatus: Array<{ name: string; value: number }>;
}

const StatisticsDashboard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [statistics, setStatistics] = useState<Statistics>({
        totalOrders: 0,
        pendingOrders: 0,
        deliveredOrders: 0,
        totalRevenue: 0,
        topProducts: [],
        ordersByStatus: []
    });

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        try {
            setLoading(true);
            // Récupérer les commandes
            const orders = await getAllOrders();
            
            // Calculer les statistiques
            const totalOrders = orders.length;
            const pendingOrders = orders.filter((order: Order) => !order.isDelivered).length;
            const deliveredOrders = orders.filter((order: Order) => order.isDelivered).length;
            const totalRevenue = orders.reduce((sum: number, order: Order) => sum + order.totalPrice, 0);

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

            setStatistics({
                totalOrders,
                pendingOrders,
                deliveredOrders,
                totalRevenue,
                topProducts,
                ordersByStatus
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
            <Row gutter={[16, 16]}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Total des Commandes"
                            value={statistics.totalOrders}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Commandes en Attente"
                            value={statistics.pendingOrders}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Commandes Livrées"
                            value={statistics.deliveredOrders}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Revenu Total"
                            value={statistics.totalRevenue}
                            formatter={(value) => `${value.toLocaleString('fr-FR')} FCFA`}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
                <Col span={12}>
                    <Card title="Produits les Plus Vendus">
                        <BarChart
                            width={500}
                            height={300}
                            data={statistics.topProducts}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="sales" fill="#8884d8" />
                        </BarChart>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Répartition des Commandes">
                        <PieChart width={500} height={300}>
                            <Pie
                                data={statistics.ordersByStatus}
                                cx={250}
                                cy={150}
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                                {statistics.ordersByStatus.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default StatisticsDashboard; 