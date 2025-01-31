import React, { useState, useEffect } from 'react';
import { createPost, updatePost } from '../services/services';
import { logoImg } from '../utils';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useStore from '../store/store';
import { normalizeImageUrl } from '../utils/imageUtils';

// Define PostType enum
export const PostType = {
  BAR: 'Bar',
  RESTAURANTE: 'Restaurante',
  ALOJAMIENTO: 'Alojamiento',
  MUSICAL: 'Musical',
  TEATRO: 'Teatro',
  LUGAR: 'Lugar',
  EVENTO: 'Evento',
};

export const Create = ({ post, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    kindOfPost: '',
    description: '',
    images: [],
    city: '',
    price: '',
    rating: ""
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const userId = useStore((state) => state.userId);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  useEffect(() => {
    if (post?.data) {
      setFormData({
        name: post.data.name || '',
        kindOfPost: post.data.kindOfPost || '',
        description: post.data.description || '',
        images: [],
        city: post.data.city || '',
        price: post.data.price?.toString() || '',
        rating: post.data.rating?.toString() || ''
      });

      if (post.data.images && Array.isArray(post.data.images)) {
        setImagePreviews(post.data.images.map(normalizeImageUrl).filter(Boolean));
      }
    }
  }, [post]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateImage = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (!validTypes.includes(file.type)) {
      toast.error(`${file.name} no es un tipo de imagen válido`);
      return false;
    }

    if (file.size > maxSize) {
      toast.error(`${file.name} excede el límite de 5MB`);
      return false;
    }

    return true;
  };

  const handleImageChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (!selectedFiles.length) return;

    const validFiles = selectedFiles.filter(validateImage);

    if (validFiles.length === 0) {
      toast.error('No se seleccionaron imágenes válidas.');
      return;
    }

    // Limpiar `formData.images` para evitar duplicados
    setFormData(prev => ({
      ...prev,
      images: validFiles // Solo archivos, sin URLs
    }));

    // Crear URLs de vista previa
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(newPreviews);

    console.log("✅ Imágenes seleccionadas:", validFiles);
  };


  const removeImage = (index) => {
    // Revoke the URL to prevent memory leaks
    if (imagePreviews[index]?.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviews[index]);
    }

    // Actualizar mainImageIndex si es necesario
    if (index === mainImageIndex) {
      setMainImageIndex(0);
    } else if (index < mainImageIndex) {
      setMainImageIndex(prev => prev - 1);
    }

    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));

    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Validaciones básicas
      if (!formData.name.trim()) throw new Error('El nombre es requerido');
      if (!formData.kindOfPost) throw new Error('El tipo de post es requerido');
      if (formData.description.trim().length < 10) throw new Error('La descripción debe tener al menos 10 caracteres');
      if (!formData.city.trim()) throw new Error('La ciudad es requerida');
      if (!formData.price || Number(formData.price) < 0) throw new Error('El precio debe ser un número válido');
      if (!formData.rating || Number(formData.rating) < 1 || Number(formData.rating) > 5) throw new Error('La puntuación debe estar entre 1 y 5');

      const submitData = new FormData();
      const uploadedUrls = [];

      // Manejar imágenes existentes
      if (post?.data?.images) {
        const reorderedImages = [...post.data.images];
        if (mainImageIndex > 0) {
          const mainImage = reorderedImages[mainImageIndex];
          reorderedImages.splice(mainImageIndex, 1);
          reorderedImages.unshift(mainImage);
        }
        uploadedUrls.push(...reorderedImages);
      }

      // Subir imágenes a Cloudinary
      for (const file of formData.images) {
        const uploadData = new FormData();
        uploadData.append('file', file);
        uploadData.append('upload_preset', 'saving-time');

        const uploadResponse = await fetch(
          'https://api.cloudinary.com/v1_1/dj4mtygcr/image/upload',
          {
            method: 'POST',
            body: uploadData
          }
        );

        const responseData = await uploadResponse.json();
        console.log('Respuesta de Cloudinary:', responseData);

        uploadedUrls.push(responseData.secure_url);
      }

      // Añadir campos al FormData...
      submitData.append('name', formData.name.trim());
      submitData.append('kindOfPost', formData.kindOfPost);
      submitData.append('description', formData.description.trim());
      submitData.append('userId', userId.toString());
      submitData.append('city', formData.city.trim());
      submitData.append('price', Number(formData.price).toString());
      submitData.append('rating', Number(formData.rating).toString());

      // Añadir URLs de Cloudinary
      uploadedUrls.forEach(url => {
        submitData.append('images', url);
      });

      // Enviar post
      const response = post?.data?.id
        ? await updatePost(post.data.id, submitData)
        : await createPost(submitData);

      toast.success(post?.data?.id ? 'Post actualizado' : 'Post creado');
      if (onSubmit) onSubmit(response.data);
      navigate('/blog');

    } catch (error) {
      console.error('Error en submit:', error);
      toast.error(error.message);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
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

        {error && (
          <div className="text-red-500 text-center mb-4 p-2 bg-red-100 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Nombre"
            className="w-full p-2 border rounded focus:ring-2"
            required
          />

          <select
            name="kindOfPost"
            value={formData.kindOfPost}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:ring-2"
            required
          >
            <option value="">Selecciona un tipo</option>
            {Object.values(PostType).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="Ciudad"
            className="w-full p-2 border rounded focus:ring-2"
            required
          />

          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="Precio"
            min="0"
            step="0.01"
            className="w-full p-2 border rounded focus:ring-2"
            required
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Descripción"
            className="w-full p-2 border rounded focus:ring-2 h-32"
            required
          />
          <input
            type="number"
            name="rating"
            value={formData.rating}
            onChange={handleInputChange}
            placeholder="Puntuación (1-5)"
            min="1"
            max="5"
            className="w-full p-2 border rounded focus:ring-2"
            required
          />


          <div className="space-y-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              multiple
              className="w-full p-2 border rounded"
            />
            <p className="text-sm text-gray-500">
              Máximo 10 imágenes, 5MB por imagen
            </p>
          </div>

          {imagePreviews.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-gray-500 mb-2">
                Click en "★" para establecer como imagen principal
              </p>
              <div className="grid grid-cols-2 gap-2">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className={`w-full h-32 object-cover rounded ${index === mainImageIndex ? 'ring-2 ring-[#1B3A4B]' : ''
                        }`}
                    />
                    <div className="absolute top-1 right-1 flex gap-1">
                      <button
                        type="button"
                        onClick={() => setMainImageIndex(index)}
                        className={`w-6 h-6 flex items-center justify-center rounded-full ${index === mainImageIndex
                          ? 'bg-[#1B3A4B] text-white'
                          : 'bg-white text-gray-400 hover:text-[#1B3A4B]'
                          }`}
                      >
                        ★
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 p-2 text-white rounded ${isSubmitting ? 'bg-gray-400' : 'bg-[#1B3A4B] hover:bg-[#8A8B6C]'
                }`}
            >
              {isSubmitting
                ? 'Procesando...'
                : post?.data
                  ? 'Actualizar'
                  : 'Crear'}
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="flex-1 p-2 bg-[#C68B59] text-white rounded hover:bg-[#8A8B6C]"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};





