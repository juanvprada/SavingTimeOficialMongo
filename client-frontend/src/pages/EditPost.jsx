import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOnePost } from '../services/services';
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
        const postData = await getOnePost(id);
        console.log('Post data fetched:', postData);
        setPost(postData);
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
      console.log('Updated post:', updatedPost);
      navigate('/blog');
      toast.success('Post actualizado exitosamente');
    } catch (error) {
      console.error("Error al actualizar:", error);
      toast.error("Error al actualizar el post");
    }
  };

  const handleCancel = () => {
    navigate('/blog');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Create
        post={post}
        onSubmit={handleUpdate}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default EditPost;