import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
  Button,
  useTheme,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import Cart from './Cart';
import logo from '../assets/logo.png';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface LayoutProps {
  children: React.ReactNode;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, onMenuClick, showMenuButton = false }) => {
  const [cartOpen, setCartOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  // Récupérer le nombre total d'articles dans le panier
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
          {showMenuButton && (
            <IconButton
              color="primary"
              edge="start"
              onClick={onMenuClick}
              sx={{ mr: 2, display: { md: 'none' } }}
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
            <img
              src={logo}
              alt="Hello Gassy 3"
              style={{
                height: '50px',
                marginRight: '16px'
              }}
            />
            <Typography
              variant="h6"
              component="div"
              sx={{
                color: 'primary.main',
                fontWeight: 'bold',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              Prêt à garnir
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* <Button
              color="primary"
              startIcon={<PersonOutlineIcon />}
              onClick={() => navigate('/auth')}
              sx={{
                display: { xs: 'none', sm: 'flex' }
              }}
            >
              Connexion
            </Button>
            <IconButton
              color="primary"
              onClick={() => navigate('/auth')}
              sx={{
                display: { xs: 'flex', sm: 'none' }
              }}
            >
              <PersonOutlineIcon />
            </IconButton> */}
            <IconButton
              color="primary"
              onClick={() => setCartOpen(true)}
              sx={{
                backgroundColor: 'rgba(227, 30, 36, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(227, 30, 36, 0.2)',
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
    </>
  );
};

export default Layout; 