import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
  useTheme,
  Drawer,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Cart from './Cart';
import logo from '../assets/logo.jpg';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import CategoryFilter from './CategoryFilter';
import { categoryService } from '../services/categoryService';

interface LayoutProps {
  children: React.ReactNode;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, onMenuClick, showMenuButton = false }) => {
  const [cartOpen, setCartOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    categoryService.getAllCategories()
      .then((data) => {
        try {
          // data may be array of objects; normalize to string[] of names
          const names = Array.isArray(data)
            ? data.map((c: any) => (typeof c === 'string' ? c : c?.name)).filter(Boolean)
            : [];
          setCategories(names as string[]);
        } catch {
          setCategories([]);
        }
      })
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSelectedCategory(params.get('category') || 'all');
  }, [location.search]);

  const handleCategoryChange = (cat: string) => {
    const params = new URLSearchParams(location.search);
    if (cat === 'all') params.delete('category'); else params.set('category', cat);
    navigate({ pathname: '/', search: params.toString() });
    setFilterOpen(false);
  };

  // total items in cart
  const cartItemsCount = useSelector((state: RootState) => 
    state.cart.items.reduce((total, item) => total + item.quantity, 0)
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: 'white',
          boxShadow: 1,
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Toolbar>
          {(showMenuButton || isMobile) && (
            <IconButton
              color="primary"
              edge="start"
              onClick={onMenuClick || (() => setFilterOpen(true))}
              sx={{ mr: 2, display: { md: 'none' } }}
              aria-label="ouvrir le menu"
            >
              <MenuIcon />
            </IconButton>
          )}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              flexGrow: 1,
              cursor: 'pointer' 
            }}
            onClick={() => navigate('/')}
          >
            {
              <img
                src={logo}
                alt="ElectronicShop"
                style={{
                  height: '50px',
                  marginRight: '16px'
                }}
              />
            }
            <Typography
              variant="h6"
              component="div"
              sx={{
                color: 'primary.main',
                fontWeight: 'bold',
                display: { xs: 'none', sm: 'block' }
              }}
              >
             
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <IconButton
              color="primary"
              onClick={() => setCartOpen(true)}
              sx={{
                backgroundColor: 'rgba(14, 165, 233, 0.12)',
                '&:hover': {
                  backgroundColor: 'rgba(14, 165, 233, 0.2)',
                }
              }}
            >
              <Badge 
                badgeContent={cartItemsCount} 
                color="primary"
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    fontWeight: 'bold',
                    minWidth: '20px',
                    height: '20px',
                    padding: '0 6px',
                    fontSize: '0.75rem'
                  }
                }}
              >
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          marginTop: '64px'
        }}
      >
        {children}
      </Box>

      <Cart open={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Drawer mobile for categories/filters */}
      <Drawer
        anchor="left"
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        sx={{ display: { xs: 'block', md: 'none' } }}
        ModalProps={{ keepMounted: true }}
      >
        <Box sx={{ width: 280, p: 1 }}>
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </Box>
      </Drawer>

    </>
  );
};

export default Layout; 