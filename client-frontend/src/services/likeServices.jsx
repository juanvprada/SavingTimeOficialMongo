import axios from 'axios';

const API_URL = 'http://localhost:5000/api/likes';

//==========================================
// Función para alternar el like de un post
//==========================================
export const toggleLike = async (postId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/${postId}/toggle`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al manejar el like:', error.response ? error.response.data : error.message);
    throw error;
  }
};

//===================================================
// Función para obtener el conteo de likes de un post
//===================================================
export const getLikesCount = async (postId) => {
  try {
    const response = await axios.get(`${API_URL}/${postId}/likes`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener el conteo de likes:', error);
    throw error;
  }
};

