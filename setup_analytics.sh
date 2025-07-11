#!/bin/bash

echo "🚀 Setting up Analytics Infrastructure..."

# Check if running on macOS (Darwin)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "📱 Detected macOS"
    
    # Check if Homebrew is installed
    if ! command -v brew &> /dev/null; then
        echo "❌ Homebrew not found. Please install Homebrew first:"
        echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
        exit 1
    fi
    
    # Install Redis
    echo "📦 Installing Redis..."
    brew install redis
    
    # Start Redis service
    echo "🔄 Starting Redis service..."
    brew services start redis
    
else
    echo "🐧 Detected Linux/Unix"
    
    # Update package list
    sudo apt-get update
    
    # Install Redis
    echo "📦 Installing Redis..."
    sudo apt-get install -y redis-server
    
    # Start Redis service
    echo "🔄 Starting Redis service..."
    sudo systemctl start redis-server
    sudo systemctl enable redis-server
fi

# Test Redis connection
echo "🧪 Testing Redis connection..."
if redis-cli ping | grep -q PONG; then
    echo "✅ Redis is running successfully!"
else
    echo "❌ Redis connection failed!"
    exit 1
fi

# Install Python dependencies
echo "📦 Installing Python dependencies..."
cd backend
pip install -r requirements.txt

# Create models directory
echo "📁 Creating models directory..."
mkdir -p models

# Install Frontend dependencies
echo "📦 Installing Frontend dependencies..."
cd ../frontend
npm install

echo "🎉 Analytics setup complete!"
echo ""
echo "🔥 Next steps:"
echo "1. Start the backend: cd backend && python server.py"
echo "2. Start the frontend: cd frontend && npm start"
echo "3. Open http://localhost:3005 in your browser"
echo "4. Login as admin (admin@culturalcenter.com / admin123)"
echo "5. Navigate to the Analytics tab to see real-time data!"
echo ""
echo "📊 Features available:"
echo "   • Real-time user activity tracking"
echo "   • Performance monitoring"
echo "   • ML-based user segmentation"
echo "   • WebSocket dashboard updates"
echo "   • System health monitoring" 