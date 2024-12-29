import React, { useState } from "react";
import ContactForm from "../components/ContactForm";

const GetInTouch = () => {
  const [submittedMessages, setSubmittedMessages] = useState([]);

  return (
    <div className="min-h-screen bg-[#F5F2ED] py-6 sm:py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1B3A4B] text-center mb-6 sm:mb-8">
          Contáctanos
        </h1>
        <div className="max-w-lg sm:max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <ContactForm
            submittedMessages={submittedMessages}
            setSubmittedMessages={setSubmittedMessages}
          />
        </div>
      </div>
    </div>
  );
};

export default GetInTouch;

