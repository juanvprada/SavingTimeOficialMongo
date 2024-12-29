import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOnePost } from '../services/services';
import { getComments } from '../services/commentServices';
import ButtonIcon from '../components/ButtonIcon';
import CommentForm from '../components/CommentForm';
import useStore from '../store/store';

const PostDetail = () => {
  const { id } = useParams();
  const { token, role } = useStore();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const postRef = useRef(null);

  // Función para manejar la URL de la imagen de forma segura
  const getImageUrl = (imageUrl) => {
    if (!imageUrl || imageError) {
      return 'http://localhost:5000/uploads/default.jpg';
    }

    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    return `http://localhost:5000${imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`}`;
  };


  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const fetchedPost = await getOnePost(id);
        console.log('Fetched post:', fetchedPost);
        console.log('Image URL:', fetchedPost.data?.image);
        setPost(fetchedPost.data);
      } catch (error) {
        console.error("Error fetching post:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const fetchComments = async () => {
      try {
        const response = await getComments(id);
        console.log('Raw comments response:', response);
        console.log('Comments data:', response?.data);
        setComments(response?.data || []);
      } catch (error) {
        console.error('Error obteniendo comentarios:', error);
        setComments([]);
      }
    };

    fetchComments();
  }, [id]);

  const handleCommentAdded = async () => {
    try {
      const commentsData = await getComments(id);
      setComments(commentsData?.data || []);
    } catch (error) {
      console.error('Error obteniendo comentarios:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="text-gray-500">No se encontró el post</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-4xl p-10 h-full" ref={postRef}>
        <h1 className="text-4xl font-bold text-green-600 mb-6">{post.name}</h1>

        {/* Contenedor de imagen */}
        <div className="w-full h-96 relative mb-6">
          {console.log('Imagen del post:', post.image)}
          {!imageError ? (
            <img
              src={getImageUrl(post.image)}
              alt={post.name}
              className="w-full h-full object-cover rounded-lg"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
              <div className="text-center">
                <i className="fas fa-image text-gray-400 text-4xl mb-2"></i>
                <p className="text-gray-500">Imagen no disponible</p>
              </div>
            </div>
          )}
        </div>

        <p className="text-lg text-gray-700 leading-relaxed mb-6">{post.description}</p>

        <p className="text-sm text-gray-500 mb-4">
          Publicado por: {post.user?.name || 'Usuario desconocido'} el{' '}
          {post.created_at
            ? new Date(post.created_at).toLocaleString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
            : 'Fecha no disponible'}
        </p>


        {role === 'admin' && token && (
          <div className="mt-6 flex justify-between items-center">
            <ButtonIcon
              icon="fas fa-edit"
              onClick={() => navigate(`/editar/${post.id}`)}
              title="Editar"
            />
            <ButtonIcon
              icon="fas fa-trash"
              onClick={() => handleDelete(post.id)}
              title="Eliminar"
            />
          </div>
        )}

        {/* Sección de Comentarios */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Comentarios</h2>

          <div className="mt-4 space-y-4">
            {Array.isArray(comments) && comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-green-200 transition-colors">
                  <p className="text-gray-700 mb-2">{comment.content}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-500">
                      <i className="fas fa-user mr-2"></i>
                      <span>{comment.user?.name || 'Usuario desconocido'}</span>
                    </div>
                    <time className="text-gray-400" dateTime={comment.created_at}>
                      {comment.created_at
                        ? new Date(comment.created_at).toLocaleString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                        : 'Fecha no disponible'}
                    </time>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 italic">No hay comentarios aún.</p>
                <p className="text-sm text-gray-400 mt-1">¡Sé el primero en comentar!</p>
              </div>
            )}
          </div>

          {token && (
            <div className="mt-6">
              <CommentForm
                postId={id}
                token={token}
                onCommentAdded={handleCommentAdded}
              />
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={() => navigate('/blog')}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-300"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;