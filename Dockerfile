# Etapa de construcción del cliente
FROM node:18-alpine as client
WORKDIR /app/client
COPY client-frontend/package*.json ./
RUN npm install
COPY client-frontend/ .
RUN npm run build

# Etapa de construcción del servidor
FROM node:18-alpine
WORKDIR /app
COPY server-backend/package*.json ./
RUN npm install
COPY server-backend/ .
COPY --from=client /app/client/dist ./public

ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start"]