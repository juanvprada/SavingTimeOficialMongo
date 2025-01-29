// likeServices.jsx
import axios from 'axios';
import { API_CONFIG, axiosConfig, getAuthConfig } from '../config/api.config';

const BASE_URL = API_CONFIG.getBaseUrl();
const API_URL = `${BASE_URL}api/likes`;

export const toggleLike = async (postId) => {
  try {
    const response = await axios.post(
      `${API_URL}/${postId}/toggle`, 
      {}, 
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    console.log('Error details:', error.response?.data);
    throw error;
  }
};

export const getLikesCount = async (postId) => {
  try {
    const response = await axios.get(
      `${API_URL}/${postId}/count`,
      axiosConfig
    );
    return response.data;
  } catch (error) {
    console.error('Error al obtener el conteo de likes:', error);
    throw error;
  }
};
