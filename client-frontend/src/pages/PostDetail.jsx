import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOnePost } from '../services/services';
import { getComments } from '../services/commentServices';
import ButtonIcon from '../components/ButtonIcon';
import CommentForm from '../components/CommentForm';
import useStore from '../store/store';

const ImageGallery = ({ images, postName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageError, setImageError] = useState({});

  const getImageUrl = (imageUrl) => {
    if (!imageUrl || imageError[imageUrl]) {
      return 'http://localhost:5000/uploads/default.jpg';
    }

    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    return `http://localhost:5000${imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`}`;
  };

  const handleImageError = (imageUrl) => {
    setImageError(prev => ({ ...prev, [imageUrl]: true }));
  };

  const handlePrevious = () => {
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <i className="fas fa-image text-gray-400 text-4xl mb-2"></i>
          <p className="text-gray-500">No hay imágenes disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative w-full h-96">
        <img
          src={getImageUrl(images[currentIndex])}
          alt={`${postName} - Imagen ${currentIndex + 1}`}
          className="w-full h-full object-cover rounded-lg"
          onError={() => handleImageError(images[currentIndex])}
        />
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-opacity-75 transition-all"
              aria-label="Imagen anterior"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-opacity-75 transition-all"
              aria-label="Siguiente imagen"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex ? 'border-[#1B3A4B]' : 'border-transparent'
              }`}
            >
              <img
                src={getImageUrl(image)}
                alt={`Miniatura ${index + 1}`}
                className="w-full h-full object-cover"
                onError={() => handleImageError(image)}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

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
        const fetchedPost = await getOnePost(id);
        console.log('Fetched post:', fetchedPost);
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
          images={post.images || [post.image]} 
          postName={post.name}
        />

        <p className="text-lg text-gray-700 leading-relaxed my-6">{post.description}</p>

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