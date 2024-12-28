import React, { useState } from "react";
import ContactForm from "../components/ContactForm"; // Ajusta la ruta según tu estructura de carpetas

const GetInTouch = () => {
  const [submittedMessages, setSubmittedMessages] = useState([]);

  return (
    <div className=" min-h-screen">
      <ContactForm
        submittedMessages={submittedMessages}
        setSubmittedMessages={setSubmittedMessages}
      />
    </div>
  );
};

export default GetInTouch;
