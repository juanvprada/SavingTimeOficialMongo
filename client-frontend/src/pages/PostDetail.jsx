import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOnePost } from '../services/services';
import axios from 'axios';
import CommentForm from '../components/CommentForm';
import useStore from '../store/store';
import ButtonIcon from '../components/ButtonIcon';

const PostDetail = () => {
  const { id } = useParams();
  const { token, role } = useStore();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();
  const postRef = useRef(null);

  // Obtener el post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const fetchedPost = await getOnePost(id);
        setPost(fetchedPost);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [id]);

  // Obtener los comentarios del post
  useEffect(() => {
    if (!id) {
      console.error("Post ID no disponible");
      return;
    }

    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/comments/${id}`);
        setComments(response.data);
        console.log('Comentarios obtenidos:', response.data);
      } catch (error) {
        console.error('Error obteniendo comentarios:', error);
      }
    };

    fetchComments();
  }, [id]);

  // Manejar el envío de un nuevo comentario
  const handleCommentAdded = () => {
    // Función para actualizar los comentarios cuando se agrega un nuevo comentario
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/comments/${id}`);
        setComments(response.data);
      } catch (error) {
        console.error('Error obteniendo comentarios:', error);
      }
    };

    fetchComments();
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <div
        className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-4xl p-10 h-full"
        ref={postRef}
      >
        <h1 className="text-4xl font-bold text-green-600 mb-6">{post.name}</h1>
        <img src={post.image} alt={post.name} className="w-full h-96 object-cover mb-6" />
        <p className="text-lg text-gray-700 leading-relaxed mb-6">{post.description}</p>

        <div className="mt-6 flex justify-between items-center">
          {role === 'admin' && token && (
            <ButtonIcon
              icon="fas fa-edit"
              onClick={() => navigate(`/editar/${post.id}`)}
              title="Editar"
            />
          )}
          {role === 'admin' && token && (
            <ButtonIcon
              icon="fas fa-trash"
              onClick={() => handleDelete(post.id)}
              title="Eliminar"
            />
          )}
        </div>

        {/* Sección de Comentarios */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800">Comentarios</h2>

          <div className="mt-4 space-y-4">
            {/* Mostrar comentarios */}
            {comments.length === 0 && <p>No hay comentarios aún.</p>}
            {comments.map((comment) => (
              <div key={comment.id} className="p-4 border-b border-gray-200">
                <p className="text-sm text-gray-500"><strong>{comment.username}</strong></p>
                <p className="text-gray-600">{comment.content}</p>
              </div>
            ))}
          </div>

          {/* Formulario para agregar un comentario */}
          {token && (
            <CommentForm
              postId={id}
              token={token}
              onCommentAdded={handleCommentAdded}
            />
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
