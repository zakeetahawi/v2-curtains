#!/bin/bash

# ERP System Status Check Script
# يعرض حالة تشغيل النظام

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Default ports
BACKEND_PORT=${BACKEND_PORT:-8080}
FRONTEND_PORT=${FRONTEND_PORT:-5173}

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}       ERP System Status Check${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check Backend
print_info "Checking Backend..."
if [ -f "logs/backend.pid" ]; then
    BACKEND_PID=$(cat logs/backend.pid)
    if kill -0 $BACKEND_PID 2>/dev/null; then
        print_success "Backend is running (PID: $BACKEND_PID)"
        
        # Check port
        if nc -z localhost $BACKEND_PORT 2>/dev/null; then
            print_success "Backend port $BACKEND_PORT is active"
        else
            print_error "Backend port $BACKEND_PORT is not responding"
        fi
    else
        print_error "Backend is not running (stale PID: $BACKEND_PID)"
    fi
else
    print_error "Backend PID file not found"
    
    # Check if port is in use
    BACKEND_PIDS=$(lsof -ti:$BACKEND_PORT 2>/dev/null || true)
    if [ -n "$BACKEND_PIDS" ]; then
        print_info "But port $BACKEND_PORT is in use by: $BACKEND_PIDS"
    fi
fi

echo ""

# Check Frontend
print_info "Checking Frontend..."
if [ -f "logs/frontend.pid" ]; then
    FRONTEND_PID=$(cat logs/frontend.pid)
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        print_success "Frontend is running (PID: $FRONTEND_PID)"
        
        # Check port
        if nc -z localhost $FRONTEND_PORT 2>/dev/null; then
            print_success "Frontend port $FRONTEND_PORT is active"
        else
            print_error "Frontend port $FRONTEND_PORT is not responding"
        fi
    else
        print_error "Frontend is not running (stale PID: $FRONTEND_PID)"
    fi
else
    print_error "Frontend PID file not found"
    
    # Check if port is in use
    FRONTEND_PIDS=$(lsof -ti:$FRONTEND_PORT 2>/dev/null || true)
    if [ -n "$FRONTEND_PIDS" ]; then
        print_info "But port $FRONTEND_PORT is in use by: $FRONTEND_PIDS"
    fi
fi

echo ""

# Port Summary
print_info "Port Summary:"
echo "  Backend Port:  $BACKEND_PORT"
echo "  Frontend Port: $FRONTEND_PORT"

echo ""

# URLs
print_info "Access URLs:"
echo "  Backend:  http://localhost:$BACKEND_PORT"
echo "  Frontend: http://localhost:$FRONTEND_PORT"

echo ""

# Log files
if [ -f "logs/backend.log" ]; then
    BACKEND_LOG_SIZE=$(du -h logs/backend.log | cut -f1)
    print_info "Backend log size: $BACKEND_LOG_SIZE"
fi

if [ -f "logs/frontend.log" ]; then
    FRONTEND_LOG_SIZE=$(du -h logs/frontend.log | cut -f1)
    print_info "Frontend log size: $FRONTEND_LOG_SIZE"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Tail logs option
if [ "$1" = "-l" ] || [ "$1" = "--logs" ]; then
    print_info "Showing last 20 lines from logs..."
    echo ""
    echo -e "${YELLOW}=== Backend Log ===${NC}"
    tail -n 20 logs/backend.log 2>/dev/null || echo "No backend log available"
    echo ""
    echo -e "${YELLOW}=== Frontend Log ===${NC}"
    tail -n 20 logs/frontend.log 2>/dev/null || echo "No frontend log available"
fi
