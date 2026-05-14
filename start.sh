#!/bin/sh

# Start AI Service (Python/FastAPI) on internal port 8000
echo "🚀 Starting AI Service..."
cd /app/ai_service && uvicorn main:app --host 0.0.0.0 --port 8000 &

# Wait for AI service to initialize
sleep 2

# Start Backend Server (Node/Express)
# It will listen on the port provided by Render ($PORT or default 5000)
echo "🚀 Starting Backend Server..."
cd /app/server && node index.js
