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
      <header className="bg-[#1B3A4B] text-[#F5F2ED] py-6">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold">Saving Time</h1>
          <p className="mt-2 text-[#E3D5C7] text-sm italic">Saber a dónde volver</p>
        </div>
      </header>

      <section className="container mx-auto py-8 px-4">
        {/* Barra de búsqueda */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Buscar lugares..."
            className="w-full px-4 py-2 rounded-lg border border-[#1B3A4B] focus:outline-none focus:ring-2 focus:ring-[#1B3A4B] focus:border-transparent"
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1B3A4B]"></div>
          </div>
        ) : (
          <>
            <div className="mb-4 flex justify-end">
              <button
                onClick={() => setShowMap(!showMap)}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#1B3A4B] text-white rounded-lg hover:bg-[#8A8B6C] transition-colors text-sm"
              >
                <Map className="w-4 h-4" />
                {showMap ? 'Lista' : 'Mapa'}
              </button>
            </div>

            {showMap ? (
              <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Componente de mapa aquí</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                {filteredArticles.map((article) => (
                  <Card
                    key={article.id}
                    className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-transform hover:-translate-y-1"
                  >
                    <div className="relative h-48 group">
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
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded-lg text-xs">
                          {article.images.length}
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="text-xl font-semibold text-[#1B3A4B] mb-2">{article.name}</h3>
                      <p className="text-[#8A8B6C] text-sm mb-3 line-clamp-3">
                        {article.description}
                      </p>

                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          {role === 'admin' && token && (
                            <>
                              <button
                                onClick={() => navigate(`/editar/${article.id}`)}
                                className="text-[#8A8B6C] hover:text-[#1B3A4B] transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(article.id)}
                                className="text-[#C68B59] hover:text-[#1B3A4B] transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>

                        {token && (
                          <div className="flex items-center">
                            <button
                              onClick={() => handleLike(article.id)}
                              className={likes[article.id] ? "text-[#C68B59]" : "text-[#8A8B6C]"}
                            >
                              <Heart className="w-4 h-4 fill-current" />
                            </button>
                            <span className="ml-2 text-sm text-[#8A8B6C]">{likes[article.id] || 0}</span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => {/* Implementar navegación */}}
                        className="text-[#1B3A4B] text-sm font-medium hover:text-[#C68B59] transition-colors mt-4 inline-block"
                      >
                        Leer más...
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {role === 'admin' && token && (
          <button
            onClick={() => setShowCreate(true)}
            className="fixed bottom-6 right-6 bg-[#1B3A4B] hover:bg-[#8A8B6C] text-white p-3 rounded-full shadow-lg transition-colors"
          >
            <PlusCircle className="w-6 h-6" />
          </button>
        )}

        {showCreate && role === 'admin' && token && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Crear nueva publicación</h3>
              {/* Aquí iría el formulario de creación */}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowCreate(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {/* Implementar creación */}}
                  className="px-4 py-2 bg-[#1B3A4B] text-white rounded-lg hover:bg-[#8A8B6C] transition-colors"
                >
                  Crear
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Blog;




























