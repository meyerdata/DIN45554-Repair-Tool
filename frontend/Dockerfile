FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy app files
COPY . .

# Expose Angular dev server port
EXPOSE 4200

# Default command: start dev server
CMD ["npm", "run", "serve"]
