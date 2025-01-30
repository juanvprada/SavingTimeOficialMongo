import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOnePost, updatePost } from '../services/services';
import { Create } from '../components/PostForm';
import { toast } from 'react-toastify';

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
        
        const baseUrl = 'https://savingtimeoficial.eu-4.evennode.com';
        
        setPost({
          data: {
            ...response.data,
            id: response.data._id || response.data.id,
            images: response.data.images?.map(img =>
              img.startsWith('http') ? img : `${baseUrl}/uploads/${img}`
            ) || []
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
      await updatePost(id, updatedPost); // Envía el FormData directamente
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