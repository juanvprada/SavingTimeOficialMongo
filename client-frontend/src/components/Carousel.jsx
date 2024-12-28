import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Carousel = () => {
  const carouselRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);

  const items = [
    {
      title: 'Alimentación más Saludable',
      image: '/src/assets/about-img/alimentacionsaludable.webp',
      description: 'Al consumir productos frescos, de temporada y locales, no solo mejoras tu salud, sino que también evitas los productos ultraprocesados. Comer de manera consciente te ayuda a nutrir tu cuerpo con lo mejor que la naturaleza ofrece en cada momento del año.',
      link: '/construccion'
    },
    {
      title: 'Ahorro Económico',
      image: '/src/assets/about-img/mejoreconomia.webp',
      description: 'Aprovechar al máximo cada ingrediente y reducir el desperdicio de alimentos te permite optimizar tus compras y ahorrar dinero. Además, al apoyar a los productores locales, ayudas a fomentar precios justos, manteniendo el equilibrio entre calidad y economía.',
      link: '/construccion'
    },
    {
      title: 'Reducción del Impacto Ambiental',
      image: '/src/assets/about-img/reduccionimpacto.webp',
      description: 'Al optar por productos locales y de temporada, reduces la huella de carbono asociada con el transporte de alimentos y el uso de plásticos. Cada elección que haces contribuye a un planeta más limpio y saludable para las futuras generaciones.',
      link: '/construccion'
    },
    {
      title: 'Fortalecimiento de la Comunidad',
      image: '/src/assets/about-img/comunidad.jpg',
      description: 'Al comprar en mercados locales, creas un vínculo directo con los productores que trabajan para llevar productos frescos y de calidad a tu mesa. Fomentar estas relaciones ayuda a construir una comunidad más fuerte, donde cada compra es una inversión en el bienestar colectivo.',
      link: '/construccion'
    },
    {
      title: 'Innovación Responsable',
      image: '/src/assets/about-img/innovacion.webp',
      description: 'Apostamos por soluciones tecnológicas que minimicen el impacto ambiental, impulsando un progreso sostenible que beneficie tanto a las personas como al medio ambiente.',
      link: '/construccion'
    },
    {
      title: 'Bienestar y Salud',
      image: '/src/assets/about-img/salud.webp',
      description: 'Creemos que una alimentación consciente no solo es buena para el planeta, sino también para el bienestar físico y mental de las personas.',
      link: '/construccion'
    }
  ];

  const totalItems = items.length;

  // Inicializamos el scroll para que esté en el medio del carrusel al cargar
  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      const width = carousel.firstChild.offsetWidth;
      carousel.scrollLeft = width * totalItems; // Posicionamos el scroll en la mitad
    }
  }, [totalItems]);

  const handleScroll = (direction) => {
    if (!isScrolling) {
      setIsScrolling(true);
      const carousel = carouselRef.current;
      const width = carousel.firstChild.offsetWidth;
      if (direction === 'left') {
        carousel.scrollBy({ top: 0, left: -width, behavior: 'smooth' });
      } else {
        carousel.scrollBy({ top: 0, left: width, behavior: 'smooth' });
      }
      setTimeout(() => {
        const maxScrollLeft = width * totalItems;
        if (carousel.scrollLeft >= maxScrollLeft * 2) {
          carousel.scrollLeft = maxScrollLeft; // Reset al llegar al final
        } else if (carousel.scrollLeft <= 0) {
          carousel.scrollLeft = maxScrollLeft; // Reset al llegar al principio
        }
        setIsScrolling(false);
      }, 500); // Ajusta según el tiempo de desplazamiento
    }
  };

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-green-600 mb-12">Beneficios para el Usuario</h2>
        {/* Carousel container */}
        <div className="overflow-hidden relative">
          <div
            ref={carouselRef}
            className="flex space-x-4 overflow-hidden snap-x snap-mandatory scroll-smooth scrollbar-hide"
            aria-live="polite"
          >
            {/* Concatenamos el array por 6 para simular infinito */}
            {[...items, ...items, ...items, ...items, ...items, ...items].map((item, index) => (
              <div key={index} className="min-w-[250px] max-w-sm bg-white rounded-lg shadow-lg p-6 snap-start">
                <img src={item.image} alt={item.title} className="w-full h-36 object-cover rounded-lg mb-4" />
                <h3 className="text-2xl font-bold text-green-700 hover:underline">
                  <Link to={item.link}>{item.title}</Link>
                </h3>
                <p className="mt-4 text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
          {/* Carousel navigation */}
          <button
            onClick={() => handleScroll('left')}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-green-500 text-white rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-green-600 ml-2"
          >
            ‹
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-green-500 text-white rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-green-600 mr-2"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
};

export default Carousel;
