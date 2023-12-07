# Step 1: Build stage
FROM node:18 AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .

# Step 2: Run stage
FROM node:18-alpine
WORKDIR /usr/src/app
COPY --from=build /usr/src/app .
RUN npm ci --production
EXPOSE 3001
CMD ["node", "app.js"]
