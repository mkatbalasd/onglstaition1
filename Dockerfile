# Use an official Node runtime as the base image
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy frontend package files and install deps for build
COPY frontend/package*.json frontend/
RUN npm --prefix frontend install

# Copy the rest of the application source
COPY . .

# Build frontend assets
RUN npm run build

EXPOSE 3002
CMD ["npm", "start"]
