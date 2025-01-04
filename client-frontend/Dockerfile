# Usar Node.js como base
FROM node:18

# Directorio de trabajo
WORKDIR /app

# Copiar package.json e instalar dependencias
COPY client-frontend/package*.json ./
RUN npm install

# Copiar el resto del código fuente (incluyendo public/ y src/)
COPY client-frontend/ ./

# Construcción del frontend
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]



