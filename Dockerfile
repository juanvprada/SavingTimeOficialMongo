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
# Construir el proyecto TypeScript
RUN npm run build

# Etapa de producción
FROM node:18-alpine
WORKDIR /app
# Copiar package.json y package-lock.json
COPY server-backend/package*.json ./
# Instalar SOLO dependencias de producción
RUN npm install --only=production
# Copiar los archivos compilados
COPY --from=builder /app/dist ./dist
# Copiar los archivos estáticos del cliente (corregido para CRA)
COPY --from=client /app/client/build ./public

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# Especificar el comando de inicio
CMD ["node", "./dist/src/app.js"]