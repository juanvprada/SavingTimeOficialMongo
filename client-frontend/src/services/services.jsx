// services.jsx
import axios from 'axios';
import { API_CONFIG, axiosConfig, getAuthConfig } from '../config/api.config';

const BASE_URL = API_CONFIG.getBaseUrl();
const API_URL = `${BASE_URL}/api/posts`;
const UPLOADS_URL = `${BASE_URL}/uploads`;

// Utility function to ensure consistent error handling
const handleApiError = (error, action) => {
  console.error(`Error al ${action}:`, error);

  if (error.response?.data) {
    console.error('Response data:', error.response.data);
    throw error.response.data;
  }

  throw {
    message: `Error al ${action}`,
    error: error.message
  };
};

// Utility function to process image URLs
const processImageUrls = (images) => {
  if (!Array.isArray(images)) return [];
  return images.map(img => {
    if (!img) return null;
    return img; // Las URLs de Cloudinary ya vienen completas
  }).filter(Boolean);
};

// Utility function to get auth headers with optional multipart
const getHeaders = (isMultipart = false) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Authorization': `Bearer ${token}`
  };

  if (isMultipart) {
    headers['Content-Type'] = 'multipart/form-data';
  }

  return headers;
};

export const getPosts = async () => {
  try {
    const response = await axios.get(API_URL, axiosConfig);

    if (!response.data?.data) {
      console.warn('Invalid response structure:', response);
      return [];
    }

    const postsData = Array.isArray(response.data.data) ? response.data.data : [];

    return postsData.map(post => ({
      ...post,
      id: post._id || post.id,
      userId: post.userId?._id || post.userId,
      images: processImageUrls(post.images)
    }));
  } catch (error) {
    handleApiError(error, "obtener posts");
  }
};

export const createPost = async (formData) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      timeout: 10000
    };

    // Verificar formData antes de enviar
    const formDataEntries = Array.from(formData.entries());
    console.log('FormData a enviar:', formDataEntries);

    // Cambiar esta línea - usar API_URL en lugar de getBaseUrl()
    const response = await axios.post(API_URL, formData, config);

    if (response.status === 201 && response.data?.data) {
      return response.data;
    }

    throw new Error('Formato de respuesta inválido del servidor');

  } catch (error) {
    if (error.response?.status === 500) {
      // Si el post se creó pero hubo un error en la respuesta, intentamos obtener los posts
      try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar 1 segundo
        const posts = await getPosts();
        if (posts.length > 0) {
          // Si tenemos posts, probablemente el post se creó correctamente
          return { message: 'Post creado con éxito', data: posts[0] };
        }
      } catch (retryError) {
        console.error('Error en el retry:', retryError);
      }
    }

    // Si llegamos aquí, hubo un error real
    console.error('Error en createPost:', error);
    throw {
      message: 'Error al crear el post',
      error: error.response?.data?.error || error.message
    };
  }
};

export const getOnePost = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: getHeaders()
    });

    if (!response.data) {
      throw new Error('Post no encontrado');
    }

    return {
      ...response.data,
      images: processImageUrls(response.data.images)
    };
  } catch (error) {
    handleApiError(error, "obtener post");
  }
};

export const updatePost = async (id, postData) => {
  try {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    };

    // Log para debugging
    console.log('Updating post:', { id, postData });

    const response = await axios.put(`${API_URL}/${id}`, postData, config);

    if (!response.data) {
      throw new Error('No se recibió respuesta del servidor');
    }

    return {
      ...response.data,
      images: processImageUrls(response.data.images)
    };
  } catch (error) {
    console.error('Error en updatePost:', error);
    throw {
      message: 'Error al actualizar el post',
      error: error.response?.data?.error || error.message
    };
  }
};

export const deletePost = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: getHeaders()
    });

    if (!response.data) {
      throw new Error('No se recibió respuesta del servidor');
    }

    return response.data;
  } catch (error) {
    handleApiError(error, "eliminar post");
  }
};

export default {
  createPost,
  getPosts,
  getOnePost,
  updatePost,
  deletePost
};