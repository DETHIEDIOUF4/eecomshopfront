import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  useTheme,
  Chip
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { Product } from '../types';
 
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

// Ton numéro WhatsApp du commercial (au format international sans + ni 00)
const WHATSAPP_NUMBER = "221781541444"; // exemple Sénégal

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  // Fonction pour déterminer le statut du stock
  const getStockStatus = () => {
    if (product.stock === 0) {
      return { type: 'error', message: 'Rupture de stock', color: 'error' as const };
    } else if (product.stock <= 10) {
      return { type: 'warning', message: `Stock faible (${product.stock} restant)`, color: 'warning' as const };
    }
    return null;
  };

  const stockStatus = getStockStatus();

  const handleCardClick = (event: React.MouseEvent<HTMLDivElement>) => {
    onViewDetails(product);
  };

  const handleAddToCartClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    try {
      dispatch(addToCart({ product, quantity: 1 }));
    } catch (e) {
      // Optionally surface error
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
        border: '1px solid rgba(255,255,255,0.06)',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 12px 30px rgba(14,165,233,0.15)'
        }
      }}
      onClick={handleCardClick}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={product.images[0]}
          alt={product.name}
          sx={{ objectFit: 'cover', filter: 'saturate(1.05)' }}
        />
        {stockStatus && (
          <Chip
            label={stockStatus.message}
            color={stockStatus.color}
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              fontWeight: 'bold',
              fontSize: '0.75rem'
            }}
          />
        )}
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div" sx={{ color: 'primary.main' }}>
          {product.name}
        </Typography>
        {(product.brand || product.modelName) && (
          <Box sx={{ mb: 1  } }>
            <Chip size="small" sx={{ color: 'primary.main' }} label={`${product.brand ?? ''} ${product.modelName ?? ''}`.trim()} />
          </Box>
        )}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {product.description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" color="primary">
            {product.price.toLocaleString()} FCFA
          </Typography>
          <Button
            variant="contained"
            color={product.stock === 0 ? "error" : "primary"}
            startIcon={<AddShoppingCartIcon style={{ color: 'black' }} />}
            onClick={handleAddToCartClick}
            disabled={product.stock === 0}
            sx={{
              backgroundColor: product.stock === 0 ? theme.palette.error.main : theme.palette.primary.main,
              '&:hover': {
                backgroundColor: product.stock === 0 ? theme.palette.error.dark : theme.palette.primary.dark,
              }
            }}
          >
            {product.stock === 0 ? 'Rupture' : 'Ajouter'}
          </Button>
          <Button
                
                variant="outlined"
                color="success"
                startIcon={<WhatsAppIcon />}
                onClick={() => {
                  const message = `Bonjour, je suis intéressé par ce produit : 
                  - *${product.name}*
                  - Prix : ${product.price.toLocaleString('fr-FR')} FCFA
                  - Description : ${product.description}
                  📸 Image : ${product.images[0]}`;
                  
                            const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
                            window.open(url, "_blank");
                }}
              >
              </Button>
        
        </Box>
      
      </CardContent>
    </Card>
  );
};

export default ProductCard; 