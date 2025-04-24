import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Grid, 
  Container, 
  Paper,
  Drawer,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { store } from './store';
import ProductCard from './components/ProductCard';
import ProductDetails from './pages/ProductDetails';
import CategoryFilter from './components/CategoryFilter';
import Banner from './components/Banner';
import Layout from './components/Layout';
import { products } from './data/products';
import { Product } from './types';
import Auth from './pages/Auth';

const HomePage: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [showPromotions, setShowPromotions] = useState(false);
  const [priceSort, setPriceSort] = useState<'asc' | 'desc'>('asc');
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const categories = useMemo(() => {
    const uniqueCategories = new Set(products.map(product => product.category));
    return Array.from(uniqueCategories);
  }, []);

  const filteredProducts = useMemo(() => {
    // Commencer avec tous les produits
    let filtered = [...products];

    // Filtrer par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filtrer par fourchette de prix
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Filtrer les promotions si activé
    if (showPromotions) {
      filtered = filtered.filter(product => product.isPromotion); // Vous devrez ajouter cette propriété à votre type Product
    }

    // Trier par prix
    filtered.sort((a, b) => {
      if (priceSort === 'asc') {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });

    return filtered;
  }, [selectedCategory, priceRange, showPromotions, priceSort]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const handlePriceRangeChange = (range: [number, number]) => {
    setPriceRange(range);
  };

  const handlePromotionFilter = () => {
    setShowPromotions(!showPromotions);
  };

  const handlePriceSort = (order: 'asc' | 'desc') => {
    setPriceSort(order);
  };

  const handleViewDetails = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  const drawerWidth = 250;

  return (
    <Layout showMenuButton onMenuClick={() => setDrawerOpen(!drawerOpen)}>
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            marginTop: '64px',
            backgroundColor: 'white',
            borderRight: 'none',
            boxShadow: 2
          },
        }}
      >
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          onPriceRangeChange={handlePriceRangeChange}
          onPromotionFilter={handlePromotionFilter}
          onPriceSort={handlePriceSort}
        />
      </Drawer>

      <Box
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          marginLeft: { md: `${drawerWidth}px` }
        }}
      >
        <Container maxWidth="lg">
          <Banner />
          <Paper 
            elevation={0}
            sx={{ 
              p: 3,
              backgroundColor: '#ffffff'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: 'primary.main',
                  fontWeight: 'bold'
                }}
              >
                {selectedCategory === 'all' ? 'Tous nos produits' : selectedCategory}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
              </Typography>
            </Box>
            <Grid container spacing={3}>
              {filteredProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                  <ProductCard 
                    product={product} 
                    onViewDetails={handleViewDetails}
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Container>
      </Box>
    </Layout>
  );
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#ffffff' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={
              <Layout>
                <ProductDetails />
              </Layout>
            } />
            <Route path="/auth" element={
              <Layout>
                <Auth />
              </Layout>
            } />
          </Routes>
        </Box>
      </Router>
    </Provider>
  );
}

export default App;



