#!/bin/bash

# Build the app
npm run build

# Copy the dist files to the repository root for GitHub Pages
cp -r dist/* .
touch .nojekyll

# Commit and push changes
git add .
git commit -m "Manual deploy to GitHub Pages"
git push

echo "Deployed to GitHub Pages!"
