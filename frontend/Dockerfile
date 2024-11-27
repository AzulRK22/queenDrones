# Base image with Node.js
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application files
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the default Next.js server port
EXPOSE 3000

# Start the Next.js server
CMD ["npm", "run", "start", "--", "-p", "80"] 
