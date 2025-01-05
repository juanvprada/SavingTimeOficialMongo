# Etapa de construcción del cliente
FROM node:18-alpine as client
WORKDIR /app/client
COPY client-frontend/package*.json ./
RUN npm install
COPY client-frontend/ .
# Configurar la URL del backend para producción
ENV VITE_API_URL=http://localhost:5000
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

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["node", "dist/app.js"]