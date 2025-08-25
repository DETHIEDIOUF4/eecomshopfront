import React, { useState, useEffect } from 'react';
import { Layout, Menu, theme, Drawer, Button } from 'antd';
import { MenuOutlined, ShoppingCartOutlined, AppstoreOutlined, OrderedListOutlined, DollarOutlined } from '@ant-design/icons';
import CategoryManagement from '../components/admin/CategoryManagement';
import ProductManagement from '../components/admin/ProductManagement';
import OrderManagement from '../components/admin/OrderManagement';
import StatisticsDashboard from '../components/admin/StatisticsDashboard';
import CashierRegister from '../components/admin/CashierRegister';
import { notificationService } from '../services/notificationService';

const { Header, Content } = Layout;

const AdminDashboard: React.FC = () => {
    const [selectedMenu, setSelectedMenu] = useState('statistiques');
    const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

    // Démarrer l'écoute des notifications au chargement du composant
    useEffect(() => {
        notificationService.requestNotificationPermission();
        notificationService.startListeningForOrders();

        // Nettoyer à la fermeture
        return () => {
            notificationService.stopListening();
        };
    }, []);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const menuItems = [
        {
            key: 'statistiques',
            label: 'Tableau de bord',
            icon: <OrderedListOutlined />
        },
        {
            key: 'caisse',
            label: 'Caisse',
            icon: <DollarOutlined />
        },
        {
            key: 'products',
            label: 'Produits',
            icon: <ShoppingCartOutlined />
        },
        {
            key: 'categories',
            label: 'Catégories',
            icon: <AppstoreOutlined />
        },
        {
            key: 'orders',
            label: 'Commandes',
            icon: <OrderedListOutlined />
        },
    ];

    const renderContent = () => {
        switch (selectedMenu) {
            case 'caisse':
                return <CashierRegister />;
            case 'products':
                return <ProductManagement />;
            case 'categories':
                return <CategoryManagement />;
            case 'orders':
                return <OrderManagement />;
            case 'statistiques':
                return <StatisticsDashboard/>;
            default:
                return <StatisticsDashboard />;
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ 
                display: 'flex', 
                alignItems: 'center',
                position: 'fixed',
                width: '100%',
                zIndex: 1,
                padding: '0 24px'
            }}>
                <Button
                    type="text"
                    icon={<MenuOutlined />}
                    onClick={() => setMobileMenuVisible(true)}
                    style={{ display: 'block' }}
                />
                <h1 style={{ 
                    color: 'white', 
                    margin: 0,
                    fontSize: '1.5rem',
                    marginLeft: 16
                }}>
                    {/* Tableau de bord */}
                </h1>
            </Header>
            <Layout style={{ marginTop: 64 }}>
                <Drawer
                    title="Menu"
                    placement="left"
                    onClose={() => setMobileMenuVisible(false)}
                    open={mobileMenuVisible}
                    width={250}
                    bodyStyle={{ padding: 0 }}
                    headerStyle={{ 
                        background: '#001529',
                        color: 'white',
                        border: 'none'
                    }}
                >
                    <Menu
                        mode="inline"
                        selectedKeys={[selectedMenu]}
                        items={menuItems}
                        onClick={({ key }) => {
                            setSelectedMenu(key);
                            setMobileMenuVisible(false);
                        }}
                        style={{
                            borderRight: 'none',
                            height: '100%'
                        }}
                        theme="dark"
                    />
                </Drawer>

                <Layout.Sider
                    width={200}
                    style={{
                        background: colorBgContainer,
                        position: 'fixed',
                        left: 0,
                        top: 64,
                        bottom: 0,
                        display: 'block',
                        paddingTop: '50px'
                    }}
                    breakpoint="md"
                    collapsedWidth={0}
                >
                    <Menu
                        mode="inline"
                        selectedKeys={[selectedMenu]}
                        style={{ 
                            height: '100%', 
                            borderRight: 0,
                            paddingTop: '20px'
                        }}
                        items={menuItems}
                        onClick={({ key }) => setSelectedMenu(key)}
                        theme="dark"
                    />
                </Layout.Sider>

                <Layout style={{ 
                    padding: '24px',
                    minHeight: 'calc(100vh - 64px)',
                    marginLeft: 200
                }}>
                    <Content
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                            overflow: 'auto'
                        }}
                    >
                        {renderContent()}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default AdminDashboard; 