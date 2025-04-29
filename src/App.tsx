import React, { useState, useMemo, useEffect } from 'react';
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
import { BrowserRouter as Router, Routes, Route, useNavigate, Outlet } from 'react-router-dom';
import { store } from './store';
import ProductCard from './components/ProductCard';
import ProductDetails from './pages/ProductDetails';
import CategoryFilter from './components/CategoryFilter';
import Banner from './components/Banner';
import Layout from './components/Layout';
// import { products } from './data/products';
import { Product } from './types';
import Auth from './pages/Auth';
import Checkout from './pages/Checkout';
import { productService } from './services/productService';
import CartReview from './pages/CartReview';
import OrderDetails from './pages/OrderDetails';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider } from './contexts/AuthContext';
import AdminLogin from './pages/AdminLogin';
import { ProtectedRoute } from './components/ProtectedRoute';
import Footer from './components/Footer';

const HomePage: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [showPromotions, setShowPromotions] = useState(false);
  const [priceSort, setPriceSort] = useState<'asc' | 'desc'>('asc');
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const categories = useMemo(() => {
    const uniqueCategories = new Set(products.map((product: Product) => product.category));
    return Array.from(uniqueCategories) as string[];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    // Filtrer par searchTerm (nom ou description)
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
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
      filtered = filtered.filter(product => product.isPromotion);
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
  }, [searchTerm, selectedCategory, priceRange, showPromotions, priceSort, products]);

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
    navigate(`/products/${product._id}`);
  };

  const drawerWidth = 250;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.getAllProducts();
        console.log("response")
        console.log(response);
        setProducts(response);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

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
            <Box sx={{ mb: 3 }}>
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '16px',
                  borderRadius: '4px',
                  border: '2px solid #e53935',
                  outline: 'none',
                  boxSizing: 'border-box',
                  marginBottom: '16px'
                }}
              />
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  fontSize: '16px',
                  borderRadius: '4px',
                  border: '1px solid #ccc'
                }}
              >
                <option value="all">Toutes les catégories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </Box>
            <Grid container spacing={3}>
              {filteredProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product._id}>
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
      <AuthProvider>
        <Router>
          <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#ffffff', flexDirection: 'column' }}>
            <Box sx={{ flex: 1, display: 'flex' }}>
              <Routes>
                <Route path="/" element={<Layout><Outlet /></Layout>}>
                  <Route index element={<HomePage />} />
                  <Route path="/products/:id" element={<ProductDetails />} />
                  <Route path="/checkout/review" element={<CartReview />} />
                  <Route path="/order/:id" element={<OrderDetails />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin" element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />
                </Route>
                <Route path="/auth" element={
                  <Layout>
                    <Auth />
                  </Layout>
                } />
                <Route path="/checkout/info" element={
                  <Layout>
                    <Checkout />
                  </Layout>
                } />
              </Routes>
            </Box>
            <Footer />
          </Box>
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;



