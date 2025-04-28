import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography } from '@mui/material';
import axios from 'axios';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('https://hellogassy-backend.onrender.com/api/orders', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      await axios.put(`https://hellogassy-backend.onrender.com/api/orders/${orderId}/status`, 
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      // Refresh orders list
      const response = await axios.get('https://hellogassy-backend.onrender.com/api/orders', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  if (loading) return <Typography>Chargement...</Typography>;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Client</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Statut</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {[...orders]
      .sort((a:any, b:any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((order: any) => (
      <TableRow key={order._id}>
      <TableCell>{order._id}</TableCell>
      <TableCell>{order.personalInfo.firstName} {order.personalInfo.lastName}</TableCell>
      <TableCell>{order.totalPrice} FCFA</TableCell>
      <TableCell>{order.status}</TableCell>
      <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
      <TableCell>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleUpdateStatus(order._id, 'processing')}
          disabled={order.status === 'processing'}
        >
          En cours
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={() => handleUpdateStatus(order._id, 'delivered')}
          disabled={order.status === 'delivered'}
          sx={{ ml: 1 }}
        >
          Livré
        </Button>
      </TableCell>
    </TableRow>
))}
          {/* {orders.map((order: any) => (
            <TableRow key={order._id}>
              <TableCell>{order._id}</TableCell>
              <TableCell>{order.personalInfo.firstName} {order.personalInfo.lastName}</TableCell>
              <TableCell>{order.totalPrice} FCFA</TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => handleUpdateStatus(order._id, 'processing')}
                  disabled={order.status === 'processing'}
                >
                  En cours
                </Button>
                <Button 
                  variant="contained" 
                  color="success"
                  onClick={() => handleUpdateStatus(order._id, 'delivered')}
                  disabled={order.status === 'delivered'}
                  sx={{ ml: 1 }}
                >
                  Livré
                </Button>
              </TableCell>
            </TableRow>
          ))} */}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrdersList; 