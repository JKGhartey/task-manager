#!/bin/bash

echo "Starting build process..."

# Navigate to backend directory
cd backend

echo "Installing dependencies..."
npm install

echo "Compiling TypeScript..."
npm run build

echo "Checking if dist/server.js was created..."
if [ -f "dist/server.js" ]; then
    echo "✅ Build successful! dist/server.js exists."
    ls -la dist/
else
    echo "❌ Build failed! dist/server.js not found."
    echo "Contents of backend directory:"
    ls -la
    echo "Contents of dist directory (if it exists):"
    ls -la dist/ 2>/dev/null || echo "dist directory does not exist"
    exit 1
fi

echo "Build process completed successfully!" 