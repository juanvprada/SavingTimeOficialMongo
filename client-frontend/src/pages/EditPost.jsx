import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOnePost, updatePost } from '../services/services';
import { Create } from '../components/PostForm';
import { toast } from 'react-toastify';
import { normalizeImageUrl } from '../utils/imageUtils';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await getOnePost(id);
        console.log('Post data fetched:', response);

        // Normalizar las URLs de las imágenes
        const normalizedImages = response.data.images?.map(img => {
          return normalizeImageUrl(img);
        }).filter(Boolean) || [];

        console.log('Imágenes normalizadas:', normalizedImages);

        setPost({
          data: {
            ...response.data,
            id: response.data._id || response.data.id,
            images: normalizedImages
          }
        });
      } catch (error) {
        console.error("Error al obtener el post:", error);
        toast.error("Error al cargar el post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleUpdate = async (updatedPost) => {
    try {
      await updatePost(id, updatedPost);
      toast.success('Post actualizado exitosamente');
      navigate('/blog');
    } catch (error) {
      console.error("Error al actualizar:", error);
      toast.error(error.message || "Error al actualizar el post");
    }
  };

  const handleCancel = () => {
    navigate('/blog');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1B3A4B]"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Create
        post={post}
        onSubmit={handleUpdate}
        onCancel={handleCancel}
        isEditing={true}
      />
    </div>
  );
};

export default EditPost;