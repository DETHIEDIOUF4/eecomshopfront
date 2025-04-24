import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  CircularProgress,
  Fade
} from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import { green } from '@mui/material/colors';

interface AddToCartNotificationProps {
  open: boolean;
  onClose: () => void;
  productName: string;
  quantity: number;
  loading: boolean;
}

const AddToCartNotification: React.FC<AddToCartNotificationProps> = ({
  open,
  onClose,
  productName,
  quantity,
  loading
}) => {
  useEffect(() => {
    if (open && !loading) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [open, loading, onClose]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 2,
          minWidth: { xs: '80%', sm: 400 }
        }
      }}
    >
      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: 2
          }}
        >
          {loading ? (
            <CircularProgress
              size={60}
              thickness={4}
              sx={{ color: green[500], mb: 2 }}
            />
          ) : (
            <Fade in={true}>
              <CheckCircleOutline
                sx={{
                  fontSize: 60,
                  color: green[500],
                  mb: 2
                }}
              />
            </Fade>
          )}
          <Typography variant="h6" align="center" gutterBottom>
            {loading ? 'Ajout au panier...' : 'Produit ajouté !'}
          </Typography>
          {!loading && (
            <Fade in={true}>
              <Typography variant="body1" align="center" color="text.secondary">
                {quantity} × {productName}
              </Typography>
            </Fade>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddToCartNotification; 