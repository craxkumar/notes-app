# Use the official Node.js image as a build stage
FROM node:alpine as builder

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Use the nginx image as the final stage
FROM nginx:stable-alpine

# # Copy the custom nginx configuration
# ARG ENVIRONMENT
# COPY nginx.${ENVIRONMENT}.conf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built files from the previous stage to the NGINX web server's root directory
COPY --from=builder /app/build/ /usr/share/nginx/html

# Expose the port (assuming default is 80)
EXPOSE 80

# Start NGINX server
CMD ["nginx", "-g", "daemon off;"]