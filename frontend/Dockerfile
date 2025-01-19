# Stage 1: Build React app
FROM node:20-alpine as build
WORKDIR /app
COPY my_app/package.json my_app/package-lock.json ./
RUN npm install
COPY my_app/ ./
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
