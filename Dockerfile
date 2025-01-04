# Etapa 1: Construcción del Frontend
FROM node:18 AS frontend

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build


# Etapa 2: Construcción del Backend
FROM node:18 AS backend

WORKDIR /app
COPY server/package*.json ./
COPY server/tsconfig.json ./
RUN npm install

COPY server/src ./src
RUN npm run build


# Etapa 3: Servir con Node.js
FROM node:18

WORKDIR /app

# Copiar el backend compilado
COPY --from=backend /app/dist ./dist
COPY server/package*.json ./
RUN npm install --production

# Copiar el frontend compilado
COPY --from=frontend /app/frontend/build ./frontend/build

# Servir el frontend y redireccionar APIs al backend
CMD ["node", "dist/app.js"]

