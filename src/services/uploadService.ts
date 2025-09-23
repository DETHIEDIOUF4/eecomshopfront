import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';
// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';


export const uploadService = {
    uploadImage: async (file: File) => {
        const formData = new FormData();
        formData.append('image', file);

        const response = await axios.post(`${API_URL}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data.imageUrl;
    },

    uploadMultipleImages: async (files: File[]) => {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('images', file);
        });

        const response = await axios.post(`${API_URL}/upload/multiple`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data.imageUrls;
    }
}; 