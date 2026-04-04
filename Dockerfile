FROM node:18-alpine AS build
WORKDIR /app
# Copy package files first to leverage caching
COPY package*.json ./
# Install dependencies
RUN npm install
# Copy entire project
COPY . .
# Build Vite production bundle
RUN npm run build
FROM nginx:alpine
# Copy build output to nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html
# Expose port 80
EXPOSE 80
# Nginx serves index.html by default
CMD ["nginx", "-g", "daemon off;"]