import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://hellogassy-backend.onrender.com/api';
// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

export const categoryService = {
    getAllCategories: async () => {
        const response = await axios.get(`${API_URL}/categories`);
        return response.data;
    },

    getCategory: async (id: string) => {
        const response = await axios.get(`${API_URL}/categories/${id}`);
        return response.data;
    },

    createCategory: async (categoryData: { name: string; description?: string }) => {
        const response = await axios.post(`${API_URL}/categories`, categoryData);
        return response.data;
    },

    updateCategory: async (id: string, categoryData: { name: string; description?: string }) => {
        const response = await axios.put(`${API_URL}/categories/${id}`, categoryData);
        return response.data;
    },

    deleteCategory: async (id: string) => {
        const response = await axios.delete(`${API_URL}/categories/${id}`);
        return response.data;
    }
}; 