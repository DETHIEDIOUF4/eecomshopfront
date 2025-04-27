import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Divider,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import { getOrderById } from '../services/orderService';

interface OrderItem {
  product: {
    _id: string;
    name: string;
    price: number;
    images: string[];
  };
  quantity: number;
}

interface Order {
  _id: string;
  orderItems: OrderItem[];
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  deliveryMethod: 'pickup' | 'delivery';
  shippingAddress?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  orderStatus: string;
  createdAt: Date;
}

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!id) return;
        const response = await getOrderById(id);
        setOrder(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erreur lors du chargement de la commande');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !order) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Commande non trouvée'}</Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Retour à l'accueil
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Commande #{order._id}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR')}
        </Typography>
        
        <Alert 
          severity={order.orderStatus === 'pending' ? 'info' : 'success'}
          sx={{ mb: 3 }}
        >
          Statut : {order.orderStatus}
        </Alert>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Articles commandés
            </Typography>
            {order.orderItems.map((item) => (
              <Paper key={item.product._id} sx={{ p: 2, mb: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={3} sm={2}>
                    <Box
                      component="img"
                      src={item.product.images[0]}
                      alt={item.product.name}
                      sx={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: 1
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} sm={7}>
                    <Typography variant="subtitle1">
                      {item.product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Quantité: {item.quantity}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="subtitle1" align="right">
                      {(item.product.price * item.quantity).toLocaleString('fr-FR')} FCFA
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Récapitulatif
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Informations personnelles
                </Typography>
                <Typography variant="body2">
                  {order.customerInfo.firstName} {order.customerInfo.lastName}
                </Typography>
                <Typography variant="body2">
                  {order.customerInfo.email}
                </Typography>
                <Typography variant="body2">
                  {order.customerInfo.phone}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Livraison
                </Typography>
                <Typography variant="body2">
                  {order.deliveryMethod === 'pickup' ? 'Retrait en magasin' : 'Livraison à domicile'}
                </Typography>
                {order.deliveryMethod === 'delivery' && order.shippingAddress && (
                  <>
                    <Typography variant="body2">
                      {order.shippingAddress.street}
                    </Typography>
                    <Typography variant="body2">
                      {order.shippingAddress.postalCode} {order.shippingAddress.city}
                    </Typography>
                    <Typography variant="body2">
                      {order.shippingAddress.country}
                    </Typography>
                  </>
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Sous-total</Typography>
                  <Typography>{order.itemsPrice.toLocaleString('fr-FR')} FCFA</Typography>
                </Box>
                {order.deliveryMethod === 'delivery' && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Frais de livraison</Typography>
                    <Typography>{order.shippingPrice.toLocaleString('fr-FR')} FCFA</Typography>
                  </Box>
                )}
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1">Total</Typography>
                  <Typography variant="subtitle1">
                    {order.totalPrice.toLocaleString('fr-FR')} FCFA
                  </Typography>
                </Box>
              </Box>
            </Paper>

            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => navigate('/')}
              sx={{ mt: 2 }}
            >
              Continuer mes achats
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default OrderDetails; 