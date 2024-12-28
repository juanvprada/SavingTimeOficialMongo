import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
   
    const fetchComments = async () => {
      try {
        const response = await axios.get(`/api/posts/${postId}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error('Error al obtener los comentarios:', error);
      }
    };

    fetchComments();
  }, [postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `/api/posts/${postId}/comments`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('Error al agregar el comentario:', error);
    }
  };

  return (
    <div>
      <h3>Comentarios</h3>
      {comments.map((comment) => (
        <div key={comment.id}>
          <p><strong>{comment.username}</strong> - {comment.created_at}</p>
          <p>{comment.content}</p>
        </div>
      ))}
      <form onSubmit={handleCommentSubmit}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Escribe tu comentario..."
        />
        <button type="submit">Comentar</button>
      </form>
    </div>
  );
};

export default CommentSection;
