# Stage 1: Build the React app
FROM node:20-alpine as build

WORKDIR /app

# Copy the package.json and package-lock.json from the my_app folder to the container
COPY my_app/package.json my_app/package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app's code from the my_app folder
COPY my_app/ ./

# Build the React app
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

# Copy the build folder from the previous stage to the Nginx folder
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 for Nginx
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
