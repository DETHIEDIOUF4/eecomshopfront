import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/lab';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import HomeIcon from '@mui/icons-material/Home';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const DeliveryOptions: React.FC = () => {
  const [deliveryMethod, setDeliveryMethod] = useState('standard');

  const deliveryTimes = {
    standard: '24-48 heures',
    express: '12-24 heures'
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0' }}>
          <Typography variant="h6" gutterBottom>
            Options de livraison
          </Typography>
          
          <RadioGroup
            value={deliveryMethod}
            onChange={(e) => setDeliveryMethod(e.target.value)}
          >
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                value="standard"
                control={<Radio />}
                label={
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      Livraison Standard - 1000 FCFA
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Livraison en {deliveryTimes.standard}
                    </Typography>
                  </Box>
                }
              />
            </Box>

            <Box>
              <FormControlLabel
                value="express"
                control={<Radio />}
                label={
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      Livraison Express - 2000 FCFA
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Livraison en {deliveryTimes.express}
                    </Typography>
                  </Box>
                }
              />
            </Box>
          </RadioGroup>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Adresse de livraison
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Adresse complète"
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Ville"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Quartier"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Instructions spéciales"
                  multiline
                  rows={2}
                  placeholder="Points de repère, instructions pour le livreur..."
                />
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper elevation={0} sx={{ p: 2, border: '1px solid #e0e0e0' }}>
          <Typography variant="h6" gutterBottom>
            Suivi de commande
          </Typography>
          
          <Timeline>
            <TimelineItem>
              <TimelineOppositeContent color="text.secondary">
                Maintenant
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot color="primary">
                  <AccessTimeIcon />
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="subtitle2">
                  Commande en cours
                </Typography>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineOppositeContent color="text.secondary">
                {deliveryMethod === 'express' ? '~2h' : '~4h'}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot>
                  <LocalShippingIcon />
                </TimelineDot>
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="subtitle2">
                  Préparation et départ
                </Typography>
              </TimelineContent>
            </TimelineItem>

            <TimelineItem>
              <TimelineOppositeContent color="text.secondary">
                {deliveryMethod === 'express' ? '12-24h' : '24-48h'}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot>
                  <HomeIcon />
                </TimelineDot>
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="subtitle2">
                  Livraison
                </Typography>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default DeliveryOptions; 