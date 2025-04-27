#!/usr/bin/env bash
# Exit on error
set -o errexit

npm install
# No build step needed for a basic Node.js application
echo "Build completed" 