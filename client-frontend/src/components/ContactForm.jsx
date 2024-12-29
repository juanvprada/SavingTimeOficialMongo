import React, { useState } from "react";
import emailjs from "emailjs-com";
import VoiceAssistButton from "./VoiceAssistButton";

const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { name, email, message },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then((response) => {
        console.log("Correo enviado:", response.status, response.text);
        setShowModal(true);
        setName("");
        setEmail("");
        setMessage("");
      })
      .catch((error) => {
        console.error("Error al enviar el correo:", error.text);
        alert("Hubo un error al enviar el mensaje. Inténtalo de nuevo.");
      });
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="max-w-lg mx-auto p-4 sm:p-8 bg-white rounded-lg shadow-lg mt-10 sm:mt-20 mb-10 relative">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-[#1B3A4B] text-center">
        ¡Déjanos un mensaje en <span className="text-[#C68B59]">Saving</span>{" "}
        <span className="text-[#C68B59]">Time</span>!
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-[#1B3A4B]"
          >
            Nombre
          </label>
          <VoiceAssistButton text="Introduce tu nombre" />
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Introduce tu nombre"
            maxLength="50"
            className="mt-1 block w-full border border-[#8A8B6C] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#C68B59] shadow-sm"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-[#1B3A4B]"
          >
            Correo Electrónico
          </label>
          <VoiceAssistButton text="Introduce tu correo electrónico " />
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Introduce tu correo electrónico"
            className="mt-1 block w-full border border-[#8A8B6C] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#C68B59] shadow-sm"
          />
        </div>
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-semibold text-[#1B3A4B]"
          >
            Mensaje (máx. 100 caracteres)
          </label>
          <VoiceAssistButton text="Introduce tu mensaje " />
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength="100"
            required
            placeholder="Introduce tu mensaje aquí..."
            className="mt-1 block w-full border border-[#8A8B6C] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#C68B59] shadow-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#1B3A4B] text-white font-bold rounded-lg p-3 hover:bg-[#8A8B6C] transition-colors shadow-lg"
        >
          Enviar
        </button>
      </form>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#1B3A4B] bg-opacity-50 px-4">
          <div className="bg-white rounded-lg p-6 shadow-lg text-center w-full max-w-sm">
            <h3 className="text-lg font-semibold text-[#1B3A4B] mb-2">
              ¡Mensaje enviado!
            </h3>
            <VoiceAssistButton text="El mensaje ha sido enviado correctamente." />
            <p className="text-sm text-[#8A8B6C]">
              Te responderemos lo más pronto posible.
            </p>
            <button
              onClick={closeModal}
              className="mt-4 bg-[#C68B59] text-white p-2 rounded-lg hover:bg-[#8A8B6C] transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactForm;

