import axios from 'axios';

const API_URL = 'http://localhost:5000/api/posts';
const BASE_IMAGE_URL = 'http://localhost:5000/uploads/';

const handleError = (error, action) => {
  console.error(`Error al ${action}:`, error.response ? error.response.data : error.message);
  throw error;
};

//==================
// Create a new Post
//==================
export const createPost = async (formData) => {
  try {
    const response = await axios.post(API_URL, formData);
    response.data.image = `${BASE_IMAGE_URL}${response.data.image}`;
    return response.data; 
  } catch (error) {
    handleError(error, "crear Post");
  }
};

//==============
// Get all posts
//==============
export const getPosts = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    handleError(error, "obtener Posts");
  }
};

//=============
// Get one post
//=============
export const getOnePost = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    handleError(error, "obtener el Post");
  }
};

//================
// Update one post
//================
export const updatePost = async (id, postData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, postData);
    return response.data;
  } catch (error) {
    handleError(error, "actualizar Post");
  }
};

//================
// Delete one post
//================
export const deletePost = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response;
  } catch (error) {
    handleError(error, "eliminar Post");
  }
};




