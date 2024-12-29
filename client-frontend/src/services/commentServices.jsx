// commentServices.jsx
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getComments = async (postId) => {
    try {
        const response = await axios.get(`${API_URL}/comments/${postId}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
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
            { content },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error creando comentario:', {
            response: error.response?.data,
            status: error.response?.status
        });
        throw error;
    }
};

