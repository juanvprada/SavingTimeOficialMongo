# Usar Node.js como base
FROM node:18

# Directorio de trabajo
WORKDIR /app

# Copiar package.json e instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del código
COPY . .

# Compilar TypeScript
RUN npm run build

# Exponer el puerto 5000 para el backend
EXPOSE 5000

# Ejecutar el backend
CMD ["node", "dist/app.js"]

