export interface Product {
  _id: string;
  name: string;
  description: string;
  detailedDescription: string;
  price: number;
  images: string[];
  category: string;
  brand: string;
  modelName: string;
  features: string[];
  warrantyMonths?: number;
  specs?: Record<string, string | number>;
  stock: number;
  rating: number;
  numReviews: number;
  reviews: any[];
  isPromotion?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
}

export interface Order {
  _id: string;
  user: string;
  orderItems: {
    product: string | Product;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
} 