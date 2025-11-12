#!/bin/bash

# AI Travel Planner - Quick Start Script

echo "🚀 AI Travel Planner - Quick Start"
echo "=================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm version: $(npm -v)"
echo ""

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
if [ ! -f ".env" ]; then
    echo "⚠️  Creating frontend/.env from .env.example"
    cp .env.example .env
    echo "⚠️  Please edit frontend/.env and add your API keys"
fi
npm install
cd ..

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
if [ ! -f ".env" ]; then
    echo "⚠️  Creating backend/.env from .env.example"
    cp .env.example .env
    echo "⚠️  Please edit backend/.env and add your API keys"
fi
npm install
cd ..

echo ""
echo "✅ Installation complete!"
echo ""
echo "⚠️  IMPORTANT: Please configure your API keys:"
echo "   1. Edit backend/.env"
echo "   2. Edit frontend/.env"
echo "   3. Add your Supabase and other API keys"
echo ""
echo "🚀 To start the development server, run:"
echo "   npm run dev"
echo ""
echo "📖 For more information, see README.md"
echo ""
