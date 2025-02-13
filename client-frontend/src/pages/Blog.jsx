// Blog.jsx
import React, { useState, useEffect } from 'react';
import { getPosts, deletePost } from '../services/services';
import ButtonIcon from '../components/ButtonIcon';
import { useNavigate, Link } from 'react-router-dom';
import { Create } from '../components/PostForm';
import IconCreate from '../components/IconCreate';
import { getLikesCount, toggleLike } from '../services/likeServices';
import { toast } from 'react-toastify';
import Search from '../components/Search';
import { PostType } from '../components/PostForm';
import LocationsMap from '../components/LocationsMap';
import { Map } from 'lucide-react';

const Blog = () => {
  const [filters, setFilters] = useState({});
  const [articles, setArticles] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [likes, setLikes] = useState({});
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  const filterArticles = (articles, filters) => {
    if (!Array.isArray(articles)) return [];

    return articles.filter(article => {
      // Filtrar por nombre
      if (filters.name && !article.name?.toLowerCase().includes(filters.name.toLowerCase())) {
        return false;
      }

      // Filtrar por tipo
      if (filters.kindOfPost && article.kindOfPost !== filters.kindOfPost) {
        return false;
      }

      // Filtrar por ciudad
      if (filters.city && !article.city?.toLowerCase().includes(filters.city.toLowerCase())) {
        return false;
      }

      // Filtrar por precio
      const price = Number(article.price);
      if (filters.minPrice && price < Number(filters.minPrice)) {
        return false;
      }
      if (filters.maxPrice && price > Number(filters.maxPrice)) {
        return false;
      }

      // Filtrar por puntuación
      const rating = Number(article.rating);
      if (filters.minRating && rating < Number(filters.minRating)) {
        return false;
      }
      if (filters.maxRating && rating > Number(filters.maxRating)) {
        return false;
      }

      // Filtrar por descripción
      if (filters.description && !article.description?.toLowerCase().includes(filters.description.toLowerCase())) {
        return false;
      }

      return true;
    });
  };

  const getFirstImage = (article) => {
    try {
      if (article.images && Array.isArray(article.images) && article.images.length > 0) {
        return article.images[0];
      }
      return 'https://res.cloudinary.com/dj4mtygcr/image/upload/v1738324021/default_ohqt2c.jpg';
    } catch (error) {
      console.error('Error getting image:', error);
      return 'https://res.cloudinary.com/dj4mtygcr/image/upload/v1738324021/default_ohqt2c.jpg';
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const postsData = await getPosts();
      const posts = Array.isArray(postsData) ? postsData : [];
      setArticles(posts);

      if (posts.length > 0) {
        const likesCountPromises = posts.map(post => getLikesCount(post.id));
        const likesCounts = await Promise.all(likesCountPromises);
        const initialLikes = {};
        likesCounts.forEach((count, index) => {
          initialLikes[posts[index].id] = count.count || 0;
        });
        setLikes(initialLikes);
      }
    } catch (error) {
      console.error('Error al obtener los artículos:', error);
      toast.error('Error al cargar los posts');
      setArticles([]);
      setLikes({});
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este post?");
    if (confirmDelete) {
      try {
        await deletePost(id);
        await fetchPosts(); // Recargar todos los posts
        toast.success('Post eliminado exitosamente');
      } catch (error) {
        console.error("Error al eliminar el post:", error);
        toast.error('Error al eliminar el post');
      }
    }
  };

  const handleNewPost = async (newPost) => {
    try {
      await fetchPosts(); // Recargar la lista completa
      setShowCreate(false); // Cerrar el formulario
      toast.success('Post creado exitosamente');
    } catch (error) {
      console.error('Error al actualizar la lista:', error);
      toast.error('Error al actualizar la lista de posts');
    }
  };

  const handleLike = async (postId) => {
    if (!token) {
      toast.info('Debes iniciar sesión para dar like');
      return;
    }

    try {
      const response = await toggleLike(postId);
      if (response.data?.liked !== undefined) {
        setLikes(prev => ({
          ...prev,
          [postId]: response.data.liked ? (prev[postId] || 0) + 1 : Math.max((prev[postId] || 0) - 1, 0)
        }));
      }
    } catch (error) {
      console.error('Error al manejar el like:', error);
      toast.error('Error al procesar el like');
    }
  };

  const filteredArticles = filterArticles(articles, filters);
  return (
    <div className="min-h-screen bg-[#F5F2ED]">
      {/* Header más compacto y moderno */}
      <header className="bg-[#1B3A4B]">
        {/* Navbar superior con logo */}
        <div className="md:hidden flex items-center justify-between px-4 py-2 border-b border-[#E3D5C7]/20">
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="w-8 h-8 rounded-full"
          />
          <button className="text-[#F5F2ED] p-2">
            <div className="space-y-1">
              <div className="w-6 h-0.5 bg-current"></div>
              <div className="w-6 h-0.5 bg-current"></div>
              <div className="w-6 h-0.5 bg-current"></div>
            </div>
          </button>
        </div>
        
        {/* Contenido del header */}
        <div className="px-4 py-4 md:py-8">
          <div className="container mx-auto text-center">
            <h1 className="text-2xl md:text-4xl font-bold text-[#F5F2ED]">
              <span className="md:hidden">Saving Time</span>
              <span className="hidden md:block">Bienvenidos a Saving Time</span>
            </h1>
            <p className="mt-1 md:mt-4 text-sm md:text-xl text-[#E3D5C7] font-light">
              Saber a dónde volver
            </p>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 pb-20">
        {/* Barra de búsqueda mejorada */}
        <div className="relative -mt-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="relative">
              <input
                type="text"
                placeholder="¿Qué estás buscando?"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B3A4B] focus:border-transparent"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <i className="fas fa-search text-sm"></i>
              </span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1B3A4B]"></div>
          </div>
        ) : (
          <>
            {/* Botón de mapa mejorado */}
            <div className="mb-4">
              <button
                onClick={() => setShowMap(!showMap)}
                className="w-full md:w-auto px-4 py-2.5 bg-[#1B3A4B] text-white rounded-lg hover:bg-[#8A8B6C] transition-colors text-sm flex items-center justify-center gap-2"
              >
                <Map size={16} />
                {showMap ? 'Ver lista' : 'Ver mapa'}
              </button>
            </div>

            {showMap ? (
              <LocationsMap articles={filteredArticles} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                {filteredArticles.map((article) => (
                  <div
                    key={article.id}
                    className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-transform hover:-translate-y-1"
                  >
                    <div className="relative h-48 md:h-52">
                      <img
                        src={getFirstImage(article)}
                        alt={article.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = getFirstImage({ images: [] });
                        }}
                      />
                      {article.images && article.images.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
                          {article.images.length}
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg md:text-xl font-semibold text-[#1B3A4B] mb-2">
                        {article.name}
                      </h3>
                      <p className="text-[#8A8B6C] text-sm mb-3 line-clamp-2 md:line-clamp-3">
                        {article.description}
                      </p>

                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          {role === 'admin' && token && (
                            <>
                              <ButtonIcon
                                icon="fas fa-edit"
                                onClick={() => navigate(`/editar/${article.id}`)}
                                title="Editar"
                                className="text-[#8A8B6C] hover:text-[#1B3A4B]"
                              />
                              <ButtonIcon
                                icon="fas fa-trash"
                                onClick={() => handleDelete(article.id)}
                                title="Eliminar"
                                className="text-[#C68B59] hover:text-[#1B3A4B]"
                              />
                            </>
                          )}
                        </div>

                        {token && (
                          <div className="flex items-center">
                            <ButtonIcon
                              icon={likes[article.id] ? "fas fa-heart text-[#C68B59]" : "far fa-heart"}
                              onClick={() => handleLike(article.id)}
                              title="Me gusta"
                              className={likes[article.id] ? "text-[#C68B59]" : "text-[#8A8B6C]"}
                            />
                            <span className="ml-2 text-xs md:text-sm text-[#8A8B6C]">
                              {likes[article.id] || 0}
                            </span>
                          </div>
                        )}
                      </div>

                      <Link
                        to={`/post/${article.id}`}
                        className="text-[#1B3A4B] text-sm font-medium hover:text-[#C68B59] transition-colors mt-3 inline-block"
                      >
                        Leer más...
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {showCreate && role === 'admin' && token && (
          <Create
            onCancel={() => setShowCreate(false)}
            onSubmit={handleNewPost}
          />
        )}

        {role === 'admin' && token && (
          <IconCreate
            onClick={() => setShowCreate(true)}
            className="fixed bottom-20 right-4 md:bottom-8 md:right-8 bg-[#1B3A4B] hover:bg-[#8A8B6C] text-white p-3 md:p-4 rounded-full shadow-lg transition-colors z-10"
          />
        )}
      </section>
    </div>
  );
};

export default Blog;




























