#!/bin/bash

# ERP System Shutdown Script
# يقوم بإيقاف Frontend & Backend بشكل آمن

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

print_info "🛑 Stopping ERP System..."

# Default ports
BACKEND_PORT=${BACKEND_PORT:-8080}
FRONTEND_PORT=${FRONTEND_PORT:-5173}

# Function to kill process safely
kill_process() {
    local pid=$1
    local name=$2
    
    if [ -n "$pid" ] && kill -0 $pid 2>/dev/null; then
        print_info "Stopping $name (PID: $pid)..."
        kill $pid 2>/dev/null || true
        
        # Wait for graceful shutdown
        for i in {1..10}; do
            if ! kill -0 $pid 2>/dev/null; then
                print_success "$name stopped gracefully"
                return 0
            fi
            sleep 1
        done
        
        # Force kill if still running
        if kill -0 $pid 2>/dev/null; then
            print_warning "Force killing $name..."
            kill -9 $pid 2>/dev/null || true
            print_success "$name force stopped"
        fi
    else
        print_info "$name is not running (PID: $pid)"
    fi
}

# Function to kill process on specific port
kill_port() {
    local port=$1
    local name=$2
    local pids=$(lsof -ti:$port 2>/dev/null || true)
    
    if [ -n "$pids" ]; then
        print_warning "Killing processes on port $port ($name): $pids"
        echo "$pids" | xargs kill -9 2>/dev/null || true
        sleep 1
        print_success "Port $port cleared"
    else
        print_info "Port $port is already free"
    fi
}

# Stop using PID files
if [ -f "logs/backend.pid" ]; then
    BACKEND_PID=$(cat logs/backend.pid)
    kill_process $BACKEND_PID "Backend"
    rm -f logs/backend.pid
else
    print_warning "Backend PID file not found"
fi

if [ -f "logs/frontend.pid" ]; then
    FRONTEND_PID=$(cat logs/frontend.pid)
    kill_process $FRONTEND_PID "Frontend"
    rm -f logs/frontend.pid
else
    print_warning "Frontend PID file not found"
fi

# Additional cleanup: Kill any process on the ports
print_info "🧹 Cleaning up ports..."
kill_port $BACKEND_PORT "Backend"
kill_port $FRONTEND_PORT "Frontend"
kill_port 3000 "React"
kill_port 4173 "Vite Preview"
kill_port 8000 "Alternative Backend"

# Kill any Go server processes
print_info "Killing any remaining Go server processes..."
pkill -f "cmd/server/main.go" 2>/dev/null || true

# Kill any npm/vite processes
print_info "Killing any remaining npm/vite processes..."
pkill -f "vite" 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true

# Verify all stopped
sleep 2
print_info "Verifying shutdown..."

BACKEND_CHECK=$(lsof -ti:$BACKEND_PORT 2>/dev/null || true)
FRONTEND_CHECK=$(lsof -ti:$FRONTEND_PORT 2>/dev/null || true)

if [ -z "$BACKEND_CHECK" ] && [ -z "$FRONTEND_CHECK" ]; then
    print_success "✅ All services stopped successfully!"
else
    if [ -n "$BACKEND_CHECK" ]; then
        print_error "Backend port $BACKEND_PORT is still in use!"
    fi
    if [ -n "$FRONTEND_CHECK" ]; then
        print_error "Frontend port $FRONTEND_PORT is still in use!"
    fi
    exit 1
fi

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
print_success "ERP System Stopped"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Optional: Clear logs
read -p "Do you want to clear logs? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -f logs/backend.log logs/frontend.log
    print_success "Logs cleared"
fi
