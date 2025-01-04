# Usa Node.js 18 como base
FROM node:18

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json e instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del código
COPY . .

# Compilar TypeScript (si aplica)
RUN npm run build

# Exponer puerto del backend
EXPOSE 5000

# Ejecutar backend
CMD ["node", "dist/app.js"]

