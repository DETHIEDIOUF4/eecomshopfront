import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Box,
  FormControlLabel,
  Checkbox
} from '@mui/material';

const CustomerInfo: React.FC = () => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0' }}>
          <Typography variant="h6" gutterBottom>
            Informations personnelles
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Prénom"
                autoComplete="given-name"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Nom"
                autoComplete="family-name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Email"
                type="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Téléphone"
                type="tel"
                autoComplete="tel"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Préférences de contact
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox color="primary" />}
                  label="M'informer par SMS du statut de ma livraison"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox color="primary" />}
                  label="Recevoir des offres promotionnelles par email"
                />
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0' }}>
          <Typography variant="h6" gutterBottom>
            Informations importantes
          </Typography>
          <Typography variant="body2" paragraph>
            • Vos informations personnelles sont sécurisées et ne seront jamais partagées avec des tiers.
          </Typography>
          <Typography variant="body2" paragraph>
            • Le numéro de téléphone est essentiel pour la livraison et vous tenir informé du statut de votre commande.
          </Typography>
          <Typography variant="body2" paragraph>
            • Un email de confirmation vous sera envoyé après la validation de votre commande.
          </Typography>
          <Typography variant="body2" color="primary">
            Vos données sont protégées conformément à notre politique de confidentialité.
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CustomerInfo; 