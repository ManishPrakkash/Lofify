FROM node:16-alpine

WORKDIR /app

# Copy package files
COPY server/package*.json ./

# Install dependencies
RUN npm install

# Copy server files
COPY server/ ./

# Expose the port
EXPOSE 5000

# Start the app
CMD ["npm", "start"]