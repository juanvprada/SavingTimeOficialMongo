# Etapa final: Producción
FROM node:18-alpine
WORKDIR /app

# Copia el backend compilado
COPY --from=builder /app/dist ./dist
COPY server-backend/package*.json ./
RUN npm install --only=production

# Copia el frontend construido
COPY --from=client /app/client/build ./public

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

# Iniciar el backend directamente
CMD ["node", "dist/app.js"]
