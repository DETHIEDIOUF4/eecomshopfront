import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartState, CartItem, Product } from '../types';

const initialState: CartState = {
  items: [],
  total: 0
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(item => item.product._id === action.payload.product._id);
      
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      
      state.total = state.items.reduce((total, item) => {
        if (item.product.price <= 200) {
          // Pour les produits ≤ 200 FCFA, vendre par lots de 25 pièces
          return total + (item.product.price * item.quantity * 25);
        } else {
          // Pour les produits > 200 FCFA, vente normale
          return total + (item.product.price * item.quantity);
        }
      }, 0);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.product._id !== action.payload);
      state.total = state.items.reduce((total, item) => {
        if (item.product.price <= 200) {
          // Pour les produits ≤ 200 FCFA, vendre par lots de 25 pièces
          return total + (item.product.price * item.quantity * 25);
        } else {
          // Pour les produits > 200 FCFA, vente normale
          return total + (item.product.price * item.quantity);
        }
      }, 0);
    },
    updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const item = state.items.find(item => item.product._id === action.payload.productId);
      if (item) {
        item.quantity = action.payload.quantity;
        state.total = state.items.reduce((total, item) => {
          if (item.product.price <= 200) {
            // Pour les produits ≤ 200 FCFA, vendre par lots de 25 pièces
            return total + (item.product.price * item.quantity * 25);
          } else {
            // Pour les produits > 200 FCFA, vente normale
            return total + (item.product.price * item.quantity);
          }
        }, 0);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    }
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer; 