import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Crear un comentario
export const addComment = async ({ postId, content, token }) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/comments/${postId}/comments`, 
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creando comentario:', error);
      throw error;
    }
  };

// Obtener los comentarios de un post
export const getComments = async (postId) => {
    try {
        const response = await axios.get(`${API_URL}/comments/${postId}`);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo comentarios:', error);
      throw error;
    }
  };


