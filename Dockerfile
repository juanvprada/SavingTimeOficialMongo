# Etapa de construcción del frontend
FROM node:18-alpine as client
WORKDIR /app/client
COPY client-frontend/package*.json ./
RUN npm install
COPY client-frontend/ .
RUN npm run build

# Etapa de construcción del backend
FROM node:18-alpine as builder
WORKDIR /app
COPY server-backend/package*.json ./
RUN npm install
COPY server-backend/ .
RUN npm run build

# Etapa final: Producción
FROM node:18-alpine
WORKDIR /app

# Copiar el backend compilado
COPY --from=builder /app/dist ./dist

# Copiar package.json del backend
COPY server-backend/package*.json ./

# Instalar dependencias de producción
RUN npm install --only=production

# Copiar el frontend construido a la carpeta public
COPY --from=client /app/client/build ./public

# Configuración del entorno
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

# Iniciar la aplicación
CMD ["node", "dist/app.js"]


