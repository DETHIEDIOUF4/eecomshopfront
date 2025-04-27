import api from './api';

export interface Product {
  _id: string;
  name: string;
  description: string;
  detailedDescription: string;
  price: number;
  images: string[];
  category: string;
  ingredients: string[];
  preparationTime: string;
  allergens: string[];
  nutritionalInfo: {
    calories: number;
    proteins: number;
    carbohydrates: number;
    fats: number;
  };
  stock: number;
  rating: number;
  numReviews: number;
}

export const getProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

export const getProductById = async (id: string) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (productData: Partial<Product>) => {
  const response = await api.post('/products', productData);
  return response.data;
};

export const updateProduct = async (id: string, productData: Partial<Product>) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};

export const deleteProduct = async (id: string) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
}; 