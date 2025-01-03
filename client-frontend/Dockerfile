# Usar Node.js como base
FROM node:18

# Directorio de trabajo
WORKDIR /app

# Copiar package.json desde client-frontend/
COPY client-frontend/package*.json ./
RUN npm install

# Copiar el resto del código fuente desde client-frontend/
COPY client-frontend/ ./

# Construir el frontend
RUN npm run build

# Exponer el puerto 3000
EXPOSE 3000

# Iniciar el servidor de desarrollo
CMD ["npm", "start"]



