// commentServices.jsx
import api from '../config/axios';

export const getComments = async (postId) => {
    try {
        const response = await api.get(`/api/comments/${postId}`);
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
        const response = await api.post(`/api/comments/${postId}`, {
            content,
            postId
        });
        
        return {
            ...response.data,
            id: response.data._id
        };
    } catch (error) {
        throw error;
    }
};
