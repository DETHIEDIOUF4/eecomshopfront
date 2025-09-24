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
      backgroundColor: '#ffff',
      borderTop: '1px solid #eee',
      textAlign: 'center'
    }}
  >
    <Typography variant="body2" color="black">
      © {new Date().getFullYear()} DIOUF TECH STORE — votre partenaire de technologie. Tous droits réservés.
    </Typography>
    <Box sx={{ mt: 1 }}>
      <Typography variant="body2" color="black">
        Contact : <Link href="tel:+221788797628" color="black"  underline="hover">221 78 879 76 28</Link> | 
        Email : <Link href="mailto:contact@diouftechstore.com" color="black" underline="hover">contact@diouftechstore.com</Link>
      </Typography>
      <Typography variant="body2" color="black">
        Adresse : Dakar, Sénégal
      </Typography>
    </Box>
    <Box sx={{ mt: 2 }}>
      <Link href="/politique-confidentialite" color="black" underline="hover" sx={{ mx: 1 }}>
        Politique de confidentialité
      </Link>
      <span style={{ color: '#888' }}>|</span>
      <Link href="/conditions-utilisation" color="black" underline="hover" sx={{ mx: 1 }}>
        Conditions d'utilisation
      </Link>
    </Box>
    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
      <IconButton component="a" href="https://instagram.com/diouftechstore" target="_blank" rel="noopener" aria-label="Instagram">
        <img src="/icons/instagram.png" alt="Instagram" style={{ width: 32, height: 32 }} />
      </IconButton>
      <IconButton component="a" href="https://facebook.com/diouftechstore" target="_blank" rel="noopener" aria-label="Facebook">
        <img src="/icons/facebook.png" alt="Facebook" style={{ width: 32, height: 32 }} />
      </IconButton>
      <IconButton component="a" href="https://snapchat.com/add/diouftechstore" target="_blank" rel="noopener" aria-label="Snapchat">
        <img src="/icons/snapchat.png" alt="Snapchat" style={{ width: 32, height: 32 }} />
      </IconButton>
      <IconButton component="a" href="https://tiktok.com/@diouftechstore" target="_blank" rel="noopener" aria-label="TikTok">
        <img src="/icons/tiktok.png" alt="TikTok" style={{ width: 32, height: 32 }} />
      </IconButton>
    </Box>
    <Typography variant="body2" color="black">
      © {new Date().getFullYear()} DDEV. Tous droits réservés.
    </Typography>
  
  </Box>
);

export default Footer; 