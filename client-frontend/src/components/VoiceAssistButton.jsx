// VoiceAssistButton.jsx
import React from "react";
import { FaVolumeUp } from "react-icons/fa";

const VoiceAssistButton = ({ text }) => {
  const speakText = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("La síntesis de voz no es compatible con este navegador.");
    }
  };

  return (
    <button
      onClick={speakText}
      className="text-2xl cursor-pointer bg-[#1B3A4B] text-[#F5F2ED] rounded-full w-7 h-7 flex items-center justify-center transition-colors duration-300 hover:bg-[#C68B59] focus:outline-none focus:ring-2 focus:ring-[#8A8B6C] focus:ring-offset-2"
      title="Reproducir ayuda en voz"
      aria-label="Reproducir texto en voz alta"
    >
      <FaVolumeUp className="w-4 h-4" />
    </button>
  );
};

export default VoiceAssistButton;
