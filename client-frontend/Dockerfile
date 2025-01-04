# Usa Node.js 18 como base
FROM node:18

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json e instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Construir el frontend
RUN npm run build

# Exponer puerto para servir frontend
EXPOSE 3000

# Servir el frontend usando 'serve' o modo preview
CMD ["npx", "serve", "-s", "build"]




