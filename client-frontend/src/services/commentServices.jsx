// commentServices.jsx
import axios from 'axios';
import { API_CONFIG, axiosConfig, getAuthConfig } from '../config/api.config';

const BASE_URL = API_CONFIG.getBaseUrl();
const API_URL = `${BASE_URL}/api`;

export const getComments = async (postId) => {
    try {
        const response = await axios.get(
            `${API_URL}/comments/${postId}`,
            axiosConfig
        );
        return response.data;
    } catch (error) {
        console.error('Error obteniendo comentarios:', {
            response: error.response?.data,
            status: error.response?.status
        });
        return { data: [] };
    }
};

export const addComment = async ({ postId, content, token }) => {
    if (!token) {
        throw new Error('Token es requerido');
    }

    try {
        const response = await axios.post(
            `${API_URL}/comments/${postId}`,
            { 
                content,
                postId
            },
            getAuthConfig()
        );
        return {
            ...response.data,
            id: response.data._id
        };
    } catch (error) {
        throw error;
    }
};

