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

const Blog = () => {
  const [filters, setFilters] = useState({});
  const [articles, setArticles] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [likes, setLikes] = useState({});
  const [loading, setLoading] = useState(true);
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
      <header className="bg-[#1B3A4B] text-[#F5F2ED] py-8">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold md:hidden">Saving Time</h1>
          <h1 className="text-4xl font-bold hidden md:block">Bienvenidos a Saving Time</h1>
          <p className="mt-4 text-xl text-[#E3D5C7]">Saber a dónde volver</p>
        </div>
      </header>

      <h2 className="text-2xl md:text-3xl font-semibold text-center text-[#1B3A4B] mt-4">
        Todas las publicaciones
      </h2>

      <section className="container mx-auto py-12 px-4">
        <Search
          onSearch={setFilters}
          postTypes={Object.values(PostType)}
        />

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1B3A4B]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-transform transform hover:-translate-y-1"
              >
                <div className="relative h-52 group">
                  <img
                    src={getFirstImage(article)}
                    alt={article.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = getFirstImage({ images: [] }); // Esto llamará al caso por defecto de getFirstImage
                    }}
                  />
                  {article.images && article.images.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded-lg text-sm">
                      <i className="fas fa-images mr-1"></i>
                      {article.images.length}
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-[#1B3A4B] mb-3">{article.name}</h3>
                  <p className="text-[#8A8B6C] mb-4 line-clamp-4 leading-relaxed">
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
                    className="text-[#1B3A4B] font-medium hover:text-[#C68B59] transition-colors mt-6 inline-block"
                  >
                    Leer más...
                  </Link>
                </div>
              </div>
            ))}
          </div>
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
            className="fixed bottom-8 right-8 bg-[#1B3A4B] hover:bg-[#8A8B6C] text-white p-4 rounded-full shadow-lg transition-colors"
          />
        )}
      </section>
    </div>
  );
};

export default Blog;




























