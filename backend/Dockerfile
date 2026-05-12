# Use the official Node.js LTS image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (for efficient caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire backend directory (excluding files in .dockerignore)
COPY . .

# Expose the application port (same as the one in index.js)
EXPOSE 8080

# Start the application (development mode)
CMD ["node", "server.js"]
# CMD ["sh"]