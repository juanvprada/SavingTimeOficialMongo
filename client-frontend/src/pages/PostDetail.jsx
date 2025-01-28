import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOnePost, deletePost } from '../services/services';
import { getComments } from '../services/commentServices';
import ButtonIcon from '../components/ButtonIcon';
import CommentForm from '../components/CommentForm';
import ImageGallery from '../components/ImageGallery';
import useStore from '../store/store';
import { toast } from 'react-toastify';

const PostDetail = () => {
  const { id } = useParams();
  const { token, role } = useStore();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const postRef = useRef(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await getOnePost(id);

        if (response?.data) {
          // Asegurarse de que images sea siempre un array
          const postData = {
            ...response.data,
            images: response.data.images ||
              (response.data.image ? [response.data.image] : [])
          };
          setPost(postData);
        }
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

  const handleDelete = async (postId) => {
    if (!window.confirm('¿Estás seguro que deseas eliminar este post?')) {
      return;
    }

    try {
      await deletePost(postId);
      toast.success('Post eliminado correctamente');
      navigate('/blog');
    } catch (error) {
      console.error('Error al eliminar:', error);
      toast.error('Error al eliminar el post');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1B3A4B]"></div>
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
        <h1 className="text-4xl font-bold text-[#1B3A4B] mb-6">{post.name}</h1>

        <ImageGallery
          images={post.images}
          postName={post.name}
        />

        <div className="my-6 space-y-4">
          <p className="text-lg text-gray-700 leading-relaxed">{post.description}</p>

          <div className="flex flex-col sm:flex-row gap-4 py-3 border-t border-b border-gray-200">
            <div className="flex items-center">
              <i className="fas fa-map-marker-alt text-[#1B3A4B] mr-2"></i>
              <span className="text-gray-700">
                <strong className="text-[#1B3A4B]">Ciudad:</strong> {post.city || 'No especificada'}
              </span>
            </div>

            <div className="flex items-center">
              <i className="fas fa-tag text-[#1B3A4B] mr-2"></i>
              <span className="text-gray-700">
                <strong className="text-[#1B3A4B]">Precio persona:</strong> {
                  post.price !== undefined && post.price !== null
                    ? `${post.price.toLocaleString('es-ES', {
                      style: 'currency',
                      currency: 'EUR'
                    })}`
                    : 'No especificado'
                }
              </span>
            </div>
            <div className="flex items-center">
              <i className="fas fa-star text-[#1B3A4B] mr-2"></i>
              <span className="text-gray-700">
                <strong className="text-[#1B3A4B]">Puntuación:</strong> {
                  post.rating ? `${post.rating}/5` : 'No especificada'
                }
              </span>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Publicado por: {post.userId?.name || 'Usuario desconocido'} el{' '}
          {post.createdAt ? new Date(post.createdAt).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }) : 'Fecha no disponible'}
        </p>
        {role === 'admin' && token && (
          <div className="mt-6 flex justify-between items-center">
            <ButtonIcon
              icon="fas fa-edit"
              onClick={() => navigate(`/editar/${post.id}`)}
              title="Editar"
              className="text-[#8A8B6C] hover:text-[#1B3A4B]"
            />
            <ButtonIcon
              icon="fas fa-trash"
              onClick={() => handleDelete(post.id)}
              title="Eliminar"
              className="text-[#C68B59] hover:text-[#1B3A4B]"
            />
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Comentarios</h2>
          <div className="mt-4 space-y-4">
            {Array.isArray(comments) && comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-[#1B3A4B] transition-colors">
                  <p className="text-gray-700 mb-2">{comment.content}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-500">
                      <i className="fas fa-user mr-2"></i>
                      <span>{comment.userId?.name || 'Usuario desconocido'}</span>
                    </div>
                    <time className="text-gray-400" dateTime={comment.createdAt}>
                      {comment.createdAt
                        ? new Date(comment.createdAt).toLocaleString('es-ES', {
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
            className="bg-[#1B3A4B] text-white px-6 py-2 rounded-lg hover:bg-[#8A8B6C] transition duration-300"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;