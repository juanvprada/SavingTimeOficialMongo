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

# Etapa final: producción
FROM node:18-alpine
WORKDIR /app

# Copiar el backend y frontend desde las etapas anteriores
COPY --from=builder /app/dist ./dist
COPY --from=client /app/client/build ./public

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["node", "dist/app.js"]

