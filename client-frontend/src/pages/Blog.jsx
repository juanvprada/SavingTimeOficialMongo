import React, { useState, useEffect } from 'react';
import { getPosts, deletePost } from '../services/services';
import ButtonIcon from '../components/ButtonIcon';
import { useNavigate, Link } from 'react-router-dom';
import { Create } from '../components/PostForm';
import IconCreate from '../components/IconCreate';
import { getLikesCount, toggleLike } from '../services/likeServices';
import { toast } from 'react-toastify';

const Blog = () => {
  const [search, setSearch] = useState('');
  const [articles, setArticles] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [likes, setLikes] = useState({});
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  const fetchPosts = async () => {
    try {
      const postsData = await getPosts();
      if (Array.isArray(postsData)) {
        setArticles(postsData);
        const likesCountPromises = postsData.map(post => getLikesCount(post.id));
        const likesCounts = await Promise.all(likesCountPromises);
        const initialLikes = {};
        likesCounts.forEach((count, index) => {
          initialLikes[postsData[index].id] = count.count;
        });
        setLikes(initialLikes);
      } else {
        console.error('La respuesta no es un array:', postsData);
        setArticles([]);
      }
    } catch (error) {
      console.error('Error al obtener los artículos:', error);
      setArticles([]);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [])

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este post?");
    if (confirmDelete) {
      try {
        await deletePost(id);
        setArticles(articles.filter(article => article.id !== id));
      } catch (error) {
        console.error("Error al eliminar el post:", error);
      }
    }
  };

  const handleNewPost = async (newPost) => {

    setArticles(prevArticles => [newPost, ...prevArticles]);
    await fetchPosts();
  };

  const handleLike = async (postId) => {
    const trimmedPostId = postId.trim();

    try {
      const response = await toggleLike(trimmedPostId);

      // Actualizar el estado de "likes" según la respuesta del backend
      setLikes(prev => ({
        ...prev,
        [trimmedPostId]: response.liked ? (prev[trimmedPostId] || 0) + 1 : prev[trimmedPostId] - 1,
      }));
    } catch (error) {
      console.error('Error al manejar el like:', error);
    }
  };
  // Filtramos los artículos según el término de búsqueda
  const filteredArticles = Array.isArray(articles) ? articles.filter(article =>
    (article.name && article.name.toLowerCase().includes(search.toLowerCase())) ||
    (article.description && article.description.toLowerCase().includes(search.toLowerCase()))
  ) : [];

  return (
    <div className="min-h-screen bg-[#F5F2ED]"> {/* Changed from default to off-white */}
      <header className="bg-[#1B3A4B] text-[#F5F2ED] py-8"> {/* Changed from green to navy */}
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold">Bienvenidos a Saving Time</h1>
          <p className="mt-4 text-xl text-[#E3D5C7]">Saber a dónde volver </p>
        </div>
      </header>
      <h2 className="text-3xl font-semibold text-center text-[#1B3A4B] mt-4">Todas las publicaciones</h2>
      <section className="container mx-auto py-12 px-4">
        <div className="mb-8 text-center">
          <input
            type="text"
            className="px-4 py-2 w-full md:w-1/2 border border-[#8A8B6C] rounded-md focus:border-[#C68B59] focus:ring-[#C68B59]"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-transform transform hover:-translate-y-1"
            >
              <img
                src={article.image}
                alt={article.name}
                className="w-full h-52 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'http://localhost:5000/uploads/default.jpg';
                }}
              />
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-[#1B3A4B] mb-3">{article.name}</h3>
                <p className="text-[#8A8B6C] mb-4 line-clamp-4 leading-relaxed">{article.description}</p>
                <div className="flex justify-between items-center">
                  {role === 'admin' && token && (
                    <ButtonIcon
                      icon="fas fa-edit"
                      onClick={() => navigate(`/editar/${article.id}`)}
                      title="Editar"
                      className="text-[#8A8B6C] hover:text-[#1B3A4B]"
                    />
                  )}
                  {role === 'admin' && token && (
                    <ButtonIcon
                      icon="fas fa-trash"
                      onClick={() => handleDelete(article.id)}
                      title="Eliminar"
                      className="text-[#C68B59] hover:text-[#1B3A4B]"
                    />
                  )}
                  {token && (
                    <div className="flex items-center">
                      <ButtonIcon
                        icon={likes[article.id] ? "fas fa-heart text-[#C68B59]" : "far fa-heart"}
                        onClick={() => handleLike(article.id)}
                        title="Dar like"
                      />
                      <span className="ml-2 text-[#8A8B6C]">{likes[article.id] || 0}</span>
                    </div>
                  )}
                </div>
                <Link
                  to={`/post/${article.id}`}
                  className="text-[#1B3A4B] font-medium hover:text-[#C68B59] transition-colors mt-6 inline-block"
                >
                  Leer más...
                </Link>
              </div>
            </div>
          ))}
        </div>


        {showCreate && role === 'admin' && token && (
          <Create
            onCancel={() => setShowCreate(false)}
            onSubmit={handleNewPost}
          />
        )}

        {role === 'admin' && token && (
          <IconCreate onClick={() => setShowCreate(true)} className="text-[#1B3A4B] hover:text-[#C68B59]" />
        )}
      </section>
    </div>
  );
};

export default Blog;





























