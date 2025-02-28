// Blog.jsx
import React, { useState, useEffect } from 'react';
import { getPosts, deletePost } from '../services/services';
import ButtonIcon from '../components/ButtonIcon';
import { useNavigate, Link } from 'react-router-dom';
import { Create, RecommendationStatus } from '../components/PostForm';
import IconCreate from '../components/IconCreate';
import { getLikesCount, toggleLike } from '../services/likeServices';
import { toast } from 'react-toastify';
import Search from '../components/Search';
import { PostType } from '../components/PostForm';
import LocationsMap from '../components/LocationsMap';
import { Map, ThumbsDown, ThumbsUp, Filter } from 'lucide-react';
import { FaSignOutAlt } from 'react-icons/fa';

const Blog = () => {
  const [filters, setFilters] = useState({});
  const [recommendationFilter, setRecommendationFilter] = useState(null);
  const [articles, setArticles] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [likes, setLikes] = useState({});
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const filterArticles = (articles, filters, recommendationFilter) => {
    if (!Array.isArray(articles)) return [];

    return articles.filter(article => {
      // Filtrar por estado de recomendación
      if (recommendationFilter) {
        if (article.recommendationStatus !== recommendationFilter) {
          return false;
        }
      }

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

  const handleCreateNoVolver = () => {
    setShowCreate(true);
    // Preconfigurar el formulario para "No volver"
    // Esto se manejará en el componente Create
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

  // Manejar filtros de recomendación
  const handleRecommendationFilter = (status) => {
    if (recommendationFilter === status) {
      // Si ya está seleccionado, lo quitamos
      setRecommendationFilter(null);
    } else {
      // Si no, lo aplicamos
      setRecommendationFilter(status);
    }
  };

  // Limpiar todos los filtros
  const clearAllFilters = () => {
    setFilters({});
    setRecommendationFilter(null);
  };

  const filteredArticles = filterArticles(articles, filters, recommendationFilter);

  // Determinar si algún filtro está activo
  const isAnyFilterActive = Object.keys(filters).length > 0 || recommendationFilter !== null;

  return (
    <div className="min-h-screen bg-[#F5F2ED]">
      <header className="bg-[#1B3A4B] text-[#F5F2ED] py-5">
        <div className="container mx-auto px-4">
          {/* Versión móvil con menú hamburguesa integrado */}
          <div className="flex items-center justify-between md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white p-1 focus:outline-none order-1 z-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold font-playfair tracking-wide text-center flex-grow order-2">
              Saving Time
            </h1>
            <div className="order-3 w-6"></div> {/* Espacio para equilibrar el layout */}
          </div>

          {/* Subtítulo en móvil */}
          <p className="font-montserrat text-[#E3D5C7] text-sm mt-1 md:hidden text-center italic">
            Saber a dónde volver
          </p>

          {/* Versión desktop sin cambios pero con fuentes actualizadas */}
          <div className="text-center hidden md:block">
            <h1 className="text-4xl font-bold font-playfair tracking-wide">
              Bienvenidos a Saving Time
            </h1>
            <p className="mt-4 text-xl text-[#E3D5C7] font-montserrat italic">
              Saber a dónde volver
            </p>
          </div>
        </div>
      </header>

      {/* En móvil ocultamos este título */}
      <h2 className="hidden md:block text-2xl md:text-3xl font-semibold text-center text-[#1B3A4B] mt-4">
        Todas las publicaciones
      </h2>

      <section className="container mx-auto py-8 md:py-12 px-4">
        <Search
          onSearch={setFilters}
          postTypes={Object.values(PostType)}
        />

        {/* Botones de filtro rápido */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          {/* Versión móvil optimizada */}
          <div className="w-full md:hidden grid grid-cols-2 gap-2">
            <button
              onClick={() => handleRecommendationFilter(RecommendationStatus.RECOMMENDED)}
              className={`flex items-center justify-center gap-1 px-2 py-2 rounded-lg border transition-colors ${recommendationFilter === RecommendationStatus.RECOMMENDED
                ? 'bg-green-500 text-white border-green-600'
                : 'bg-white text-gray-700 border-gray-300'
                }`}
            >
              <ThumbsUp size={14} />
              <span className="text-sm">Recomendados</span>
            </button>

            <button
              onClick={() => handleRecommendationFilter(RecommendationStatus.DO_NOT_RETURN)}
              className={`flex items-center justify-center gap-1 px-2 py-2 rounded-lg border transition-colors ${recommendationFilter === RecommendationStatus.DO_NOT_RETURN
                ? 'bg-red-500 text-white border-red-600'
                : 'bg-white text-gray-700 border-gray-300'
                }`}
            >
              <ThumbsDown size={14} />
              <span className="text-sm">No volver</span>
            </button>

            <button
              onClick={() => setShowMap(!showMap)}
              className="col-span-2 flex items-center justify-center gap-1 px-2 py-2 bg-[#1B3A4B] text-white rounded-lg text-sm"
            >
              <Map size={14} />
              {showMap ? 'Ver lista' : 'Ver mapa'}
            </button>

            {isAnyFilterActive && (
              <button
                onClick={clearAllFilters}
                className="col-span-2 flex items-center justify-center gap-1 px-2 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm mt-1"
              >
                <Filter size={14} />
                <span>Limpiar filtros</span>
              </button>
            )}
          </div>

          {/* Versión desktop sin cambios */}
          <div className="hidden md:flex md:flex-wrap md:items-center md:justify-between md:w-full">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleRecommendationFilter(RecommendationStatus.RECOMMENDED)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg border transition-colors ${recommendationFilter === RecommendationStatus.RECOMMENDED
                  ? 'bg-green-500 text-white border-green-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-green-50'
                  }`}
              >
                <ThumbsUp size={16} />
                <span>Recomendados</span>
              </button>

              <button
                onClick={() => handleRecommendationFilter(RecommendationStatus.DO_NOT_RETURN)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg border transition-colors ${recommendationFilter === RecommendationStatus.DO_NOT_RETURN
                  ? 'bg-red-500 text-white border-red-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-red-50'
                  }`}
              >
                <ThumbsDown size={16} />
                <span>No volver</span>
              </button>

              {isAnyFilterActive && (
                <button
                  onClick={clearAllFilters}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                >
                  <Filter size={16} />
                  <span>Limpiar filtros</span>
                </button>
              )}
            </div>

            <button
              onClick={() => setShowMap(!showMap)}
              className="flex items-center gap-2 px-4 py-2 bg-[#1B3A4B] text-white rounded-lg hover:bg-[#8A8B6C] transition-colors"
            >
              <Map size={20} />
              {showMap ? 'Ver lista' : 'Ver mapa'}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1B3A4B]"></div>
          </div>
        ) : (
          <>
            {showMap ? (
              <LocationsMap articles={filteredArticles} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {filteredArticles.map((article) => (
                  <div
                    key={article.id}
                    className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-transform transform hover:-translate-y-1"
                  >
                    <div className="relative h-48 md:h-52 group">
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
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded-lg text-sm">
                          <i className="fas fa-images mr-1"></i>
                          {article.images.length}
                        </div>
                      )}

                      {/* Indicador de estado de recomendación */}
                      {article.recommendationStatus === RecommendationStatus.RECOMMENDED && (
                        <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-lg text-sm flex items-center gap-1">
                          <ThumbsUp size={14} />
                          <span>Recomendado</span>
                        </div>
                      )}

                      {article.recommendationStatus === RecommendationStatus.DO_NOT_RETURN && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-lg text-sm flex items-center gap-1">
                          <ThumbsDown size={14} />
                          <span>No volver</span>
                        </div>
                      )}
                    </div>

                    <div className="p-4 md:p-6">
                      <h3 className="text-xl font-semibold text-[#1B3A4B] mb-2">{article.name}</h3>
                      <p className="text-[#8A8B6C] text-sm md:text-base mb-3 line-clamp-2 md:line-clamp-4 leading-relaxed">
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
                            <span className="ml-2 text-[#8A8B6C]">{likes[article.id] || 0}</span>
                          </div>
                        )}
                      </div>

                      <Link
                        to={`/post/${article.id}`}
                        className="text-[#1B3A4B] font-medium hover:text-[#C68B59] transition-colors mt-4 inline-block"
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
          <div className="fixed bottom-4 right-4 inline-flex gap-3">
            <button
              onClick={() => {
                setShowCreate(true);
                // Podríamos configurar aquí un estado para preseleccionar "No volver" en el formulario
              }}
              className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition"
              aria-label="No Volver"
              title="Crear post de No Volver"
            >
              <ThumbsDown size={20} />
            </button>
            <IconCreate onClick={() => setShowCreate(true)} />
          </div>
        )}
      </section>
      {/* Menú lateral móvil */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          <div
            className="fixed top-0 left-0 h-auto w-64 bg-[#1B3A4B] shadow-lg transform transition-transform z-50 rounded-br-lg"
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <span className="text-white font-semibold">Menú</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-white"
              >
                ✕
              </button>
            </div>

            <ul className="py-4 px-6 space-y-4">
              <li>
                <Link
                  className="text-white hover:text-[#C68B59] block py-2"
                  to="/blog"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  className="text-white hover:text-[#C68B59] block py-2"
                  to="/nosotros"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Nosotros
                </Link>
              </li>
              <li>
                <Link
                  className="text-white hover:text-[#C68B59] block py-2"
                  to="/contacto"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contacto
                </Link>
              </li>
              {/* Añadir enlace al perfil para usuarios logueados */}
              {token && (
                <li>
                  <Link
                    className="text-white hover:text-[#C68B59] flex items-center gap-2 py-2"
                    to="/perfil"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Mi Perfil</span>
                  </Link>
                </li>
              )}
              {role === 'admin' && (
                <li>
                  <Link
                    className="text-white hover:text-[#C68B59] block py-2"
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin
                  </Link>
                </li>
              )}
              {token && (
                <li className="pt-4 border-t border-gray-700">
                  <button
                    onClick={() => {
                      localStorage.removeItem('token');
                      localStorage.removeItem('role');
                      localStorage.removeItem('name');
                      navigate('/');
                      setMobileMenuOpen(false);
                    }}
                    className="text-white hover:text-[#C68B59] flex items-center gap-2 py-2"
                  >
                    <FaSignOutAlt size={18} />
                    <span>Cerrar Sesión</span>
                  </button>
                </li>
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default Blog;