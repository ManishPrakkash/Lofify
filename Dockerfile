FROM node:16-alpine as build

# Set working directory
WORKDIR /app

# Install client dependencies and build
COPY client/package*.json ./client/
RUN cd client && npm install
COPY client/ ./client/
RUN cd client && npm run build

# Install server dependencies
COPY server/package*.json ./server/
RUN cd server && npm install
COPY server/ ./server/

# Final stage
FROM node:16-alpine

WORKDIR /app

# Copy built client and server
COPY --from=build /app/client/dist ./client/dist
COPY --from=build /app/server ./server

# Install production dependencies only
WORKDIR /app/server
RUN npm install --only=production

# Install ffprobe-static explicitly to ensure it's available
RUN npm install ffprobe-static

# Expose port (Railway will override this with their own port)
EXPOSE ${PORT:-5000}

# Start the app
CMD ["npm", "start"]
