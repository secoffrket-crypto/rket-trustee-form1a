#!/bin/bash

# RKET Trustee Form - Netlify Deployment Script
# This script automates the deployment process to Netlify

echo "🚀 RKET Trustee Form - Netlify Deployment"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the trustee-form directory."
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit for RKET Trustee Form"
else
    echo "✅ Git repository already initialized"
fi

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "⚠️  No Git remote found. Please set up your GitHub repository first:"
    echo "   1. Create a new repository on GitHub"
    echo "   2. Run: git remote add origin https://github.com/yourusername/trustee-form.git"
    echo "   3. Run: git push -u origin main"
    echo "   4. Then run this script again"
    exit 1
fi

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

echo "✅ Build completed successfully!"

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "📦 Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Deploy to Netlify
echo "🌐 Deploying to Netlify..."
echo "Please follow the prompts to connect your site to Netlify"

netlify deploy --prod --dir=dist

if [ $? -eq 0 ]; then
    echo "🎉 Deployment successful!"
    echo ""
    echo "Next steps:"
    echo "1. Visit your Netlify dashboard to configure your custom domain"
    echo "2. Set up form handling in Site settings > Forms"
    echo "3. Configure environment variables if needed"
    echo "4. Test your form submission"
    echo ""
    echo "Your trustee form is now live! 🚀"
else
    echo "❌ Deployment failed. Please check the error messages above."
    exit 1
fi
