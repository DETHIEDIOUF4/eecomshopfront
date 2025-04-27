import React from 'react';
import {
  Box,
  TextField,
  Grid,
  Typography
} from '@mui/material';

const ShippingAddress: React.FC = () => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Adresse de livraison
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Adresse"
            name="address"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Ville"
            name="city"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Code postal"
            name="postalCode"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Pays"
            name="country"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ShippingAddress; 