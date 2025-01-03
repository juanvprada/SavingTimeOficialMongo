import axios from 'axios';

const API_URL = 'http://localhost:5000/api/likes';

//==========================================
// Función para alternar el like de un post
//==========================================
export const toggleLike = async (postId) => {
  const token = localStorage.getItem('token');
  console.log('Token:', token); // Debug token

  try {
    const response = await axios.post(`${API_URL}/${postId}/toggle`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Response:', response); // Debug response
    return response.data;
  } catch (error) {
    console.log('Error details:', error.response?.data); // Debug error
    throw error;
  }
};

//===================================================
// Función para obtener el conteo de likes de un post
//===================================================
export const getLikesCount = async (postId) => {
  try {
    const response = await axios.get(`${API_URL}/${postId}/count`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener el conteo de likes:', error);
    throw error;
  }
};

