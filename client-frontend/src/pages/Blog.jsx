import React, { useState, useEffect } from 'react';
import { getPosts, deletePost } from '../services/services';
import ButtonIcon from '../components/ButtonIcon';
import { useNavigate, Link } from 'react-router-dom';
import { Create } from './Createpost';
import IconCreate from '../components/IconCreate';
import { getLikesCount, toggleLike } from '../services/likeServices';

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
      const posts = await getPosts();
      setArticles(posts);
      const likesCountPromises = posts.map(post => getLikesCount(post.id));
      const likesCounts = await Promise.all(likesCountPromises);
      const initialLikes = {};
      likesCounts.forEach((count, index) => {
        initialLikes[posts[index].id] = count.count;
      });
      setLikes(initialLikes);
    } catch (error) {
      console.error('Error al obtener los artículos:', error);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const posts = await getPosts();
        setArticles(posts);
        const likesCountPromises = posts.map(post => getLikesCount(post.id));
        const likesCounts = await Promise.all(likesCountPromises);
        const initialLikes = {};
        likesCounts.forEach((count, index) => {
          initialLikes[posts[index].id] = count.count;
        });
        setLikes(initialLikes);
      } catch (error) {
        console.error('Error al obtener los artículos:', error);
      }
    };

    fetchPosts();
  }, []);  

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
  const filteredArticles = articles.filter(article =>
    (article.name && article.name.toLowerCase().includes(search.toLowerCase())) ||
    (article.description && article.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className=" min-h-screen ">
      <header className="bg-green-600 text-white py-8">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold">Bienvenidos a Bio Blog</h1>
          <p className="mt-4 text-xl">Tu fuente de información para un estilo de vida sostenible y ecológico.</p>
        </div>
      </header>
      <h2 className="text-3xl font-semibold text-center text-gray-800 mt-4">Todas las publicaciones</h2>
      <section className="container mx-auto py-12 px-4">
        <div className="mb-8 text-center">
          <input
            type="text"
            className="px-4 py-2 w-full md:w-1/2 border border-green-600 rounded-md"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <div key={article.id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <img
                src={article.image}
                alt={article.name}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'ruta_a_imagen_por_defecto';
                }}
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-green-600 mb-2">{article.name}</h3>
                <p className="text-gray-700 mb-4 line-clamp-4">{article.description}</p>
                <div className="flex justify-between items-center">
                  {/* Icono de Editar visible solo para admin logueado */}
                  {role === 'admin' && token && (
                    <ButtonIcon
                      icon="fas fa-edit"
                      onClick={() => navigate(`/editar/${article.id}`)}
                      title="Editar"
                    />
                  )}
                  {/* Icono de Eliminar visible solo para admin logueado */}
                  {role === 'admin' && token && (
                    <ButtonIcon
                      icon="fas fa-trash"
                      onClick={() => handleDelete(article.id)}
                      title="Eliminar"
                    />
                  )}
                  {/* Icono de corazón visible para usuarios logueados */}
                  {token && (
                    <div className="flex items-center">
                      <ButtonIcon
                        icon={likes[article.id] ? "fas fa-heart text-red-500" : "far fa-heart"}
                        onClick={() => handleLike(article.id)} 
                        title="Dar like"
                      />
                      <span className="ml-2">{likes[article.id] || 0}</span>
                    </div>
                  )}
                </div>
                <Link
                  to={`/post/${article.id}`}
                  className="text-green-600 font-semibold hover:underline"
                >
                  Leer más...
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Componente de creación de nuevo post, visible solo para admin logueado */}
        {showCreate && role === 'admin' && token && (
          <Create
            onCancel={() => setShowCreate(false)}
            onSubmit={handleNewPost}
          />
        )}

        {/* Ícono de crear nuevo post visible solo para admin logueado */}
        {role === 'admin' && token && (
          <IconCreate onClick={() => setShowCreate(true)} />
        )}
      </section>
    </div>
  );
};

export default Blog;





























