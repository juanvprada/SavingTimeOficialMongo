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

# Copiar archivos necesarios
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=client /app/client/build ./public

# Instalar solo dependencias de producción
RUN npm ci --only=production

# Configuración del entorno
ENV NODE_ENV=production
ENV PORT=5000

# Crear usuario no root para más seguridad
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

EXPOSE 5000

# Iniciar la aplicación
CMD ["node", "dist/app.js"]



