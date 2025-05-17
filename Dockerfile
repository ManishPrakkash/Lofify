FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Install client dependencies and build
COPY client/package*.json ./client/
RUN cd client && npm install
COPY client/ ./client/
# Fix permissions and build
RUN chmod -R 755 ./client/node_modules/.bin/
# Set API URL for production build - empty string means use relative URLs
# This works because in production, Express serves the frontend static files
ENV VITE_API_URL=""
# Use npx to run vite directly with explicit path
RUN cd client && node ./node_modules/vite/bin/vite.js build

# Install server dependencies
COPY server/package*.json ./server/
RUN cd server && npm install
COPY server/ ./server/

# Final stage
FROM node:18-alpine

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
# We'll expose port 5000, but the app will listen on $PORT which Railway sets
EXPOSE 5000

# Set NODE_ENV to production
ENV NODE_ENV=production

# Start the app
CMD ["npm", "start"]
