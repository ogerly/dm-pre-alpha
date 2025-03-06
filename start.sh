#!/bin/bash
# Simple script to start both the Express server and Vite dev server

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js to run this application."
    exit 1
fi

# Check if concurrently is installed, install if not
if ! command -v npx concurrently &> /dev/null; then
    echo "Installing concurrently..."
    npm install --save-dev concurrently
fi

# Start both servers using concurrently
npx concurrently -n "SERVER,VITE" -c "blue,green" \
    "node server.js" \
    "npx vite --port 4000"

echo "Both servers stopped."
