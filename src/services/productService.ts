import axios from 'axios';
import { Product } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';
// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

export const productService = {
    getAllProducts: async () => {
        const response = await axios.get(`${API_URL}/products`, {headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }});

        return response.data;
    },

    getProduct: async (id: string) => {
        const response = await axios.get(`${API_URL}/products/${id}`, {headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }});
        return response.data;
    },

    createProduct: async (productData: {
        name: string;
        description?: string;
        detailedDescription: string;
        price: number;
        category: string;
        brand: string;
        modelName: string;
        features?: string[];
        warrantyMonths?: number;
        specs?: Record<string, string | number>;
        stock: number;
        images: string[];
    }) => {
        const response = await axios.post(`${API_URL}/products`, productData ,   {headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }});
        return response.data;
    },

    updateProduct: async (id: string, productData: {
        name?: string;
        description?: string;
        detailedDescription?: string;
        price?: number;
        category?: string;
        brand?: string;
        modelName?: string;
        features?: string[];
        warrantyMonths?: number;
        specs?: Record<string, string | number>;
        stock?: number;
        images?: string[];
    }) => {
        const response = await axios.put(`${API_URL}/products/${id}`, productData, {headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }});
        return response.data;
    },

    deleteProduct: async (id: string) => {
        const response = await axios.delete(`${API_URL}/products/${id}`, {headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }});
        return response.data;
    }
}; 