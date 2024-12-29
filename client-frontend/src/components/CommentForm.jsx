import React, { useState } from 'react';
import { addComment } from '../services/commentServices';

const CommentForm = ({ postId, token, onCommentAdded }) => {
  const [commentContent, setCommentContent] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!commentContent.trim()) {
      setError('El comentario no puede estar vacío.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await addComment({ 
        postId, 
        content: commentContent.trim(), 
        token 
      });
      setCommentContent('');
      onCommentAdded();
    } catch (error) {
      console.error('Error al enviar el comentario:', error);
      setError('Error al enviar el comentario. Por favor, intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTextChange = (e) => {
    setCommentContent(e.target.value);
    if (error) setError('');
  };

  return (
    <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Deja un comentario
      </h3>
      
      <form onSubmit={handleCommentSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="relative">
          <textarea
            className={`w-full p-4 border rounded-lg resize-none transition duration-200
              ${error ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-green-500'}
              focus:ring-2 focus:ring-opacity-50 ${error ? 'focus:ring-red-200' : 'focus:ring-green-200'}
              disabled:bg-gray-50 disabled:cursor-not-allowed`}
            rows="4"
            placeholder="Escribe tu comentario..."
            value={commentContent}
            onChange={handleTextChange}
            disabled={isSubmitting}
          />
          {isSubmitting && (
            <div className="absolute inset-0 bg-gray-50 bg-opacity-50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !commentContent.trim()}
            className={`
              px-6 py-2.5 rounded-lg font-medium
              transition duration-300 ease-in-out
              ${isSubmitting || !commentContent.trim()
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 active:bg-green-800'}
              text-white
              flex items-center space-x-2
            `}
          >
            {isSubmitting ? (
              <>
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <span>Publicar comentario</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;

