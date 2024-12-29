import React, { useState, useEffect } from 'react';
import { createPost, updatePost } from '../services/services';
import { logoImg } from '../utils';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useStore from '../store/store';

export const Create = ({ post, onSubmit, onCancel }) => {
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
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
      // Set image previews if there are existing images
      if (post.data.images && Array.isArray(post.data.images)) {
        setImagePreviews(post.data.images);
      } else if (post.data.image) {
        setImagePreviews([post.data.image]);
      }
    }
  }, [post]);

  const handleImageChange = (event) => {
    const selectedImages = Array.from(event.target.files);
    
    if (selectedImages.length === 0) {
      return;
    }

    // Validate each image
    const validImages = selectedImages.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit

      if (!isValidType) {
        toast.error(`${file.name} no es un tipo de imagen válido`);
      }
      if (!isValidSize) {
        toast.error(`${file.name} excede el límite de 5MB`);
      }

      return isValidType && isValidSize;
    });

    if (validImages.length === 0) {
      return;
    }

    setImages(prevImages => [...prevImages, ...validImages]);
    
    // Create preview URLs for valid images
    const newPreviews = validImages.map(file => URL.createObjectURL(file));
    setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
    setImagePreviews(prevPreviews => {
      const newPreviews = prevPreviews.filter((_, i) => i !== index);
      return newPreviews;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!userId) {
      setError('Sesión no válida. Por favor, inicia sesión nuevamente.');
      return;
    }

    if (images.length === 0 && !post?.data) {
      toast.error('Debes subir al menos una imagen.');
      return;
    }

    const formData = new FormData();
    formData.append('name', title);
    formData.append('kindOfPost', kindOfPost);
    formData.append('description', description);
    formData.append('userId', userId);

    // Append all images
    images.forEach((image, index) => {
      formData.append('images', image);
    });

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

          <div className="w-full">
            <input
              type="file"
              id="images"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 text-sm border border-[#8A8B6C] rounded-md bg-white"
              multiple
            />
            <p className="text-sm text-gray-500 mt-1">
              Máximo 5MB por imagen. Formatos permitidos: JPG, PNG, GIF
            </p>
          </div>

          {imagePreviews.length > 0 && (
            <div className="w-full">
              <h4 className="text-lg text-[#1B3A4B] my-2">Imágenes:</h4>
              <div className="grid grid-cols-2 gap-2">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
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





