# Etapa de construcción del cliente
FROM node:18-alpine as client
WORKDIR /app/client
COPY client-frontend/package*.json ./
RUN npm install
COPY client-frontend/ .
RUN npm run build

# Etapa de construcción del servidor
FROM node:18-alpine as builder
WORKDIR /app
COPY server-backend/package*.json ./
RUN npm install
COPY server-backend/ .
RUN npm run build

# Etapa de producción
FROM node:18-alpine
WORKDIR /app
COPY server-backend/package*.json ./
RUN npm install --only=production
COPY --from=builder /app/dist ./dist
COPY --from=client /app/client/build ./public

# Variables de entorno necesarias
ENV NODE_ENV=production
ENV PORT=3000

# Verificar la estructura de archivos
RUN ls -la && \
    ls -la dist/src && \
    echo "Current working directory: $PWD"

EXPOSE 3000

# Comando específico para iniciar la aplicación
CMD ["node", "dist/src/app.js"]