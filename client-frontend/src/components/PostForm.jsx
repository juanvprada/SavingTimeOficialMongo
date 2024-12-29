import React, { useState, useEffect } from 'react';
import { createPost, updatePost } from '../services/services';
import { logoImg } from '../utils';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useStore from '../store/store';

export const Create = ({ post, onSubmit, onCancel }) => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [title, setTitle] = useState('');
  const [kindOfPost, setKindOfPost] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const userId = useStore((state) => state.userId);

  useEffect(() => {
    if (post?.data) {
      setTitle(post.data.name || '');
      setKindOfPost(post.data.kindOfPost || '');
      setDescription(post.data.description || '');
      // Set image preview if there's an existing image
      if (post.data.image) {
        setImagePreview(post.data.image);
      }
    }
  }, [post]);

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    if (!selectedImage) {
      toast.error('Debes seleccionar una imagen.');
      return;
    }
    setImage(selectedImage);
    setImagePreview(URL.createObjectURL(selectedImage));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!userId) {
      setError('Sesión no válida. Por favor, inicia sesión nuevamente.');
      return;
    }

    const formData = new FormData();
    formData.append('name', title);
    formData.append('kindOfPost', kindOfPost);
    formData.append('description', description);
    formData.append('userId', userId);

    if (image) {
      formData.append('image', image);
    }

    try {
      let response;
      if (post?.data) {
        response = await updatePost(post.data.id, formData);
        toast.success('Post actualizado exitosamente');
      } else {
        response = await createPost(formData);
        toast.success('Post creado exitosamente');
      }

      console.log('Respuesta del servidor:', response);
      onSubmit(response.data);
      onCancel();
    } catch (error) {
      console.error('Error al procesar el Post:', error);
      toast.error('Hubo un error al procesar el Post: ' + error.message);
      setError('Hubo un error al procesar el Post: ' + error.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#1B3A4B] bg-opacity-75 z-50">
  <div className="bg-[#F5F2ED] p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md m-3 sm:m-5 relative z-10 overflow-y-auto max-h-[90vh]">
    <div className="flex justify-center mb-4">
      <img src={logoImg} alt="Logo" className="h-12 sm:h-16 w-auto" />
    </div>
    <h3 className="text-center text-2xl font-bold text-[#1B3A4B] mb-4 sm:mb-6">
      {post?.data ? 'Editar Post' : 'Nuevo Post'}
    </h3>
    {error && <div className="text-[#C68B59] text-center mb-4">{error}</div>}

    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full">
      <input
        type="text"
        id="title"
        placeholder="Nombre"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 sm:p-3 border border-[#8A8B6C] rounded-md bg-white text-lg focus:border-[#C68B59] focus:outline-none"
        required
      />
      <select
        id="kindOfPost"
        value={kindOfPost}
        onChange={(e) => setKindOfPost(e.target.value)}
        className="w-full p-2 sm:p-3 border border-[#8A8B6C] rounded-md bg-white text-lg focus:border-[#C68B59] focus:outline-none"
        required
      >
        <option value="">Selecciona un tipo</option>
        <option value="Bar">Bar</option>
        <option value="Restaurante">Restaurante</option>
        <option value="Alojamiento">Alojamiento</option>
        <option value="Musical">Musical</option>
        <option value="Teatro">Teatro</option>
        <option value="Lugar">Lugar</option>
        <option value="Evento">Evento</option>
      </select>
      <textarea
        id="description"
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 sm:p-3 border border-[#8A8B6C] rounded-md bg-white text-lg focus:border-[#C68B59] focus:outline-none h-24 resize-none"
        required
      ></textarea>

      <input
        type="file"
        id="image"
        accept="image/*"
        onChange={handleImageChange}
        className="w-full p-2 text-sm border border-[#8A8B6C] rounded-md bg-white"
      />

      {(imagePreview || image) && (
        <div className="w-full">
          <h4 className="text-lg text-[#1B3A4B] my-2">Imagen:</h4>
          {image && <p className="bg-[#E3D5C7] p-2 my-1 rounded-md text-sm text-[#1B3A4B]">{image.name}</p>}
          <img 
            src={image ? URL.createObjectURL(image) : imagePreview} 
            alt="Previsualización" 
            className="max-w-full h-auto mt-2 rounded-lg shadow-sm" 
          />
        </div>
      )}

      <input
        type="submit"
        id="save"
        value={post?.data ? "Actualizar" : "Crear"}
        className="w-full p-3 text-lg font-bold bg-[#1B3A4B] text-white rounded-md cursor-pointer hover:bg-[#8A8B6C] transition-colors"
      />
      <button
        type="button"
        onClick={onCancel}
        className="w-full p-3 text-lg font-bold bg-[#C68B59] text-white rounded-md cursor-pointer hover:bg-[#8A8B6C] transition-colors"
      >
        Cancelar
      </button>
    </form>
  </div>
</div>

  );
};






