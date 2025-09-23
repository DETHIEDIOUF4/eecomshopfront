import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartState, CartItem, Product } from '../types';

const loadPersistedCart = (): CartState => {
  try {
    const raw = localStorage.getItem('cart');
    if (!raw) return { items: [], total: 0 };
    return JSON.parse(raw) as CartState;
  } catch {
    return { items: [], total: 0 };
  }
};

const persistCart = (state: CartState) => {
  try {
    localStorage.setItem('cart', JSON.stringify(state));
  } catch {}
};

const initialState: CartState = loadPersistedCart();

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
      
      // Calcul du stock disponible (produits sans stock explicite => stock illimité)
      const availableStock = (action.payload.product.stock ?? Number.MAX_SAFE_INTEGER);
      // Pour les produits ≤ 200 FCFA, vérifier le stock en lots de 25
      const stockCheck = action.payload.product.price <= 200 
        ? totalRequested * 25 <= availableStock
        : totalRequested <= availableStock;
      
      if (!stockCheck) {
        return; // Ne pas ajouter si stock insuffisant
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
      persistCart(state);
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
      persistCart(state);
    },
    updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const item = state.items.find(item => item.product._id === action.payload.productId);
      if (item) {
        // Vérifier le stock disponible
        const requestedQuantity = action.payload.quantity;
        const availableStock = (item.product.stock ?? Number.MAX_SAFE_INTEGER);
        const stockCheck = item.product.price <= 200 
          ? requestedQuantity * 25 <= availableStock
          : requestedQuantity <= availableStock;
        
        if (!stockCheck) {
          return; // Ne pas mettre à jour si stock insuffisant
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
        persistCart(state);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      persistCart(state);
    }
  }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer; 