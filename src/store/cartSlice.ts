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
      
      // Vérifier le stock disponible
      const requestedQuantity = action.payload.quantity;
      const currentQuantity = existingItem ? existingItem.quantity : 0;
      const totalRequested = currentQuantity + requestedQuantity;
      
      // Pour les produits ≤ 200 FCFA, vérifier le stock en lots de 25
      const stockCheck = action.payload.product.price <= 200 
        ? totalRequested * 25 <= action.payload.product.stock
        : totalRequested <= action.payload.product.stock;
      
      if (!stockCheck) {
        throw new Error(`Stock insuffisant. Disponible: ${action.payload.product.stock} ${action.payload.product.price <= 200 ? 'pièces' : 'unités'}`);
      }
      
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
        // Vérifier le stock disponible
        const requestedQuantity = action.payload.quantity;
        const stockCheck = item.product.price <= 200 
          ? requestedQuantity * 25 <= item.product.stock
          : requestedQuantity <= item.product.stock;
        
        if (!stockCheck) {
          throw new Error(`Stock insuffisant. Disponible: ${item.product.stock} ${item.product.price <= 200 ? 'pièces' : 'unités'}`);
        }
        
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