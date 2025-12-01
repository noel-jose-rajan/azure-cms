# Use an official Node.js runtime as the base image
FROM node:20-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to the working directory
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the Vite app
RUN yarn build

# Use an Nginx image to serve the production build
FROM nginx:1.23-alpine

# Copy the built files to the nginx HTML directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy a custom nginx configuration file (optional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port Nginx will run on
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
