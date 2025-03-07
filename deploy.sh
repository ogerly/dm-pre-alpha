#!/bin/bash

# Ensure gh-pages package is installed
if ! npm list gh-pages --depth=0 > /dev/null 2>&1; then
  echo "Installing gh-pages package..."
  npm install --save-dev gh-pages
fi

# Build the app
echo "Building application..."
npm run build

# Add .nojekyll file to dist folder to prevent Jekyll processing
touch dist/.nojekyll

# Deploy using gh-pages
echo "Deploying to GitHub Pages..."
npx gh-pages -d dist

echo "Deployment complete! Your site should be available shortly at https://ogerly.github.io/dm-pre-alpha/"
