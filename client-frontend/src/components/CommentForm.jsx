// CommentForm.jsx
import React, { useState } from 'react';
import { addComment } from '../services/commentServices';

const CommentForm = ({ postId, token, onCommentAdded }) => {
  const [commentContent, setCommentContent] = useState('');
  const [error, setError] = useState('');

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!commentContent.trim()) {
      setError('El comentario no puede estar vacío.');
      return;
    }

    try {
      await addComment({ postId, content: commentContent, token });
      onCommentAdded();
      setCommentContent('');
      setError('');
    } catch (error) {
      setError('Error al enviar el comentario. Intenta de nuevo.');
      console.error(error);
    }
  };

  return (
    <div className="comment-form mt-6">
      <h3 className="text-xl font-semibold mb-4">Deja un comentario</h3>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <form onSubmit={handleCommentSubmit}>
        <textarea
          className="w-full p-4 border rounded-lg mb-4"
          rows="4"
          placeholder="Escribe tu comentario..."
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-300"
        >
          Comentar
        </button>
      </form>
    </div>
  );
};

export default CommentForm;

