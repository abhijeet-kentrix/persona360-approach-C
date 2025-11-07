# Use the official Node.js image as the base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install client dependencies
RUN npm install

# Copy the rest of the client code
COPY . .

# Build the React app
RUN npm run build

# Install serve globally to serve the built app
RUN npm install -g serve

# Remove the node_modules directory to reduce image size
RUN rm -rf node_modules

# Expose the port that the React app will run on
EXPOSE 3000

# Start a simple HTTP server to serve the built React app
# CMD ["npx", "serve", "-s", "build"]
