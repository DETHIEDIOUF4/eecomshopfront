import axios from 'axios';
import { API_URL } from '../config';
import { Product } from '../types';

const getAuthToken = () => {
  const userInfo = localStorage.getItem('userInfo');
  return userInfo ? JSON.parse(userInfo).token : null;
};

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface OrderItem {
  product: string | Product;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Order {
  _id: string;
  user: string;
  orderItems: OrderItem[];
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  shippingAddress: ShippingAddress;
  deliveryMethod: string;
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
  status: 'pending' | 'processing' | 'delivered' | 'cancelled';
}

export interface OrderData {
  orderItems: Array<{
    product: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }>;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  deliveryMethod: 'pickup' | 'delivery';
  shippingAddress?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
}

export const createOrder = async (orderData: OrderData) => {
  try {
    const response = await axiosInstance.post('/orders', orderData,{headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }});
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new Error('Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet.');
      }
    }
    throw error;
  }
};

export const getOrderById = async (orderId: string) => {
  const response = await axiosInstance.get(`/orders/${orderId}`,{headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }});
  return response;
};

export const getMyOrders = async () => {
  const response = await axiosInstance.get('/orders/myorders',{headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }});
  return response.data;
};

export const updateOrderToPaid = async (orderId: string, paymentResult: any) => {
  const response = await axiosInstance.put(`/orders/${orderId}/pay`, paymentResult,{headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }});
  return response.data;
};

export const payOrder = async (id: string, paymentResult: {
  id: string;
  status: string;
  update_time: string;
  email_address: string;
}) => {
  const response = await axiosInstance.put(`/orders/${id}/pay`, paymentResult,{headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }});
  return response.data;
};

export const deliverOrder = async (id: string) => {
  const response = await axiosInstance.put(`/orders/${id}/deliver`, {}, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
};

export const markOrderAsPaid = async (id: string) => {
  const response = await axiosInstance.put(`/orders/${id}/pay`, {}, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
};

export const getAllOrders = async (): Promise<Order[]> => {
  const response = await axiosInstance.get('/orders',{headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }});
  return response.data;
};

export const updateOrderStatus = async (id: string, status: Order['status']): Promise<Order> => {
  const response = await axiosInstance.put(`/orders/${id}`, { status }, {headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }});
  return response.data;
}; 