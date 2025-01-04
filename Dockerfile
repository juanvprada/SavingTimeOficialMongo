# Etapa 1: Construcción del frontend
FROM node:18 AS frontend
WORKDIR /app/client-frontend
COPY client-frontend/ ./
RUN npm install && npm run build

# Etapa 2: Construcción del backend
FROM node:18 AS backend
WORKDIR /app/server-backend
COPY server-backend/ ./
RUN npm install && npm run build

# Etapa final: Copiar y ejecutar
FROM node:18
WORKDIR /app

# Copiar backend y frontend (ajustado para `build` en lugar de `dist`)
COPY --from=backend /app/server-backend/dist ./dist
COPY --from=frontend /app/client-frontend/build ./frontend

EXPOSE 8080

# Ejecutar backend
CMD ["node", "dist/app.js"]



