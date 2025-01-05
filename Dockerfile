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
# Verificar la estructura después del build
RUN ls -la dist && ls -la dist/src

# Etapa de producción
FROM node:18-alpine
WORKDIR /app
COPY server-backend/package*.json ./
RUN npm install --only=production
COPY --from=builder /app/dist ./dist
COPY --from=client /app/client/build ./public

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Ajustar el comando para usar la ruta correcta basada en tu tsconfig.json
CMD ["node", "dist/src/app.js"]