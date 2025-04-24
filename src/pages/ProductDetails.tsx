import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Chip,
  Divider,
  Paper,
  Button,
  TextField,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { products } from '../data/products';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import AddToCartNotification from '../components/AddToCartNotification';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const product = products.find(p => p.id === Number(id));

  if (!product) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h5">Produit non trouvé</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')}>
          Retour aux produits
        </Button>
      </Container>
    );
  }

  const images = product.images.map(image => ({
    original: image,
    thumbnail: image
  }));

  const handleQuantityChange = (value: number) => {
    if (value >= 1) {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    setShowNotification(true);
    
    // Simuler un délai de chargement
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    dispatch(addToCart({
      product,
      quantity
    }));
    
    setIsAddingToCart(false);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/')}
        sx={{ mb: 3 }}
      >
        Retour aux produits
      </Button>

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
            <Typography variant="h4" gutterBottom>
              {product.name}
            </Typography>
            
            <Typography variant="h4" color="primary" gutterBottom>
              {product.price.toLocaleString()} FCFA
            </Typography>
            
            <Typography variant="body1" paragraph>
              {product.detailedDescription}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {product.ingredients && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Ingrédients
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {product.ingredients.map((ingredient, index) => (
                    <Chip
                      key={index}
                      label={ingredient}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            )}

            {product.allergens && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Allergènes
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {product.allergens.map((allergen, index) => (
                    <Chip
                      key={index}
                      label={allergen}
                      color="error"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            )}

            {product.nutritionalInfo && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Informations nutritionnelles
                </Typography>
                <Grid container spacing={2}>
                  {product.nutritionalInfo.calories && (
                    <Grid item xs={6}>
                      <Paper sx={{ p: 1, textAlign: 'center' }}>
                        <Typography variant="subtitle2">Calories</Typography>
                        <Typography variant="h6">{product.nutritionalInfo.calories} kcal</Typography>
                      </Paper>
                    </Grid>
                  )}
                  {product.nutritionalInfo.proteins && (
                    <Grid item xs={6}>
                      <Paper sx={{ p: 1, textAlign: 'center' }}>
                        <Typography variant="subtitle2">Protéines</Typography>
                        <Typography variant="h6">{product.nutritionalInfo.proteins}g</Typography>
                      </Paper>
                    </Grid>
                  )}
                  {product.nutritionalInfo.carbohydrates && (
                    <Grid item xs={6}>
                      <Paper sx={{ p: 1, textAlign: 'center' }}>
                        <Typography variant="subtitle2">Glucides</Typography>
                        <Typography variant="h6">{product.nutritionalInfo.carbohydrates}g</Typography>
                      </Paper>
                    </Grid>
                  )}
                  {product.nutritionalInfo.fats && (
                    <Grid item xs={6}>
                      <Paper sx={{ p: 1, textAlign: 'center' }}>
                        <Typography variant="subtitle2">Lipides</Typography>
                        <Typography variant="h6">{product.nutritionalInfo.fats}g</Typography>
                      </Paper>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}

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
                disabled={isAddingToCart}
                sx={{ 
                  flexGrow: 1,
                  py: 1.5,
                  fontSize: '1.1rem'
                }}
              >
                {isAddingToCart ? 'Ajout en cours...' : `Ajouter au panier (${quantity * product.price} FCFA)`}
              </Button>
            </Box>
          </Box>
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