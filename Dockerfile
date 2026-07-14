#Fase de compilación
FROM node:22 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build --configuration production

#Fase de nginx
FROM nginx:alpine

COPY --from=build /app/dist/Demo-IraCar/browser /usr/share/nginx/html

EXPOSE 80