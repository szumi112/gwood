FROM node:18 as build-stage

WORKDIR /app

COPY package*.json ./

COPY . .

RUN npm install --legacy-peer-deps

RUN npm run build

FROM nginx:latest

WORKDIR /app

RUN rm /etc/nginx/conf.d/default.conf

COPY .docker/nginx/nginx.conf /etc/nginx/conf.d/

COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 3400

ENTRYPOINT ["nginx", "-g", "daemon off;"]
