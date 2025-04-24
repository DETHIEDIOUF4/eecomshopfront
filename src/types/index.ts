export interface Product {
  id: number;
  name: string;
  description: string;
  detailedDescription: string;
  price: number;
  images: string[];
  category: string;
  ingredients?: string[];
  preparationTime?: string;
  allergens?: string[];
  isPromotion?: boolean;
  nutritionalInfo?: {
    calories?: number;
    proteins?: number;
    carbohydrates?: number;
    fats?: number;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
} 