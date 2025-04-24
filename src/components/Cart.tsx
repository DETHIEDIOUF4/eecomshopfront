import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  IconButton, 
  Typography, 
  Button, 
  Box,
  TextField,
  Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { RootState } from '../store';
import { removeFromCart, updateQuantity, clearCart } from '../store/cartSlice';

interface CartProps {
  open: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { items, total } = useSelector((state: RootState) => state.cart);

  const handleQuantityChange = (productId: number, quantity: number) => {
    if (quantity > 0) {
      dispatch(updateQuantity({ productId, quantity }));
    }
  };

  const handleRemoveItem = (productId: number) => {
    dispatch(removeFromCart(productId));
  };

  const handleCheckout = () => {
    // Ici, vous pouvez ajouter la logique de paiement
    alert('Merci pour votre commande !');
    dispatch(clearCart());
    onClose();
  };

  return (
    <Drawer 
      anchor="right" 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 400 },
          backgroundColor: '#ffffff'
        }
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' , mt:10}}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          backgroundColor: 'white',
          color: 'red',
          py: 1.5,
          px: 2
        }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            Votre panier
          </Typography>
          <IconButton 
            onClick={onClose}
            sx={{ 
              color: 'red',
              p: 0.5,
              '&:hover': {
                backgroundColor: 'white',
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      

        {items.length === 0 ? (
          <Box sx={{ 
            p: 3, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            justifyContent: 'center',
            flexGrow: 1
          }}>
            <Typography variant="body1" color="text.secondary" align="center">
              Votre panier est vide
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={onClose}
              sx={{ mt: 2 }}
            >
              Continuer vos achats
            </Button>
          </Box>
        ) : (
          <>
            <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
              {items.map((item) => (
                <ListItem 
                  key={item.product.id} 
                  sx={{
                    py: 2,
                    borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {item.product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Prix unitaire: {item.product.price.toLocaleString()} FCFA
                    </Typography>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mt: 1,
                      gap: 2
                    }}>
                      <TextField
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.product.id, parseInt(e.target.value))}
                        inputProps={{ min: 1 }}
                        size="small"
                        sx={{ width: 60 }}
                      />
                      <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                        Total: {(item.quantity * item.product.price).toLocaleString()} FCFA
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton 
                    onClick={() => handleRemoveItem(item.product.id)}
                    sx={{ color: 'error.main' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>

            <Box sx={{ 
              p: 2, 
              borderTop: '1px solid rgba(0, 0, 0, 0.12)',
              backgroundColor: 'grey.50'
            }}>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  fontWeight: 'bold',
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 2
                }}
              >
                <span>Total</span>
                <span>{total.toLocaleString()} FCFA</span>
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={handleCheckout}
                sx={{ py: 1.5 }}
              >
                Commander
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default Cart; 