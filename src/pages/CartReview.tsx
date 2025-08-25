import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  TextField,
  useTheme,
  useMediaQuery,
  Alert,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogActions,
  Fade
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import CartItems from '../components/checkout/CartItem';
import { createOrder } from '../services/orderService';
import { clearCart } from '../store/cartSlice';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const steps = [
  'Votre panier',
  'Informations personnelles',
  'Adresse de livraison',
  'Récapitulatif'
];

const CartReview: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { items, total } = useSelector((state: RootState) => state.cart);
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    postalCode: '',
    country: 'Sénégal'
  });
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const [personalInfoErrors, setPersonalInfoErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handlePlaceOrder();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleDeliveryMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDeliveryMethod(event.target.value as 'pickup' | 'delivery');
  };

  const handleAddressChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setDeliveryAddress({
      ...deliveryAddress,
      [field]: event.target.value
    });
  };

  const handlePersonalInfoChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPersonalInfo({
      ...personalInfo,
      [field]: value
    });

    // Effacer l'erreur quand l'utilisateur commence à taper
    if (personalInfoErrors[field as keyof typeof personalInfoErrors]) {
      setPersonalInfoErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handlePersonalInfoBlur = (field: string) => () => {
    const value = personalInfo[field as keyof typeof personalInfo];
    let errorMessage = '';
    
    // Validation des champs obligatoires
    if (field === 'firstName' && !value.trim()) {
      errorMessage = 'Le prénom est obligatoire';
    }
    
    if (field === 'lastName' && !value.trim()) {
      errorMessage = 'Le nom est obligatoire';
    }
    
    if (field === 'email') {
      if (!value.trim()) {
        errorMessage = 'L\'email est obligatoire';
      } else if (!validateEmail(value)) {
        errorMessage = 'Veuillez saisir une adresse email valide';
      }
    }
    
    if (field === 'phone') {
      if (!value.trim()) {
        errorMessage = 'Le numéro de téléphone est obligatoire';
      } else if (!validatePhone(value)) {
        errorMessage = 'Veuillez saisir un numéro de téléphone valide (ex: 77 123 45 67)';
      }
    }

    setPersonalInfoErrors(prev => ({
      ...prev,
      [field]: errorMessage
    }));
  };

  // Validation email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validation téléphone (format français/sénégalais)
  const validatePhone = (phone: string) => {
    // Nettoyer le numéro (enlever espaces, tirets, etc.)
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    // Vérifier si c'est un numéro sénégalais (commence par +221 ou 221)
    if (cleanPhone.startsWith('+221') || cleanPhone.startsWith('221')) {
      const senegalPhone = cleanPhone.replace(/^(\+?221)/, '');
      return /^7[0-9]{8}$/.test(senegalPhone);
    }
    
    // Vérifier si c'est un numéro français (commence par +33 ou 33)
    if (cleanPhone.startsWith('+33') || cleanPhone.startsWith('33')) {
      const francePhone = cleanPhone.replace(/^(\+?33)/, '');
      return /^[1-9][0-9]{8}$/.test(francePhone);
    }
    
    // Vérifier si c'est un numéro local (7 chiffres pour Sénégal, 10 chiffres pour France)
    if (cleanPhone.length === 9 && cleanPhone.startsWith('7')) {
      return /^7[0-9]{8}$/.test(cleanPhone);
    }
    
    if (cleanPhone.length === 10) {
      return /^[1-9][0-9]{9}$/.test(cleanPhone);
    }
    
    return false;
  };

  const validateStep = () => {
    switch (activeStep) {
      case 0:
        // Vérifier la quantité minimum basée sur le prix des produits
        let totalQuantity = 0;
        let hasLowPriceItems = false;
        let lowPriceQuantity = 0;
        
        items.forEach(item => {
          if (item.product.price <= 200) {
            // Pour les produits ≤ 200 FCFA, minimum 1 lot (25 pièces)
            hasLowPriceItems = true;
            lowPriceQuantity += item.quantity;
          }
          totalQuantity += item.quantity;
        });
        
        // Si on a des produits ≤ 200 FCFA, vérifier le minimum de 1 lot
        if (hasLowPriceItems) {
          return items.length > 0 && lowPriceQuantity >= 1;
        }
        
        // Sinon, juste vérifier qu'il y a au moins 1 produit
        return items.length > 0 && totalQuantity >= 1;
      case 1:
        return (
          personalInfo.firstName.trim() !== '' &&
          personalInfo.lastName.trim() !== '' &&
          personalInfo.email.trim() !== '' &&
          validateEmail(personalInfo.email) &&
          personalInfo.phone.trim() !== '' &&
          validatePhone(personalInfo.phone)
        );
      case 2:
        if (deliveryMethod === 'delivery') {
          return Object.values(deliveryAddress).every(value => value.trim() !== '');
        }
        return true;
      default:
        return true;
    }
  };

  const handlePlaceOrder = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const orderData = {
        orderItems: items.map(item => ({
          product: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          image: item.product.images[0]
        })),
        personalInfo: {
          firstName: personalInfo.firstName,
          lastName: personalInfo.lastName,
          email: personalInfo.email,
          phone: personalInfo.phone
        },
        deliveryMethod,
        shippingAddress: deliveryMethod === 'delivery' ? deliveryAddress : undefined,
        paymentMethod: 'cash',
        itemsPrice: total,
        shippingPrice: deliveryMethod === 'delivery' ? 2000 : 0,
        taxPrice: 0,
        totalPrice: total + (deliveryMethod === 'delivery' ? 2000 : 0)
      };
      

      const response = await createOrder(orderData);
      setShowSuccessDialog(true);
      
      setTimeout(() => {
        dispatch(clearCart());
        navigate(`/checkout/review`);
      }, 2000);
    } catch (err: any) {
      console.error('Order creation error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Une erreur est survenue lors de la création de la commande';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Articles dans votre panier
            </Typography>
            {(() => {
              let totalQuantity = 0;
              let hasLowPriceItems = false;
              let lowPriceQuantity = 0;
              
              items.forEach(item => {
                if (item.product.price <= 200) {
                  hasLowPriceItems = true;
                  lowPriceQuantity += item.quantity;
                }
                totalQuantity += item.quantity;
              });
              
              if (hasLowPriceItems && lowPriceQuantity < 1) {
                return (
                  <Alert severity="warning" sx={{ mb: 2 }}>
                    Minimum de commande requis : 1 lot (25 pièces) pour les produits ≤ 200 FCFA. 
                    Les produits à bas prix se vendent par lots de 25 pièces. 1 = 25 pièces, 2 = 50 pièces, etc.
                  </Alert>
                );
              }
              return null;
            })()}
            <CartItems />
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Vos informations personnelles
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Prénom"
                  value={personalInfo.firstName}
                  onChange={handlePersonalInfoChange('firstName')}
                  onBlur={handlePersonalInfoBlur('firstName')}
                  error={!!personalInfoErrors.firstName}
                  helperText={personalInfoErrors.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Nom"
                  value={personalInfo.lastName}
                  onChange={handlePersonalInfoChange('lastName')}
                  onBlur={handlePersonalInfoBlur('lastName')}
                  error={!!personalInfoErrors.lastName}
                  helperText={personalInfoErrors.lastName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Email"
                  type="email"
                  value={personalInfo.email}
                  onChange={handlePersonalInfoChange('email')}
                  onBlur={handlePersonalInfoBlur('email')}
                  error={!!personalInfoErrors.email}
                  helperText={personalInfoErrors.email}
                  placeholder="exemple@email.com"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Téléphone"
                  value={personalInfo.phone}
                  onChange={handlePersonalInfoChange('phone')}
                  onBlur={handlePersonalInfoBlur('phone')}
                  error={!!personalInfoErrors.phone}
                  helperText={personalInfoErrors.phone}
                  placeholder="77 123 45 67"
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Mode de livraison
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup value={deliveryMethod} onChange={handleDeliveryMethodChange}>
                <FormControlLabel
                  value="pickup"
                  control={<Radio />}
                  label="Retrait en magasin"
                />
                <FormControlLabel
                  value="delivery"
                  control={<Radio />}
                  label="Livraison à domicile (+2000 FCFA)"
                />
              </RadioGroup>
            </FormControl>

            {deliveryMethod === 'delivery' && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Adresse de livraison
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Adresse"
                      value={deliveryAddress.street}
                      onChange={handleAddressChange('street')}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Ville"
                      value={deliveryAddress.city}
                      onChange={handleAddressChange('city')}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Code postal"
                      value={deliveryAddress.postalCode}
                      onChange={handleAddressChange('postalCode')}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        );
      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Récapitulatif de votre commande
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Paper sx={{ p: 2 }}>
                  <CartItems />
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Détails de livraison
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Informations personnelles
                    </Typography>
                    <Typography variant="body2">
                      {personalInfo.firstName} {personalInfo.lastName}
                    </Typography>
                    <Typography variant="body2">
                      {personalInfo.email}
                    </Typography>
                    <Typography variant="body2">
                      {personalInfo.phone}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" gutterBottom>
                    Mode de livraison
                  </Typography>
                  <Typography variant="body2">
                    {deliveryMethod === 'pickup' ? 'Retrait en magasin' : 'Livraison à domicile'}
                  </Typography>
                  {deliveryMethod === 'delivery' && (
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2">
                        {deliveryAddress.street}
                      </Typography>
                      <Typography variant="body2">
                        {deliveryAddress.postalCode} {deliveryAddress.city}
                      </Typography>
                      <Typography variant="body2">
                        {deliveryAddress.country}
                      </Typography>
                    </Box>
                  )}
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Sous-total</Typography>
                    <Typography>{total.toLocaleString('fr-FR')} FCFA</Typography>
                  </Box>
                  {deliveryMethod === 'delivery' && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>Frais de livraison</Typography>
                      <Typography>2 000 FCFA</Typography>
                    </Box>
                  )}
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6">Total</Typography>
                    <Typography variant="h6">
                      {(total + (deliveryMethod === 'delivery' ? 2000 : 0)).toLocaleString('fr-FR')} FCFA
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  if (items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Votre panier est vide
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Continuer mes achats
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stepper
        activeStep={activeStep}
        alternativeLabel={!isMobile}
        orientation={isMobile ? 'vertical' : 'horizontal'}
        sx={{ mb: 4 }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        {getStepContent(activeStep)}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            disabled={activeStep === 0 || isLoading}
            onClick={handleBack}
          >
            Retour
          </Button>
          <Button
            variant="contained"
            color={!validateStep() ? "error" : "primary"}
            onClick={handleNext}
            disabled={!validateStep() || isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : activeStep === steps.length - 1 ? (
              'Valider la commande'
            ) : activeStep === 0 && (() => {
              let hasLowPriceItems = false;
              let lowPriceQuantity = 0;
              
              items.forEach(item => {
                if (item.product.price <= 200) {
                  hasLowPriceItems = true;
                  lowPriceQuantity += item.quantity;
                }
              });
              
              return hasLowPriceItems && lowPriceQuantity < 1;
            })() ? (
              'Minimum 1 lot requis (≤200 FCFA)'
            ) : (
              'Suivant'
            )}
          </Button>
        </Box>
      </Paper>

      <Dialog
        open={showSuccessDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              py: 3
            }}
          >
            <Fade in={true} timeout={500}>
              <CheckCircleOutlineIcon
                color="success"
                sx={{ fontSize: 60, mb: 2 }}
              />
            </Fade>
            <Typography variant="h6" align="center" gutterBottom>
              Commande validée avec succès !
            </Typography>
            <Typography variant="body2" align="center" color="text.secondary">
              Vous allez être redirigé vers la page de confirmation...
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default CartReview; 