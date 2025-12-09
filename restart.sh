#!/bin/bash

# ERP System Restart Script
# يقوم بإعادة تشغيل النظام بالكامل

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_info "🔄 Restarting ERP System..."
echo ""

# Stop the system
./stop.sh

echo ""
print_info "Waiting 3 seconds before restart..."
sleep 3
echo ""

# Start the system
./start.sh
