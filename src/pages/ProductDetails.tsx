import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  Chip,
  TextField
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { productService } from '../services/productService';
import { Product } from '../types';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import AddToCartNotification from '../components/AddToCartNotification';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showNotification, setShowNotification] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  React.useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) return;
        const response = await productService.getProduct(id);
        setProduct(response);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement du produit');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (value: number) => {
    if (value >= 1) {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    if (product) {
      setIsAddingToCart(true);
      setShowNotification(true);

      try {
        // Simuler un délai de chargement
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        dispatch(addToCart({
          product,
          quantity
        }));
        
        setIsAddingToCart(false);
        
        
      } catch (error) {
        console.error('Erreur lors de l\'ajout au panier:', error);
        setIsAddingToCart(false);
        setShowNotification(false);
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Produit non trouvé'}</Alert>
      </Container>
    );
  }

  const images = product.images.map(image => ({
    original: image,
    thumbnail: image
  }));

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 2 }}>
            <ImageGallery
              items={images}
              showPlayButton={false}
              showFullscreenButton={true}
              showThumbnails={true}
              thumbnailPosition="left"
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {product.name}
            </Typography>
            <Typography variant="h5" color="primary" gutterBottom>
              {product.price.toLocaleString('fr-FR')} FCFA
            </Typography>
            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>
            <Typography variant="body1" paragraph>
              {product.detailedDescription}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Caractéristiques
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {product.features?.map((feature, index) => (
                  <Chip
                    key={index}
                    label={feature}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>

            

            

            {(product.brand || product.modelName) && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Modèle
                </Typography>
                <Chip
                  label={`${product.brand ?? ''} ${product.modelName ?? ''}`.trim()}
                  color="primary"
                  variant="filled"
                />
              </Box>
            )}

            {product.specs && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Spécifications
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {Object.entries(product.specs).map(([key, value]) => (
                    <Chip key={key} label={`${key}: ${value}`} variant="outlined" />
                  ))}
                </Box>
              </Box>
            )}

            <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton 
                  onClick={() => handleQuantityChange(quantity - 1)}
                  sx={{ 
                    backgroundColor: 'rgba(14, 165, 233, 0.12)',
                    '&:hover': {
                      backgroundColor: 'rgba(14, 165, 233, 0.2)',
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
                    backgroundColor: 'rgba(14, 165, 233, 0.12)',
                    '&:hover': {
                      backgroundColor: 'rgba(14, 165, 233, 0.2)',
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
                disabled={product.stock === 0 || isAddingToCart}
                sx={{ 
                  flexGrow: 1,
                  py: 1.5,
                  fontSize: '1.1rem'
                }}
              >
                {product.stock > 0 
                  ? `Valider (${(quantity * product.price).toLocaleString('fr-FR')} FCFA)`
                  : 'Rupture de stock'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <AddToCartNotification
        open={showNotification}
        onClose={() => setShowNotification(false)}
        productName={product.name}
        quantity={quantity}
        loading={isAddingToCart}
      />
    </Container>
  );
};

export default ProductDetails; 