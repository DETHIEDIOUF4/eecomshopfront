import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import {
  Box,
  Typography,
  Grid,
  Divider,
  IconButton,
  Button,
  ButtonGroup,
  Paper,
  TextField,
  useTheme,
  useMediaQuery,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { removeFromCart, updateQuantity } from '../../store/cartSlice';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { CartItem as CartItemType } from '../../types';

const CartItems: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total } = useSelector((state: RootState) => state.cart);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleRemoveFromCart = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      try {
        dispatch(updateQuantity({ productId, quantity: newQuantity }));
      } catch (error: any) {
        alert(error.message);
      }
    } else {
      dispatch(removeFromCart(productId));
    }
  };

  const handleCheckout = () => {
    navigate('/checkout/review');
  };

  return (
    <Box>
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
      
      {items.map((item) => (
        <Paper 
          key={item.product._id}
          elevation={0}
          sx={{ 
            p: 2, 
            mb: 2,
            border: '1px solid',
            borderColor: 'divider',
            '&:last-child': { mb: 0 }
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={2}>
              <Box
                component="img"
                src={item.product.images[0]}
                alt={item.product.name}
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 1,
                  objectFit: 'cover'
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Typography variant="subtitle1" fontWeight="medium">
                {item.product.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.product.description}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={3}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: isMobile ? 'flex-start' : 'center',
                gap: 1 
              }}>
                <IconButton
                  onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                  size="small"
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1
                  }}
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
                
                <TextField
                  value={item.quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value)) {
                      handleQuantityChange(item.product._id, value);
                    }
                  }}
                  type="number"
                  size="small"
                  inputProps={{ 
                    min: 1,
                    style: { 
                      textAlign: 'center',
                      width: '40px',
                      padding: '4px'
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'divider',
                      },
                    }
                  }}
                />

                <IconButton
                  onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                  size="small"
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1
                  }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>
            </Grid>

            <Grid item xs={12} sm={3}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: isMobile ? 'flex-start' : 'flex-end',
                alignItems: 'center' 
              }}>
                <Typography variant="subtitle1" fontWeight="medium">
                  {item.product.price <= 200 
                    ? (item.product.price * item.quantity * 25).toLocaleString('fr-FR') + ' FCFA'
                    : (item.product.price * item.quantity).toLocaleString('fr-FR') + ' FCFA'
                  }
                </Typography>
                {item.product.price <= 200 && (
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                    ({item.quantity} lot{item.quantity > 1 ? 's' : ''} de 25)
                  </Typography>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} sm={1}>
              <IconButton 
                onClick={() => handleRemoveFromCart(item.product._id)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Paper>
      ))}
      
      <Paper sx={{ p: 3, mt: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            Total: {total.toLocaleString('fr-FR')} FCFA
          </Typography>
          {/* <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleCheckout}
            disabled={items.length === 0}
          >
            Commander
          </Button> */}
        </Box>
      </Paper>
    </Box>
  );
};

export default CartItems; 