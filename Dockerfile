# Etapa 1: Construcción del Frontend
FROM node:18 AS frontend

WORKDIR /app/client-frontend
COPY client-frontend/package*.json ./
RUN npm install
COPY client-frontend/ ./
RUN npm run build

# Etapa 2: Construcción del Backend
FROM node:18 AS backend

WORKDIR /app/server-backend
COPY server-backend/package*.json ./
RUN npm install
COPY server-backend/ ./
RUN npm run build

# Etapa 3: Servir Backend y Frontend
FROM node:18

WORKDIR /app

# Copiar backend compilado
COPY --from=backend /app/server-backend/dist ./dist
COPY server-backend/package*.json ./
RUN npm install --production

# Copiar frontend construido
COPY --from=frontend /app/client-frontend/build ./frontend/build

EXPOSE 5000

# Iniciar el backend (Express sirve el frontend también)
CMD ["node", "dist/app.js"]


