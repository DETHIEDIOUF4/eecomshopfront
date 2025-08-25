import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Input,
  Button,
  Table,
  Typography,
  Divider,
  Modal,
  Form,
  message,
  Tag,
  Space,
  Select,
  InputNumber,
  Alert
} from 'antd';
import { SearchOutlined, PlusOutlined, DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Product, productService } from '../../services/productService';
import { createOrder } from '../../services/orderService';
import { notificationService } from '../../services/notificationService';

const { Option } = Select;
const { Title, Text } = Typography;

interface CartItem {
  product: Product;
  quantity: number;
  price: number;
}

const CashierRegister: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [customerModalVisible, setCustomerModalVisible] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (error) {
      message.error('Erreur lors du chargement des produits');
    }
  };

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product._id === product._id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.product._id === product._id 
          ? { 
              ...item, 
              quantity: item.quantity + 1,
              price: product.price <= 200 
                ? product.price * (item.quantity + 1) * 25 // Lots de 25 pièces
                : product.price * (item.quantity + 1) // Vente normale
            }
          : item
      ));
    } else {
      setCart([...cart, { 
        product, 
        quantity: 1, 
        price: product.price <= 200 ? product.price * 25 : product.price // Lots de 25 pièces
      }]);
    }
    message.success(`${product.name} ajouté au panier`);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(cart.map(item => 
      item.product._id === productId 
        ? { 
            ...item, 
            quantity, 
            price: item.product.price <= 200 
              ? item.product.price * quantity * 25 // Lots de 25 pièces
              : item.product.price * quantity // Vente normale
          }
        : item
    ));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product._id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    message.info('Panier vidé');
  };

  const getTotalQuantity = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.price, 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      message.warning('Le panier est vide');
      return;
    }

    // Vérifier la quantité minimum basée sur le prix des produits
    let totalQuantity = 0;
    let hasLowPriceItems = false;
    let lowPriceQuantity = 0;
    
    cart.forEach(item => {
      if (item.product.price <= 200) {
        hasLowPriceItems = true;
        lowPriceQuantity += item.quantity;
      }
      totalQuantity += item.quantity;
    });
    
    // Si on a des produits ≤ 200 FCFA, vérifier le minimum de 1 lot
    if (hasLowPriceItems && lowPriceQuantity < 1) {
      message.error(`Minimum de commande requis : 1 lot (25 pièces) pour les produits ≤ 200 FCFA. Les produits à bas prix se vendent par lots de 25 pièces. 1 = 25 pièces, 2 = 50 pièces, etc.`);
      return;
    }

    setCustomerModalVisible(true);
  };

  const handleCustomerSubmit = async () => {
    if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.phone) {
      message.error('Veuillez remplir les informations obligatoires');
      return;
    }

    try {
      setLoading(true);
      
      const orderData = {
        orderItems: cart.map(item => ({
          product: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          image: item.product.images[0]
        })),
        personalInfo: {
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName,
          email: customerInfo.email || 'caissier@magasin.com',
          phone: customerInfo.phone
        },
        deliveryMethod: 'pickup' as const,
        paymentMethod: 'cash',
        itemsPrice: getTotalPrice(),
        shippingPrice: 0,
        taxPrice: 0,
        totalPrice: getTotalPrice()
      };

      const createdOrder = await createOrder(orderData);
      message.success('Commande créée avec succès !');
      
      // Déclencher la notification sonore pour tous les appareils connectés
      notificationService.playNotificationSound();
      
      // Réinitialiser
      setCart([]);
      setCustomerInfo({ firstName: '', lastName: '', email: '', phone: '' });
      setCustomerModalVisible(false);
    } catch (error) {
      message.error('Erreur lors de la création de la commande');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cartColumns = [
    {
      title: 'Produit',
      dataIndex: 'product',
      key: 'product',
      render: (product: Product) => product.name,
    },
    {
      title: 'Prix unit.',
      dataIndex: 'product',
      key: 'price',
      render: (product: Product) => `${product.price.toLocaleString('fr-FR')} FCFA`,
    },
    {
      title: 'Quantité',
      key: 'quantity',
      render: (record: CartItem) => (
        <InputNumber
          min={1}
          value={record.quantity}
          onChange={(value) => updateQuantity(record.product._id, value || 1)}
          size="small"
        />
      ),
    },
    {
      title: 'Total',
      key: 'total',
      render: (record: CartItem) => (
        <div>
          <div>{record.price.toLocaleString('fr-FR')} FCFA</div>
          {record.product.price <= 200 && (
            <div style={{ fontSize: '12px', color: '#666' }}>
              ({record.quantity} lot{record.quantity > 1 ? 's' : ''} de 25)
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: CartItem) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeFromCart(record.product._id)}
          size="small"
        />
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>Caisse - Passage de commande</Title>
      
      <Row gutter={[24, 24]}>
        {/* Section Produits */}
        <Col xs={24} lg={16}>
          <Card title="Produits disponibles" extra={
            <Space>
              <Input
                placeholder="Rechercher un produit..."
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: 250 }}
              />
            </Space>
          }>
            <Row gutter={[16, 16]}>
              {filteredProducts.map(product => (
                <Col xs={12} sm={8} md={6} key={product._id}>
                  <Card
                    hoverable
                    size="small"
                    cover={
                      <img
                        alt={product.name}
                        src={product.images[0]}
                        style={{ height: 120, objectFit: 'cover' }}
                      />
                    }
                    actions={[
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => addToCart(product)}
                        size="small"
                      >
                        Ajouter
                      </Button>
                    ]}
                  >
                    <Card.Meta
                      title={product.name}
                      description={
                        <div>
                          <Text strong>{product.price.toLocaleString('fr-FR')} FCFA</Text>
                          <br />
                          <Tag color="blue">{product.category}</Tag>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        {/* Section Panier */}
        <Col xs={24} lg={8}>
          <Card 
            title={
              <Space>
                <ShoppingCartOutlined />
                Panier ({getTotalQuantity()} articles)
              </Space>
            }
            extra={
              <Button 
                type="text" 
                danger 
                onClick={clearCart}
                disabled={cart.length === 0}
              >
                Vider
              </Button>
            }
          >
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <ShoppingCartOutlined style={{ fontSize: 48, color: '#ccc' }} />
                <br />
                <Text type="secondary">Panier vide</Text>
              </div>
            ) : (
              <>
                <Table
                  dataSource={cart}
                  columns={cartColumns}
                  pagination={false}
                  size="small"
                  rowKey={(record) => record.product._id}
                />
                
                <Divider />
                
                <div style={{ textAlign: 'right' }}>
                  <Text strong>Total: {getTotalPrice().toLocaleString('fr-FR')} FCFA</Text>
                </div>
                
                {(() => {
                  let hasLowPriceItems = false;
                  let lowPriceQuantity = 0;
                  
                  cart.forEach(item => {
                    if (item.product.price <= 200) {
                      hasLowPriceItems = true;
                      lowPriceQuantity += item.quantity;
                    }
                  });
                  
                  if (hasLowPriceItems && lowPriceQuantity < 1) {
                    return (
                      <Alert
                        message="Minimum requis"
                        description="Minimum de commande : 1 lot (25 pièces) pour les produits ≤ 200 FCFA. Les produits à bas prix se vendent par lots de 25 pièces. 1 = 25 pièces, 2 = 50 pièces, etc."
                        type="warning"
                        showIcon
                        style={{ marginTop: 16 }}
                      />
                    );
                  }
                  return null;
                })()}
                
                <Button
                  type="primary"
                  size="large"
                  block
                  onClick={handleCheckout}
                  disabled={cart.length === 0 || (() => {
                    let hasLowPriceItems = false;
                    let lowPriceQuantity = 0;
                    
                    cart.forEach(item => {
                      if (item.product.price <= 200) {
                        hasLowPriceItems = true;
                        lowPriceQuantity += item.quantity;
                      }
                    });
                    
                    return hasLowPriceItems && lowPriceQuantity < 1;
                  })()}
                  style={{ marginTop: 16 }}
                >
                  Finaliser la commande
                </Button>
              </>
            )}
          </Card>
        </Col>
      </Row>

      {/* Modal Informations Client */}
      <Modal
        title="Informations du client"
        open={customerModalVisible}
        onOk={handleCustomerSubmit}
        onCancel={() => setCustomerModalVisible(false)}
        confirmLoading={loading}
        okText="Créer la commande"
        cancelText="Annuler"
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Prénom"
                required
              >
                <Input
                  value={customerInfo.firstName}
                  onChange={(e) => setCustomerInfo({...customerInfo, firstName: e.target.value})}
                  placeholder="Prénom"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Nom"
                required
              >
                <Input
                  value={customerInfo.lastName}
                  onChange={(e) => setCustomerInfo({...customerInfo, lastName: e.target.value})}
                  placeholder="Nom"
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Téléphone"
                required
              >
                <Input
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  placeholder="77 123 45 67"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Email (optionnel)"
              >
                <Input
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                  placeholder="email@exemple.com"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default CashierRegister;
