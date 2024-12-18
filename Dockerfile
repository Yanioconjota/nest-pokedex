# Instalar dependencias solo cuando sea necesario
FROM node:21-alpine3.18 AS deps
# Consulta https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine 
# para entender por qué podría ser necesario libc6-compat.

# Instala libc6-compat para garantizar compatibilidad con aplicaciones o librerías que dependen de glibc.
# Evita el almacenamiento de caché innecesario, lo que mantiene la imagen ligera.
# Es especialmente útil cuando se utilizan imágenes basadas en Alpine Linux, como node:18-alpine3.15.
# Básicamente, la imagen deps instala las dependencias necesarias asegurándose de reinstalar únicamente las dependencias que cambiaron.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Construir la aplicación reutilizando las dependencias en caché
FROM node:21-alpine3.18 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

# Imagen de producción, copia todos los archivos y ejecuta la aplicación
FROM node:21-alpine3.18 AS runner

# Establecer el directorio de trabajo
WORKDIR /usr/src/app

# Copiar archivos de configuración de dependencias
COPY package.json yarn.lock ./

# Instalar solo las dependencias necesarias para producción
RUN yarn install --prod

# Copiar los archivos compilados desde la etapa de construcción
COPY --from=builder /app/dist ./dist

# # Crear el directorio y su contenido
# RUN mkdir -p ./pokedex

# # Copiar los archivos compilados y la configuración de entorno
# COPY --from=builder ./app/dist/ ./app
# COPY ./.env ./app/.env

# # Dar permisos para ejecutar la aplicación
# RUN adduser --disabled-password pokeuser
# RUN chown -R pokeuser:pokeuser ./pokedex
# USER pokeuser

# # Exponer el puerto 3000
# EXPOSE 3000

# Comando por defecto para ejecutar la aplicación
CMD [ "node","dist/main" ]
