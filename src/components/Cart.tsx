import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Typography,
  Box,
  Button,
  Divider,
  Paper,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCart } from '../store/cartSlice';
import { CartState } from '../types';

interface CartProps {
  open: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total } = useSelector((state: { cart: CartState }) => state.cart);

  const handleCheckout = () => {
    onClose();
    navigate('/checkout/review');
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: '500px' },
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, mt: 8 }}>
        <Typography variant="h6">
          Votre Panier
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {items.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Votre panier est vide
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={onClose}
            sx={{ mt: 2 }}
          >
            Continuer mes achats
          </Button>
        </Paper>
      ) : (
        <>
          {/* Message d'alerte pour les produits ≤ 200 FCFA */}
          {(() => {
            const hasLowPriceItems = items.some(item => item.product.price <= 200);
            if (hasLowPriceItems) {
              return (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <strong>Information :</strong> Les produits ≤ 200 FCFA se vendent par lots de 25 pièces. 
                  1 lot = 25 pièces, 2 lots = 50 pièces, etc.
                </Alert>
              );
            }
            return null;
          })()}
          
          <List sx={{ flexGrow: 1, overflow: 'auto' }}>
            {items.map((item) => (
              <React.Fragment key={item.product._id}>
                <ListItem
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => dispatch(removeFromCart(item.product._id))}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar
                      src={item.product.images[0]}
                      alt={item.product.name}
                      variant="rounded"
                      sx={{ width: 56, height: 56, mr: 2 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.product.name}
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          {item.product.price <= 200 
                            ? `${item.product.price.toLocaleString('fr-FR')} FCFA x ${item.quantity} lot${item.quantity > 1 ? 's' : ''} de 25 pièces`
                            : `${item.product.price.toLocaleString('fr-FR')} FCFA x ${item.quantity}`
                          }
                        </Typography>
                        <Typography variant="body2" color="primary">
                          Total: {item.product.price <= 200 
                            ? (item.product.price * item.quantity * 25).toLocaleString('fr-FR') + ' FCFA'
                            : (item.product.price * item.quantity).toLocaleString('fr-FR') + ' FCFA'
                          }
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>

          <Box sx={{ mt: 'auto', pt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Récapitulatif
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6">{total.toLocaleString('fr-FR')} FCFA</Typography>
            </Box>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleCheckout}
              sx={{ mt: 2 }}
            >
              Commander
            </Button>
          </Box>
        </>
      )}
    </Drawer>
  );
};

export default Cart; 