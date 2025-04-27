import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Dashboard, ShoppingCart, People, Inventory } from '@mui/icons-material';
import OrdersList from '../components/admin/OrdersList';
import ProductsList from '../components/admin/ProductsList';
import UsersList from '../components/admin/UsersList';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
    
  }, [user, navigate]);

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return <OrdersList />;
      case 'products':
        return <ProductsList />;
      case 'users':
        return <UsersList />;
      default:
        return <OrdersList />;
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <List>
              <ListItem button onClick={() => setActiveTab('orders')}>
                <ListItemIcon>
                  <ShoppingCart />
                </ListItemIcon>
                <ListItemText primary="Commandes" />
              </ListItem>
              <ListItem button onClick={() => setActiveTab('products')}>
                <ListItemIcon>
                  <Inventory />
                </ListItemIcon>
                <ListItemText primary="Produits" />
              </ListItem>
              <ListItem button onClick={() => setActiveTab('users')}>
                <ListItemIcon>
                  <People />
                </ListItemIcon>
                <ListItemText primary="Utilisateurs" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 2 }}>
            {renderContent()}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard; 