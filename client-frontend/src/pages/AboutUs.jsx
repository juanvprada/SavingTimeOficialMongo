import React, { useState, useEffect } from 'react';
import Carousel from '../components/Carousel';
import { logoImg } from '../utils';
import axios from 'axios';
import { API_CONFIG } from '../api.config'; // Importar la configuración API

const AboutUs = () => {
  // Estado para almacenar las estadísticas
  const [stats, setStats] = useState({
    placesCount: 0,
    usersCount: 0,
    countriesCount: 0,
    loading: true
  });

  // Obtener las estadísticas cuando el componente se monte
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        // Usar la baseUrl de la configuración
        const baseUrl = API_CONFIG.getBaseUrl();
        const apiUrl = `${baseUrl}/api/statistics`;

        console.log('Fetching statistics from:', apiUrl);

        const response = await axios.get(apiUrl);
        console.log('Statistics response:', response.data);

        if (response.data) {
          setStats({
            placesCount: response.data.placesCount || 0,
            usersCount: response.data.usersCount || 0,
            countriesCount: response.data.countriesCount || 0,
            loading: false
          });
        } else {
          throw new Error('No se recibieron datos de estadísticas');
        }
      } catch (error) {
        console.error('Error al obtener estadísticas:', error);

        // Depuración detallada del error
        if (error.response) {
          console.error('Error response:', error.response.data);
          console.error('Status:', error.response.status);
        } else if (error.request) {
          console.error('No response received:', error.request);
        }

        // Intentar obtener estadísticas alternativas desde la API de posts
        try {
          const baseUrl = API_CONFIG.getBaseUrl();
          const postsResponse = await axios.get(`${baseUrl}/api/posts`);

          if (postsResponse.data && postsResponse.data.data && Array.isArray(postsResponse.data.data)) {
            const posts = postsResponse.data.data;

            // Usar Set para obtener valores únicos
            const uniqueCities = new Set(posts.map(post => post.city).filter(Boolean));
            const uniqueUsers = new Set(posts.map(post => {
              if (typeof post.userId === 'object') {
                return post.userId._id || post.userId.id;
              }
              return post.userId;
            }).filter(Boolean));

            setStats({
              placesCount: posts.length,
              usersCount: uniqueUsers.size,
              countriesCount: uniqueCities.size,
              loading: false
            });
          } else {
            // Valores de respaldo
            setStats({
              placesCount: 25,
              usersCount: 10,
              countriesCount: 5,
              loading: false
            });
          }
        } catch (postsError) {
          console.error('Error al obtener datos alternativos:', postsError);

          // Valores de respaldo
          setStats({
            placesCount: 25,
            usersCount: 10,
            countriesCount: 5,
            loading: false
          });
        }
      }
    };

    fetchStatistics();
  }, []);

  // Componente de contador animado
  const Counter = ({ end, duration = 2000 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (end === 0) return; // No animar si el valor es 0

      let startTime = null;
      let requestId = null;

      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const runtime = timestamp - startTime;
        const progress = Math.min(runtime / duration, 1);

        // Función ease-out para movimiento más natural
        const easeOut = (t) => 1 - Math.pow(1 - t, 3);

        setCount(Math.floor(easeOut(progress) * end));

        if (runtime < duration) {
          requestId = requestAnimationFrame(animate);
        }
      };

      requestId = requestAnimationFrame(animate);

      return () => {
        if (requestId) {
          cancelAnimationFrame(requestId);
        }
      };
    }, [end]);

    return <>{count}+</>;
  };

  return (
    <div className="bg-[#F5F2ED] text-[#1B3A4B] min-h-screen">
      {/* Header con gradiente y tipografía elegante */}
      <header className="bg-gradient-to-r from-[#1B3A4B] to-[#2D4C5E] py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#F5F2ED] mb-2 font-playfair tracking-wide">
            El arte de saber a dónde volver
          </h1>
          <p className="text-[#E3D5C7] mt-4 text-base md:text-lg font-montserrat italic max-w-2xl mx-auto">
            Descubre y comparte experiencias únicas que merecen ser revividas
          </p>
        </div>
      </header>

      {/* Historia y Misión con diseño mejorado */}
      <section className="container mx-auto py-10 md:py-16 px-4 md:px-8">
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#E3D5C7]/20 to-transparent rounded-full transform -translate-y-1/2 scale-150 opacity-30 blur-3xl"></div>
          <div className="relative z-10 flex flex-col items-center justify-center">
            <img
              src={logoImg}
              className="w-40 md:w-60 mb-8 transform transition duration-500 ease-in-out hover:scale-110 drop-shadow-xl"
              alt="Logo Saving Time"
            />
            <h2 className="text-3xl md:text-4xl font-bold text-[#1B3A4B] font-playfair"></h2>
            <p className="mt-6 text-base md:text-lg text-[#8A8B6C] font-montserrat max-w-2xl mx-auto leading-relaxed">
              En Saving Time, creemos que los mejores viajes están llenos de descubrimientos auténticos que merecen ser compartidos
            </p>
          </div>
        </div>

        {/* Añade una sección visualmente atractiva con decoración */}
        <div className="relative py-8 md:py-12 px-4 md:px-8 my-12 rounded-xl bg-white/70 backdrop-blur-sm shadow-md">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#C68B59]/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#8A8B6C]/10 rounded-full translate-y-1/3 -translate-x-1/3"></div>

          <h2 className="text-2xl md:text-3xl font-bold text-[#1B3A4B] mb-6 font-playfair relative">
            <span className="relative">
              Nuestra Misión
              <span className="absolute -bottom-2 left-0 w-16 h-1 bg-[#C68B59]"></span>
            </span>
          </h2>

          <p className="font-montserrat text-[#8A8B6C] leading-relaxed mb-4">
            Conectamos viajeros con los lugares más auténticos que merecen ser revisitados, creando una comunidad
            que celebra y preserva las joyas ocultas de cada destino.
          </p>

          <p className="font-montserrat text-[#8A8B6C] leading-relaxed">
            Nuestro objetivo es asegurar que cada experiencia de viaje esté llena de autenticidad,
            descubrimientos memorables y momentos que inviten a volver.
          </p>
        </div>
      </section>

      {/* Nuestro Equipo con diseño mejorado y responsive */}
      <section className="bg-gradient-to-b from-[#E3D5C7]/50 to-[#E3D5C7]/80 py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1B3A4B] text-center mb-8 md:mb-12 font-playfair">
            <span className="relative inline-block">
              Conoce a Nuestro Equipo
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-[#C68B59]"></span>
            </span>
          </h2>

          {/* Grid modificado para centrar a Juan en todas las pantallas */}
          <div className="flex justify-center items-center max-w-5xl mx-auto">
            {/* Juan - Product Owner */}
            <div className="w-full max-w-xs flex flex-col items-center bg-gradient-to-br from-green-50 via-white to-green-50 shadow-lg rounded-xl overflow-hidden transform hover:-translate-y-1 hover:shadow-xl transition duration-300 ease-in-out">
              <div className="relative w-full pt-[100%] overflow-hidden bg-gradient-to-b from-[#1B3A4B]/20 to-[#2D4C5E]/30">
                {/* Reemplazar la imagen con un avatar con iniciales */}
                <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1B3A4B]/10 to-[#C68B59]/10">
                  <div className="w-24 h-24 rounded-full bg-[#1B3A4B] flex items-center justify-center text-white text-4xl font-playfair">
                    J
                  </div>
                </div>
                {/* Elementos decorativos */}
                <div className="absolute top-1/3 left-1/4 w-8 h-8 rounded-full bg-[#C68B59]/20"></div>
                <div className="absolute bottom-1/3 right-1/4 w-12 h-12 rounded-full bg-[#8A8B6C]/20"></div>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-[#1B3A4B] font-playfair">Juan</h3>
                <p className="text-[#8A8B6C] mt-1 text-sm font-medium">Product Owner & Full Stack Developer</p>
                <div className="w-12 h-1 bg-green-500 mx-auto my-3 rounded-full"></div>
                <p className="mt-2 text-sm text-[#8A8B6C] font-montserrat">Desarrolla, define la visión del producto y prioriza las funcionalidades.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Mejorado con elementos decorativos */}
      <section className="relative bg-gradient-to-r from-[#1B3A4B] to-[#2D4C5E] py-12 md:py-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

        <div className="container mx-auto px-4 md:px-8 text-center relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white font-playfair mb-4">
            Únete a Nosotros
          </h2>
          <p className="text-[#E3D5C7] mt-2 text-base md:text-lg font-montserrat max-w-xl mx-auto">
            Comparte esos lugares a los que merece la pena volver y ayuda a otros viajeros a descubrir experiencias auténticas
          </p>
          <a
            href="/contacto"
            className="mt-8 inline-block bg-white text-[#1B3A4B] font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-300 hover:bg-[#E3D5C7] hover:text-[#1B3A4B] transform hover:-translate-y-1"
          >
            Contáctanos
          </a>
        </div>
      </section>

      {/* Testimonios o estadísticas - Nueva sección con datos reales */}
      <section className="bg-white py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1B3A4B] text-center mb-8 font-playfair">
            <span className="relative inline-block">
              Lo Que Logramos
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-[#C68B59]"></span>
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-[#F5F2ED] rounded-lg shadow-sm hover:shadow-md transition-shadow">
              {stats.loading ? (
                <div className="animate-pulse">
                  <div className="h-10 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
                  <p className="text-[#8A8B6C] font-montserrat">Lugares compartidos</p>
                </div>
              ) : (
                <>
                  <span className="block text-3xl md:text-4xl font-bold text-[#C68B59] mb-2">
                    <Counter end={stats.placesCount} />
                  </span>
                  <p className="text-[#8A8B6C] font-montserrat">Lugares compartidos</p>
                </>
              )}
            </div>

            <div className="text-center p-6 bg-[#F5F2ED] rounded-lg shadow-sm hover:shadow-md transition-shadow">
              {stats.loading ? (
                <div className="animate-pulse">
                  <div className="h-10 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
                  <p className="text-[#8A8B6C] font-montserrat">Usuarios activos</p>
                </div>
              ) : (
                <>
                  <span className="block text-3xl md:text-4xl font-bold text-[#C68B59] mb-2">
                    <Counter end={stats.usersCount} />
                  </span>
                  <p className="text-[#8A8B6C] font-montserrat">Usuarios activos</p>
                </>
              )}
            </div>

            <div className="text-center p-6 bg-[#F5F2ED] rounded-lg shadow-sm hover:shadow-md transition-shadow">
              {stats.loading ? (
                <div className="animate-pulse">
                  <div className="h-10 bg-gray-200 rounded w-16 mx-auto mb-2"></div>
                  <p className="text-[#8A8B6C] font-montserrat">Ciudades exploradas</p>
                </div>
              ) : (
                <>
                  <span className="block text-3xl md:text-4xl font-bold text-[#C68B59] mb-2">
                    <Counter end={stats.countriesCount} />
                  </span>
                  <p className="text-[#8A8B6C] font-montserrat">Ciudades exploradas</p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;