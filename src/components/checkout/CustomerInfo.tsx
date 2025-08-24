import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Box,
  FormControlLabel,
  Checkbox
} from '@mui/material';

interface CustomerInfoProps {
  onValidationChange?: (isValid: boolean) => void;
}

const CustomerInfo: React.FC<CustomerInfoProps> = ({ onValidationChange }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Effacer l'erreur quand l'utilisateur commence à taper
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleBlur = (field: string) => {
    const value = formData[field as keyof typeof formData];
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

    setErrors(prev => ({
      ...prev,
      [field]: errorMessage
    }));
  };

  // Vérifier si le formulaire est valide
  const isFormValid = () => {
    return (
      formData.firstName.trim() !== '' &&
      formData.lastName.trim() !== '' &&
      formData.email.trim() !== '' &&
      validateEmail(formData.email) &&
      formData.phone.trim() !== '' &&
      validatePhone(formData.phone) &&
      Object.values(errors).every(error => error === '')
    );
  };

  // Notifier le parent du changement de validation
  React.useEffect(() => {
    if (onValidationChange) {
      onValidationChange(isFormValid());
    }
  }, [formData, errors, onValidationChange]);

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
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                onBlur={() => handleBlur('firstName')}
                error={!!errors.firstName}
                helperText={errors.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Nom"
                autoComplete="family-name"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                onBlur={() => handleBlur('lastName')}
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                error={!!errors.email}
                helperText={errors.email}
                placeholder="exemple@email.com"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Téléphone"
                type="tel"
                autoComplete="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                onBlur={() => handleBlur('phone')}
                error={!!errors.phone}
                helperText={errors.phone}
                placeholder="77 123 45 67"
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