import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  Divider,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { CartState } from '../../types';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface OrderConfirmationProps {
  cart: CartState;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ cart }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={8}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 1.5, sm: 2 }, 
            border: '1px solid #e0e0e0',
            mb: { xs: 2, md: 0 }
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 2,
            flexWrap: 'wrap'
          }}>
            <CheckCircleIcon color="success" sx={{ mr: 1, fontSize: 24 }} />
            <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontWeight: 'bold' }}>
              Récapitulatif de votre commande
            </Typography>
          </Box>

          <List sx={{ p: 0 }}>
            {cart.items.map((item) => (
              <ListItem 
                key={item.product._id} 
                sx={{ 
                  py: 1.5,
                  px: { xs: 0, sm: 1 },
                  borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
                }}
              >
                <Grid container spacing={1} alignItems="center">
                  <Grid item xs={3} sm={2}>
                    <Box
                      component="img"
                      sx={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: 1,
                        minWidth: '50px'
                      }}
                      src={item.product.images[0]}
                      alt={item.product.name}
                    />
                  </Grid>
                  <Grid item xs={6} sm={7}>
                    <Typography 
                      variant={isMobile ? "body2" : "subtitle1"} 
                      sx={{ fontWeight: 'bold' }}
                    >
                      {item.product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Quantité: {item.product.price <= 200 
                        ? `${item.quantity} lot${item.quantity > 1 ? 's' : ''} de 25 pièces`
                        : item.quantity
                      }
                    </Typography>
                  </Grid>
                  <Grid item xs={3} sm={3}>
                    <Typography 
                      variant={isMobile ? "body2" : "subtitle1"} 
                      align="right" 
                      sx={{ fontWeight: 'bold' }}
                    >
                      {item.product.price <= 200 
                        ? (item.quantity * item.product.price * 25).toLocaleString() + ' FCFA'
                        : (item.quantity * item.product.price).toLocaleString() + ' FCFA'
                      }
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 1.5, sm: 2 }, 
            border: '1px solid #e0e0e0', 
            mb: 2 
          }}
        >
          <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom sx={{ fontWeight: 'bold' }}>
            Détails de livraison
          </Typography>
          <List sx={{ p: 0 }}>
            <ListItem sx={{ px: 0 }}>
              <ListItemText 
                primary={
                  <Typography variant={isMobile ? "body2" : "subtitle2"}>
                    Méthode de livraison
                  </Typography>
                }
                secondary={
                  <Typography variant={isMobile ? "body2" : "body1"}>
                    Livraison Standard
                  </Typography>
                }
              />
              <Chip 
                label="24-48h" 
                size="small" 
                sx={{ 
                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                  height: isMobile ? '24px' : '32px'
                }} 
              />
            </ListItem>
            <Divider />
            <ListItem sx={{ px: 0 }}>
              <ListItemText 
                primary={
                  <Typography variant={isMobile ? "body2" : "subtitle2"}>
                    Adresse de livraison
                  </Typography>
                }
                secondary={
                  <Typography variant={isMobile ? "body2" : "body1"}>
                    123 Rue Example, Quartier, Ville
                  </Typography>
                }
              />
            </ListItem>
          </List>
        </Paper>

        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 1.5, sm: 2 }, 
            border: '1px solid #e0e0e0' 
          }}
        >
          <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom sx={{ fontWeight: 'bold' }}>
            Résumé des coûts
          </Typography>
          <List sx={{ p: 0 }}>
            <ListItem sx={{ py: 1, px: 0 }}>
              <ListItemText 
                primary={
                  <Typography variant={isMobile ? "body2" : "subtitle2"}>
                    Sous-total
                  </Typography>
                }
              />
              <Typography variant={isMobile ? "body2" : "subtitle1"}>
                {cart.total.toLocaleString()} FCFA
              </Typography>
            </ListItem>
            <ListItem sx={{ py: 1, px: 0 }}>
              <ListItemText 
                primary={
                  <Typography variant={isMobile ? "body2" : "subtitle2"}>
                    Frais de livraison
                  </Typography>
                }
              />
              <Typography variant={isMobile ? "body2" : "subtitle1"}>
                1000 FCFA
              </Typography>
            </ListItem>
            <ListItem sx={{ py: 1, px: 0 }}>
              <ListItemText 
                primary={
                  <Typography variant={isMobile ? "body2" : "subtitle2"}>
                    Réduction
                  </Typography>
                }
              />
              <Typography variant={isMobile ? "body2" : "subtitle1"} color="error">
                -0 FCFA
              </Typography>
            </ListItem>
            <Divider />
            <ListItem sx={{ py: 1.5, px: 0 }}>
              <ListItemText 
                primary={
                  <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontWeight: 'bold' }}>
                    Total
                  </Typography>
                }
              />
              <Typography 
                variant={isMobile ? "subtitle1" : "h6"} 
                color="primary" 
                sx={{ fontWeight: 'bold' }}
              >
                {(cart.total + 1000).toLocaleString()} FCFA
              </Typography>
            </ListItem>
          </List>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default OrderConfirmation; 