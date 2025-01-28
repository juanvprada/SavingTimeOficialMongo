const express = require('express');
const path = require('path');
const app = express();

// Sirve los archivos estáticos del frontend
app.use(express.static(path.join(__dirname, 'client-frontend/dist')));

// Importa la aplicación backend
require('./server-backend/dist/app');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});