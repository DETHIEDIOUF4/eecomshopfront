import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import Layout from '../components/Layout';

const PolitiqueConfidentialite: React.FC = () => (
  <Layout>
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" color="primary" fontWeight="bold" gutterBottom>
        Politique de confidentialité
      </Typography>
      <Typography variant="body1" paragraph>
        Votre vie privée est importante pour nous. Cette politique explique comment nous collectons, utilisons et protégeons vos informations personnelles lorsque vous utilisez Hello Gassy'z.
      </Typography>
      <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
        1. Collecte des informations
      </Typography>
      <Typography variant="body1" paragraph>
        Nous collectons les informations que vous fournissez lors de la création de compte, de la commande ou du contact avec notre service client.
      </Typography>
      <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
        2. Utilisation des informations
      </Typography>
      <Typography variant="body1" paragraph>
        Vos informations sont utilisées pour traiter vos commandes, améliorer nos services et, si vous y consentez, vous envoyer des offres promotionnelles.
      </Typography>
      <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
        3. Partage des informations
      </Typography>
      <Typography variant="body1" paragraph>
        Nous ne partageons jamais vos données personnelles avec des tiers sans votre consentement, sauf obligation légale.
      </Typography>
      <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
        4. Sécurité
      </Typography>
      <Typography variant="body1" paragraph>
        Nous mettons en œuvre des mesures de sécurité pour protéger vos données contre tout accès non autorisé.
      </Typography>
      <Typography variant="body1" paragraph sx={{ mt: 4 }}>
        Pour toute question concernant notre politique de confidentialité, contactez-nous à <a href="mailto:hellogassy@gmail.com">hellogassy@gmail.com</a>.
      </Typography>
    </Container>
  </Layout>
);

export default PolitiqueConfidentialite; 