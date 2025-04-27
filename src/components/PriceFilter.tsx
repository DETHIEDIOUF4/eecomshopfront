import React from 'react';
import { Box, Typography, Slider } from '@mui/material';

interface PriceFilterProps {
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
}

const PriceFilter: React.FC<PriceFilterProps> = ({ priceRange, onPriceChange }) => {
  const handleChange = (_event: Event, newValue: number | number[]) => {
    onPriceChange(newValue as [number, number]);
  };

  return (
    <Box sx={{ width: 200 }}>
      <Typography gutterBottom>Fourchette de prix</Typography>
      <Slider
        value={priceRange}
        onChange={handleChange}
        valueLabelDisplay="auto"
        min={0}
        max={10000}
        step={100}
        valueLabelFormat={(value) => `${value} FCFA`}
      />
    </Box>
  );
};

export default PriceFilter; 