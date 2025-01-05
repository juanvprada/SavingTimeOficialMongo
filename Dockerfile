# Etapa de construcción del cliente
FROM node:18-alpine as client
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ .
# Etapa de construcción del cliente
FROM node:18-alpine as client
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ .
RUN npm run build

# Etapa de construcción del servidor
FROM node:18-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm install
COPY server/ .
COPY --from=client /app/client/dist ./public

ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start"]