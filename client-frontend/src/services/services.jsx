// services.jsx
import api from '../config/axios';

const BASE_URL = 'https://savingtimeoficial.eu-4.evennode.com/';
const UPLOADS_URL = `${BASE_URL}uploads`;

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
    if (img.startsWith('https')) return img;
    return `${UPLOADS_URL}/${img}`;
  }).filter(Boolean);
};

export const getPosts = async () => {
  try {
    const response = await api.get('/api/posts');

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
    console.log('Token:', token);

    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      timeout: 10000 // 10 segundos de timeout
    };

    console.log('Enviando petición a /api/posts');
    const response = await api.post('/api/posts', formData, config);

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
          return { message: 'Post creado con éxito', data: posts[0] };
        }
      } catch (retryError) {
        console.error('Error en el retry:', retryError);
      }
    }

    console.error('Error en createPost:', error);
    throw {
      message: 'Error al crear el post',
      error: error.response?.data?.error || error.message
    };
  }
};

export const getOnePost = async (id) => {
  try {
    const response = await api.get(`/api/posts/${id}`);

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

    console.log('Updating post:', { id, postData });

    const response = await api.put(`/api/posts/${id}`, postData, config);

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
    const response = await api.delete(`/api/posts/${id}`);

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