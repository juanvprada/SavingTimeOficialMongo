import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOnePost } from '../services/services'; 
import { Create } from './Createpost'; 

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await getOnePost(id);
        setPost(postData);
      } catch (error) {
        console.error("Error al obtener el post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleUpdate = (updatedPost) => {
    
    navigate('/blog'); 
  };

  const handleCancel = () => {
    navigate('/blog');
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Editar Post</h2>
      <Create post={post} onSubmit={handleUpdate} onCancel={handleCancel} />
    </div>
  );
};

export default EditPost;







