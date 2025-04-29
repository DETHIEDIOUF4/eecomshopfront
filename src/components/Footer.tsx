import React from 'react';
import { Box, Typography, Link, IconButton } from '@mui/material';

// Icône Snapchat personnalisée supprimée, on utilise une image

const Footer: React.FC = () => (
  <Box
    component="footer"
    sx={{
      width: '100%',
      py: 3,
      mt: 4,
      backgroundColor: '#fae1db',
      borderTop: '1px solid #eee',
      textAlign: 'center'
    }}
  >
    <Typography variant="body2" color="text.secondary">
      © {new Date().getFullYear()} Hello Gassy'z — Votre fournisseur de pâtes. Tous droits réservés.
    </Typography>
    <Box sx={{ mt: 1 }}>
      <Typography variant="body2" color="text.secondary">
        Contact : <Link href="tel:+221774093230" color="inherit" underline="hover">+221 77 409 32 30</Link> | 
        Email : <Link href="mailto:hellogassy@gmail.com" color="inherit" underline="hover">hellogassy@gmail.com</Link>
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Adresse : Dakar, Sénégal
      </Typography>
    </Box>
    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
      <IconButton component="a" href="https://instagram.com/hellogassy" target="_blank" rel="noopener" aria-label="Instagram">
        <img src="/icons/instagram.png" alt="Instagram" style={{ width: 32, height: 32 }} />
      </IconButton>
      <IconButton component="a" href="https://facebook.com/hellogassy" target="_blank" rel="noopener" aria-label="Facebook">
        <img src="/icons/facebook.png" alt="Facebook" style={{ width: 32, height: 32 }} />
      </IconButton>
      <IconButton component="a" href="https://snapchat.com/add/hellogassy" target="_blank" rel="noopener" aria-label="Snapchat">
        <img src="/icons/snapchat.png" alt="Snapchat" style={{ width: 32, height: 32 }} />
      </IconButton>
      <IconButton component="a" href="https://tiktok.com/@hellogassy" target="_blank" rel="noopener" aria-label="TikTok">
        <img src="/icons/tiktok.png" alt="TikTok" style={{ width: 32, height: 32 }} />
      </IconButton>
    </Box>
  </Box>
);

export default Footer; 