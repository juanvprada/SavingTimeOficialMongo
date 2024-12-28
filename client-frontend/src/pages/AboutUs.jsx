import React from 'react';
import Carousel from '../components/Carousel';
import { logoImg } from '../utils';


const AboutUs = () => {
  return (
    <div className="bg-gradient-to-br from-green-100 via-orange-50 text-gray-900 ">

   
      {/* Header */}
      <header className="bg-green-600 py-6">
        <div className="container mx-auto px-4 text-center ">
        <h2 className="text-3xl font-bold text-white mb-2">Alimentación Consciente para un Futuro Sostenible</h2>
          <p className="text-green-100 mt-4 text-lg">En Sustainify, creemos que cada decisión que tomamos sobre lo que comemos tiene un impacto
            directo en nuestro planeta. Nuestro objetivo es ayudarte a hacer elecciones alimentarias más sostenibles, sin sacrificar el sabor ni la calidad.
            A través de nuestras guías, recetas y consejos, te mostramos cómo adoptar un enfoque más consciente al alimentarte, apoyando a los agricultores
            locales, reduciendo el desperdicio y minimizando tu huella ambiental.</p>
        </div>
      </header>

      {/* Historia y Misión */}
      <section className="container mx-auto py-16 px-4">
        <div className="text-center mb-12 relative">

          <div className="relative z-10 flex flex-col items-center justify-center">
          <img src={logoImg} className="w-60 mb-8 transform transition duration-500 ease-in-out hover:scale-110" alt="Logo Bio Blog" />
            <h2 className="text-3xl font-bold text-green-800">Nuestra Historia y Misión</h2>
            <p className="mt-6 text-lg text-gray-600">
              Desde nuestro inicio, hemos estado comprometidos con un solo objetivo: ayudar a las personas a alimentarse
              de manera sostenible. Sabemos que las pequeñas acciones pueden generar grandes cambios, por lo que nos esforzamos
              por facilitar la adopción de prácticas alimentarias que respeten el medio ambiente. Nuestra misión es guiarte a
              través de este viaje, enseñándote a tomar decisiones que beneficien tanto a tu salud como al planeta. Desde recetas
              basadas en productos de temporada hasta consejos prácticos sobre cómo reducir el desperdicio de alimentos, queremos
              que todos encuentren la inspiración para vivir de manera más consciente.
            </p>
           
          </div>
        </div>
      </section>

      {/* Nuestro Equipo */}
      <section className="bg-green-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-green-800 text-center mb-12">Conoce a Nuestro Equipo</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">

            {/* Omar - Scrum Master */}
            <div className=" bg-gradient-to-br from-green-100 via-orange-50 to-green-100 shadow-lg rounded-lg overflow-hidden transform hover:scale-105  hover:shadow-2xl transition duration-500 ease-in-out">
              <img src="/src/assets/about-img/provisional.png" alt="Omar" className="w-full h-42 object-cover transition duration-500 grayscale hover:grayscale-0" />
              <div className="p-4 text-center">
                <h3 className="text-xl font-semibold text-green-700">Omar</h3>
                <p className="text-gray-500 mt-2 text-sm">Scrum Master</p>
                <p className="mt-2 text-xs text-gray-600">Lidera el equipo con la metodología Scrum para cumplir con los objetivos.</p>
              </div>
            </div>

            {/* Juan - Product Owner */}
            <div className=" bg-gradient-to-br from-green-100 via-orange-50 to-green-100 shadow-lg rounded-lg overflow-hidden transform hover:scale-105 hover:shadow-2xl transition duration-500 ease-in-out">
              <img src="/src/assets/about-img/provisional.png" alt="Juan" className="w-full h-42 object-cover transition duration-500 grayscale hover:grayscale-0" />
              <div className="p-4 text-center">
                <h3 className="text-xl font-semibold text-green-700">Juan</h3>
                <p className="text-gray-500 mt-2 text-sm">Product Owner</p>
                <p className="mt-2 text-xs text-gray-600">Define la visión del producto y prioriza las funcionalidades.</p>
              </div>
            </div>

            {/* Mariela - Desarrolladora Web Fullstack */}
            <div className=" bg-gradient-to-br from-green-100 via-orange-50 to-green-100 shadow-lg rounded-lg overflow-hidden transform hover:scale-105 hover:shadow-2xl transition duration-500 ease-in-out">
              <img src="/src/assets/about-img/provisional2.png" alt="Mariela" className="w-full h-42 object-cover transition duration-500 grayscale hover:grayscale-0" />
              <div className="p-4 text-center">
                <h3 className="text-xl font-semibold text-green-700">Mariela</h3>
                <p className="text-gray-500 mt-2 text-sm">Desarrolladora Web Fullstack</p>
                <p className="mt-2 text-xs text-gray-600">Aporta en el desarrollo web para garantizar calidad y escalabilidad.</p>
              </div>
            </div>

            {/* Darío - Desarrollador Web Fullstack */}
            <div className=" bg-gradient-to-br from-green-100 via-orange-50 to-green-100 shadow-lg rounded-lg overflow-hidden transform hover:scale-105 hover:shadow-2xl transition duration-500 ease-in-out">
              <img src="/src/assets/about-img/provisional.png" alt="Darío" className="w-full h-42 object-cover transition duration-500 grayscale hover:grayscale-0" />
              <div className="p-4 text-center">
                <h3 className="text-xl font-semibold text-green-700">Darío</h3>
                <p className="text-gray-500 mt-2 text-sm">Desarrollador Web Fullstack</p>
                <p className="mt-2 text-xs text-gray-600">Contribuye tanto en frontend como en backend.</p>
              </div>
            </div>

            {/* Sara - Desarrolladora Web Fullstack */}
            <div className=" from bg-gradient-to-br from-green-100 via-orange-50 to-green-100 shadow-lg rounded-lg overflow-hidden transform hover:scale-105 hover:shadow-2xl transition duration-500 ease-in-out">
              <img src="/src/assets/about-img/provisional2.png" alt="Sara" className="w-full h-42 object-cover transition duration-500 grayscale hover:grayscale-0" />
              <div className="p-4 text-center">
                <h3 className="text-xl font-semibold text-green-700">Sara</h3>
                <p className="text-gray-500 mt-2 text-sm">Desarrolladora Web Fullstack</p>
                <p className="mt-2 text-xs text-gray-600">Optimiza el frontend y el diseño del proyecto.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valores y Sostenibilidad */}
      <section className="bg-green-50 py-16">
  <div className="container mx-auto px-4 text-center">
    <h2 className="text-3xl font-bold text-green-800 mb-12">Nuestros Valores</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {[
        {
          title: "Sostenibilidad Alimentaria",
          text: "En Bio Blog, promovemos el uso de productos locales, de temporada y orgánicos. Creemos en una alimentación que no solo sea saludable para el cuerpo, sino también para el planeta. Cada receta y consejo que compartimos está diseñado para minimizar el impacto ambiental y maximizar el valor nutricional."
        },
        {
          title: "Compromiso con la Comunidad",
          text: "Apoyar a los pequeños agricultores y los mercados locales es parte fundamental de nuestra misión. Fomentamos la compra de productos que no solo sean frescos y saludables, sino que también ayuden a fortalecer las economías locales y promuevan prácticas agrícolas sostenibles."
        },
        {
          title: "Reducción del Desperdicio de Alimentos",
          text: "Creemos que cada pedazo de comida puede ser aprovechado. A través de nuestros consejos y recetas, te mostramos cómo prolongar la vida útil de los alimentos, reutilizar las sobras y evitar el desperdicio, todo mientras sigues disfrutando de platos deliciosos."
        },
        {
          title: "Consumo Consciente",
          text: "Comprar de manera responsable es una de las acciones más poderosas que podemos tomar. En Sustainify, te ayudamos a elegir productos que respeten los ciclos naturales de la agricultura y apoyen a quienes practican una producción ética y justa. Desde evitar plásticos innecesarios hasta seleccionar productos de comercio justo, promovemos un consumo que prioriza el bienestar colectivo."
        }
      ].map((value, idx) => (
        <div key={idx} className="text-left transform transition duration-300 hover:scale-105">
          <h3 className="text-2xl font-bold text-green-700">{value.title}</h3>
          <p className="mt-4 text-gray-600">{value.text}</p>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* CTA */}
      <section className="bg-green-700 py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white animate-pulse">Únete a Nosotros</h2>
          <p className="text-green-200 mt-4 text-lg">Queremos que seas parte de esta revolución alimentaria sostenible. Descubre más y empieza hoy.</p>
          <a href="/contacto" className="mt-6 inline-block bg-white text-green-700 font-semibold py-2 px-6 rounded-lg shadow-lg transition duration-300 hover:bg-gray-200">
            Contáctanos
          </a>
        </div>
      </section>

    </div>
  );
};

export default AboutUs;
