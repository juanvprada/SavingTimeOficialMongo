// likeServices.jsx
import api from '../config/axios';

export const toggleLike = async (postId) => {
    try {
        const response = await api.post(`/api/likes/${postId}/toggle`, {});
        return response.data;
    } catch (error) {
        console.log('Error details:', error.response?.data);
        throw error;
    }
};

export const getLikesCount = async (postId) => {
    try {
        const response = await api.get(`/api/likes/${postId}/count`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener el conteo de likes:', error);
        throw error;
    }
};