import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Stepper,
  Step,
  StepLabel,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Divider
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import CartItems from '../components/checkout/CartItem';
import ShippingAddress from '../components/checkout/ShippingAddress';
import PaymentMethod from '../components/checkout/PaymentMethod';
import CustomerInfo from '../components/checkout/CustomerInfo';

const steps = ['Panier', 'Informations', 'Livraison', 'Paiement'];

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const cart = useSelector((state: RootState) => state.cart);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <CartItems />;
      case 1:
        return <CustomerInfo />;
      case 2:
        return <ShippingAddress />;
      case 3:
        return <PaymentMethod />;
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            Votre panier
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate('/')}
          >
            Continuer mes achats
          </Button>
        </Box>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {getStepContent(activeStep)}
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Récapitulatif
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Sous-total</Typography>
              <Typography>{cart.total.toLocaleString('fr-FR')} FCFA</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Livraison</Typography>
              <Typography>Gratuite</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6">{cart.total.toLocaleString('fr-FR')} FCFA</Typography>
            </Box>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              onClick={handleNext}
              disabled={activeStep === steps.length - 1}
            >
              {activeStep === steps.length - 1 ? 'Finaliser la commande' : 'Continuer'}
            </Button>
            {activeStep > 0 && (
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                size="large"
                onClick={handleBack}
                sx={{ mt: 2 }}
              >
                Retour
              </Button>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Checkout; 