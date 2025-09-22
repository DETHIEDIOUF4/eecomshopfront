import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Box,
  Typography,
  Grid,
  Chip,
  Divider,
  Paper,
  useTheme,
  useMediaQuery,
  Button,
  TextField,
  InputAdornment
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Product } from '../types';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';

interface ProductDetailProps {
  product: Product;
  open: boolean;
  onClose: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);

  const images = product.images.map(image => ({
    original: image,
    thumbnail: image
  }));

  const handleQuantityChange = (value: number) => {
    if (value >= 1) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    dispatch(addToCart({
      product,
      quantity
    }));
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" color="primary" fontWeight="bold">
            {product.name}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 2 }}>
              <ImageGallery
                items={images}
                showPlayButton={false}
                showFullscreenButton={!isMobile}
                showThumbnails={!isMobile}
                thumbnailPosition={isMobile ? 'bottom' : 'left'}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h4" color="primary" gutterBottom>
                {product.price.toLocaleString()} FCFA
              </Typography>
              
              <Typography variant="body1" paragraph>
                {product.detailedDescription}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Ingrédients
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {product.ingredients?.map((ingredient, index) => (
                    <Chip
                      key={index}
                      label={ingredient}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>

              

              

              {product.preparationTime && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Temps de préparation
                  </Typography>
                  <Chip
                    label={product.preparationTime}
                    color="primary"
                    variant="filled"
                  />
                </Box>
              )}

              <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton 
                    onClick={() => handleQuantityChange(quantity - 1)}
                    sx={{ 
                      backgroundColor: 'rgba(227, 30, 36, 0.1)',
                      '&:hover': {
                        backgroundColor: 'rgba(227, 30, 36, 0.2)',
                      }
                    }}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <TextField
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    type="number"
                    inputProps={{ min: 1 }}
                    sx={{ width: '80px' }}
                  />
                  <IconButton 
                    onClick={() => handleQuantityChange(quantity + 1)}
                    sx={{ 
                      backgroundColor: 'rgba(227, 30, 36, 0.1)',
                      '&:hover': {
                        backgroundColor: 'rgba(227, 30, 36, 0.2)',
                      }
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleAddToCart}
                  sx={{ 
                    flexGrow: 1,
                    py: 1.5,
                    fontSize: '1.1rem'
                  }}
                >
                 Ajouter ({quantity * product.price} FCFA)
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetail; 