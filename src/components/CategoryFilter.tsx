import React from 'react';
import { 
  Box, 
  Typography, 
  FormControl, 
  RadioGroup, 
  FormControlLabel, 
  Radio,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Collapse,
  Slider
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import BakeryDiningIcon from '@mui/icons-material/BakeryDining';
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';
import CategoryIcon from '@mui/icons-material/Category';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import SortIcon from '@mui/icons-material/Sort';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onPriceRangeChange?: (range: [number, number]) => void;
  onPromotionFilter?: () => void;
  onPriceSort?: (order: 'asc' | 'desc') => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  onPriceRangeChange,
  onPromotionFilter,
  onPriceSort
}) => {
  const [open, setOpen] = React.useState(true);
  const [priceOpen, setPriceOpen] = React.useState(false);
  const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 10000]);
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');

  const handleClick = () => {
    setOpen(!open);
  };

  const handlePriceClick = () => {
    setPriceOpen(!priceOpen);
  };

  const handlePriceRangeChange = (event: Event, newValue: number | number[]) => {
    const range = newValue as [number, number];
    setPriceRange(range);
    if (onPriceRangeChange) {
      onPriceRangeChange(range);
    }
  };

  const handleSortClick = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);
    if (onPriceSort) {
      onPriceSort(newOrder);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'beignets':
        return <BakeryDiningIcon />;
      case 'fatayas':
        return <RestaurantIcon />;
      case 'quiches':
        return <LocalPizzaIcon />;
      default:
        return <CategoryIcon />;
    }
  };

  return (
    <Box sx={{ width: 250, bgcolor: 'background.paper' }}>
      <List component="nav" aria-labelledby="nested-list-subheader">
        <ListItemButton onClick={handleClick}>
          <ListItemText 
            primary={
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'primary.main',
                  fontWeight: 'bold'
                }}
              >
                Catégories
              </Typography>
            } 
          />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              selected={selectedCategory === 'all'}
              onClick={() => onCategoryChange('all')}
              sx={{
                pl: 2,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(227, 30, 36, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(227, 30, 36, 0.2)',
                  },
                },
              }}
            >
              <ListItemIcon>
                <CategoryIcon sx={{ 
                  color: selectedCategory === 'all' ? 'primary.main' : 'text.primary'
                }} />
              </ListItemIcon>
              <ListItemText 
                primary={
                  <Typography 
                    sx={{ 
                      fontWeight: selectedCategory === 'all' ? 'bold' : 'normal',
                      color: selectedCategory === 'all' ? 'primary.main' : 'text.primary'
                    }}
                  >
                    Tous les produits
                  </Typography>
                } 
              />
            </ListItemButton>
            {categories.map((category) => (
              <ListItemButton
                key={category}
                selected={selectedCategory === category}
                onClick={() => onCategoryChange(category)}
                sx={{
                  pl: 2,
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(227, 30, 36, 0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(227, 30, 36, 0.2)',
                    },
                  },
                }}
              >
                <ListItemIcon>
                  {React.cloneElement(getCategoryIcon(category), { 
                    sx: { 
                      color: selectedCategory === category ? 'primary.main' : 'text.primary'
                    }
                  })}
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography 
                      sx={{ 
                        fontWeight: selectedCategory === category ? 'bold' : 'normal',
                        color: selectedCategory === category ? 'primary.main' : 'text.primary'
                      }}
                    >
                      {category}
                    </Typography>
                  } 
                />
              </ListItemButton>
            ))}
          </List>
        </Collapse>

        <Divider sx={{ my: 2 }} />

        <ListItemButton onClick={onPromotionFilter}>
          <ListItemIcon>
            <LocalOfferIcon sx={{ color: 'primary.main' }} />
          </ListItemIcon>
          <ListItemText 
            primary={
              <Typography sx={{ fontWeight: 'bold' }}>
                Promotions
              </Typography>
            } 
          />
        </ListItemButton>

        <Divider sx={{ my: 2 }} />

        <ListItemButton onClick={handlePriceClick}>
          <ListItemIcon>
            <SortIcon sx={{ color: 'primary.main' }} />
          </ListItemIcon>
          <ListItemText 
            primary={
              <Typography sx={{ fontWeight: 'bold' }}>
                Prix
              </Typography>
            } 
          />
          {priceOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={priceOpen} timeout="auto" unmountOnExit>
          <Box sx={{ px: 3, py: 2 }}>
            <Typography gutterBottom>
              Fourchette de prix
            </Typography>
            <Slider
              value={priceRange}
              onChange={handlePriceRangeChange}
              valueLabelDisplay="auto"
              min={0}
              max={5000}
              step={500}
              valueLabelFormat={(value) => `${value.toLocaleString()} FCFA`}
              sx={{ color: 'primary.main' }}
            />
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                {priceRange[0].toLocaleString()} FCFA
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {priceRange[1].toLocaleString()} FCFA
              </Typography>
            </Box>
            <ListItemButton 
              onClick={handleSortClick}
              sx={{ mt: 1, pl: 0 }}
            >
              <ListItemText 
                primary={
                  <Typography>
                    Trier par prix {sortOrder === 'asc' ? '↑' : '↓'}
                  </Typography>
                } 
              />
            </ListItemButton>
          </Box>
        </Collapse>
      </List>
    </Box>
  );
};

export default CategoryFilter; 