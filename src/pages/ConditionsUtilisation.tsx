import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import Layout from '../components/Layout';

const ConditionsUtilisation: React.FC = () => (
  <Layout>
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" color="primary" fontWeight="bold" gutterBottom>
        Conditions d'utilisation
      </Typography>
      <Typography variant="body1" paragraph>
        En utilisant la plateforme Hello Gassy'z, vous acceptez les conditions suivantes. Veuillez les lire attentivement.
      </Typography>
      <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
        1. Utilisation du service
      </Typography>
      <Typography variant="body1" paragraph>
        Vous vous engagez à utiliser notre site de manière légale et respectueuse. Toute utilisation frauduleuse ou abusive entraînera la suspension de votre accès.
      </Typography>
      <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
        2. Commandes et paiements
      </Typography>
      <Typography variant="body1" paragraph>
        Les commandes passées sur notre site sont fermes après validation du paiement. Nous nous réservons le droit d'annuler toute commande en cas de problème.
      </Typography>
      <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
        3. Propriété intellectuelle
      </Typography>
      <Typography variant="body1" paragraph>
        Tous les contenus présents sur Hello Gassy'z (textes, images, logos) sont protégés et ne peuvent être utilisés sans autorisation.
      </Typography>
      <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
        4. Modification des conditions
      </Typography>
      <Typography variant="body1" paragraph>
        Nous pouvons modifier ces conditions à tout moment. Les utilisateurs seront informés des changements importants.
      </Typography>
      <Typography variant="body1" paragraph sx={{ mt: 4 }}>
        Pour toute question concernant nos conditions d'utilisation, contactez-nous à <a href="mailto:hellogassy@gmail.com">hellogassy@gmail.com</a>.
      </Typography>
    </Container>
  </Layout>
);

export default ConditionsUtilisation; 