#!/bin/bash

# ERP System Startup Script
# يقوم بإيقاف جميع المنافذ القديمة وتشغيل Frontend & Backend معاً

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print with color
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Default ports
BACKEND_PORT=${BACKEND_PORT:-8080}
FRONTEND_PORT=${FRONTEND_PORT:-5173}

print_info "🚀 Starting ERP System..."
print_info "Backend Port: $BACKEND_PORT"
print_info "Frontend Port: $FRONTEND_PORT"

# Function to kill process on specific port
kill_port() {
    local port=$1
    local pids=$(lsof -ti:$port 2>/dev/null || true)
    
    if [ -n "$pids" ]; then
        print_warning "Killing processes on port $port: $pids"
        echo "$pids" | xargs kill -9 2>/dev/null || true
        sleep 1
        print_success "Port $port cleared"
    else
        print_info "Port $port is already free"
    fi
}

# Clean up old ports
print_info "🧹 Cleaning up old ports..."
kill_port $BACKEND_PORT
kill_port $FRONTEND_PORT

# Additional common ports cleanup
kill_port 3000  # React default
kill_port 4173  # Vite preview
kill_port 8000  # Alternative backend

print_success "All ports cleaned"

# Check if backend directory exists
if [ ! -d "backend" ]; then
    print_error "Backend directory not found!"
    exit 1
fi

# Check if frontend directory exists
if [ ! -d "frontend" ]; then
    print_error "Frontend directory not found!"
    exit 1
fi

# Create logs directory
mkdir -p logs

# Start Backend
print_info "🔧 Starting Backend Server..."
cd backend

# Check if Go is installed
if ! command -v go &> /dev/null; then
    print_error "Go is not installed!"
    exit 1
fi

# Start backend in background
nohup go run cmd/server/main.go > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo $BACKEND_PID > ../logs/backend.pid
print_success "Backend started (PID: $BACKEND_PID)"

cd ..

# Wait for backend to be ready
print_info "⏳ Waiting for backend to be ready..."
for i in {1..30}; do
    if curl -s http://localhost:$BACKEND_PORT/health >/dev/null 2>&1 || \
       curl -s http://localhost:$BACKEND_PORT/api/v1/health >/dev/null 2>&1 || \
       nc -z localhost $BACKEND_PORT 2>/dev/null; then
        print_success "Backend is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        print_warning "Backend might not be ready yet, but continuing..."
    fi
    sleep 1
done

# Start Frontend
print_info "🎨 Starting Frontend Server..."
cd frontend

# Check if Node is installed
if ! command -v npm &> /dev/null; then
    print_error "Node.js/npm is not installed!"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    print_info "Installing frontend dependencies..."
    npm install
fi

# Start frontend in background
nohup npm run dev > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > ../logs/frontend.pid
print_success "Frontend started (PID: $FRONTEND_PID)"

cd ..

# Wait for frontend to be ready
print_info "⏳ Waiting for frontend to be ready..."
for i in {1..30}; do
    if nc -z localhost $FRONTEND_PORT 2>/dev/null; then
        print_success "Frontend is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        print_warning "Frontend might not be ready yet, but continuing..."
    fi
    sleep 1
done

# Summary
echo ""
print_success "✅ ERP System Started Successfully!"
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Backend:${NC}  http://localhost:$BACKEND_PORT"
echo -e "${BLUE}Frontend:${NC} http://localhost:$FRONTEND_PORT"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
print_info "Logs available at:"
echo "  - Backend:  logs/backend.log"
echo "  - Frontend: logs/frontend.log"
echo ""
print_info "Process IDs saved to:"
echo "  - Backend:  logs/backend.pid"
echo "  - Frontend: logs/frontend.pid"
echo ""
print_warning "To stop the system, run: ./stop.sh"
echo ""

# Optional: Follow logs
read -p "Do you want to follow the logs? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_info "Following logs... (Ctrl+C to exit)"
    tail -f logs/backend.log logs/frontend.log
fi
