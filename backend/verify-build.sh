#!/bin/bash

echo "Starting build verification..."

# Run TypeScript compilation
echo "Compiling TypeScript..."
npm run build

# Check if dist folder exists
if [ ! -d "dist" ]; then
    echo "ERROR: dist folder not created!"
    exit 1
fi

# Check if server.js exists
if [ ! -f "dist/server.js" ]; then
    echo "ERROR: dist/server.js not found!"
    echo "Contents of dist folder:"
    ls -la dist/
    exit 1
fi

echo "Build verification successful!"
echo "dist/server.js exists and is ready to run." 