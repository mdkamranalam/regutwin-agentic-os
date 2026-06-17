FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application files
COPY . .

# Build TypeScript code
RUN npm run build

# Expose the application port
EXPOSE 8000

# Run the compiled server
CMD ["npm", "start"]
