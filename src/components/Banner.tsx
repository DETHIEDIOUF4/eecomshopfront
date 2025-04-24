import React from 'react';
import { Box, Container, useTheme, useMediaQuery } from '@mui/material';
import logo from '../assets/banner.png'; 

const Banner: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: '#fff',
        mb: 1,
        overflow: ''
      }}
    >
      <Container maxWidth="xl" sx={{ p: { xs: 0, sm: 2 } }}>
        <Box
          sx={{
            width: '100%',
            height: { xs: '200px', sm: '300px', md: '450px' },
            position: 'relative',
            borderRadius: { xs: 0, sm: 2 },
            overflow: 'hidden',
            boxShadow: { xs: 0, sm: 3 },
            
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="banner"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s ease-in-out',
              '&:hover': {
                transform: 'scale(1.3)'
              }
            }}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default Banner; 