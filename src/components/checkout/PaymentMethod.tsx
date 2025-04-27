import React from 'react';
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel
} from '@mui/material';

const PaymentMethod: React.FC = () => {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Méthode de paiement
      </Typography>
      <FormControl component="fieldset">
        <FormLabel component="legend">Choisissez votre méthode de paiement</FormLabel>
        <RadioGroup>
          <FormControlLabel
            value="mobile_money"
            control={<Radio />}
            label="Mobile Money"
          />
          <FormControlLabel
            value="credit_card"
            control={<Radio />}
            label="Carte de crédit"
          />
          <FormControlLabel
            value="cash"
            control={<Radio />}
            label="Paiement à la livraison"
          />
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default PaymentMethod; 