# Use a slim Node.js image
FROM node:20-slim

# Install Python and essential build tools
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy and install Backend dependencies
COPY server/package*.json ./server/
RUN cd server && npm install --production

# Copy and install AI Service dependencies
COPY ai_service/requirements.txt ./ai_service/
RUN pip3 install --no-cache-dir --break-system-packages -r ai_service/requirements.txt

# Copy all files
COPY . .

# Make the start script executable
RUN chmod +x start.sh

# Render uses the PORT environment variable (usually 10000)
EXPOSE 10000

# Set default internal environment variables
ENV NODE_ENV=production
ENV PORT=10000
ENV AI_SERVICE_URL=http://localhost:8000

# Start both services using the script
CMD ["./start.sh"]
