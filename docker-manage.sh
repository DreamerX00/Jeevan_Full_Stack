#!/bin/bash

# Jeevan Healthcare System Docker Management Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
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

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Function to check if required files exist
check_files() {
    if [ ! -f ".env" ]; then
        print_warning ".env file not found. Creating from template..."
        cp .env.example .env
        print_warning "Please edit .env file with your configuration before proceeding."
    fi
    
    if [ ! -f "frontend/myNewApp/.env" ]; then
        print_warning "Frontend .env file not found. Creating from template..."
        cp frontend/myNewApp/env.example frontend/myNewApp/.env
        print_warning "Please edit frontend/myNewApp/.env file with your configuration."
    fi
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  dev         Start in development mode"
    echo "  prod        Start in production mode"
    echo "  stop        Stop all services"
    echo "  restart     Restart all services"
    echo "  logs        Show logs for all services"
    echo "  logs [svc]  Show logs for specific service (db, backend, frontend)"
    echo "  clean       Stop services and remove volumes"
    echo "  rebuild     Clean rebuild of all services"
    echo "  status      Show status of all services"
    echo "  shell [svc] Open shell in service container"
    echo "  db          Access database shell"
    echo "  test        Run backend tests"
    echo "  help        Show this help message"
}

# Function to start development environment
start_dev() {
    print_status "Starting Jeevan Healthcare System in development mode..."
    check_docker
    check_files
    docker-compose -f docker-compose.yml -f docker-compose.override.yml up --build
}

# Function to start production environment
start_prod() {
    print_status "Starting Jeevan Healthcare System in production mode..."
    check_docker
    check_files
    docker-compose -f docker-compose.prod.yml up --build -d
    print_success "Production environment started!"
    print_status "Access the application at: http://localhost"
    print_status "API available at: http://localhost/api"
}

# Function to stop services
stop_services() {
    print_status "Stopping all services..."
    docker-compose down
    docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
    print_success "All services stopped!"
}

# Function to restart services
restart_services() {
    print_status "Restarting services..."
    stop_services
    sleep 2
    start_dev
}

# Function to show logs
show_logs() {
    if [ -z "$1" ]; then
        docker-compose logs -f
    else
        docker-compose logs -f "$1"
    fi
}

# Function to clean environment
clean_env() {
    print_warning "This will stop all services and remove volumes. Continue? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_status "Cleaning environment..."
        docker-compose down -v
        docker-compose -f docker-compose.prod.yml down -v 2>/dev/null || true
        docker system prune -f
        print_success "Environment cleaned!"
    else
        print_status "Operation cancelled."
    fi
}

# Function to rebuild services
rebuild_services() {
    print_status "Rebuilding all services..."
    docker-compose down
    docker-compose build --no-cache
    docker-compose up -d
    print_success "Services rebuilt and started!"
}

# Function to show status
show_status() {
    print_status "Service Status:"
    docker-compose ps
    echo ""
    print_status "Container Health:"
    docker-compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
}

# Function to open shell in service
open_shell() {
    if [ -z "$1" ]; then
        print_error "Please specify a service: db, backend, frontend"
        exit 1
    fi
    
    case "$1" in
        "backend"|"db"|"frontend")
            docker-compose exec "$1" /bin/sh
            ;;
        *)
            print_error "Invalid service. Available: db, backend, frontend"
            exit 1
            ;;
    esac
}

# Function to access database
access_db() {
    print_status "Connecting to database..."
    docker-compose exec db psql -U postgres -d jeevanDB
}

# Function to run tests
run_tests() {
    print_status "Running backend tests..."
    docker-compose exec backend ./gradlew test
}

# Main script logic
case "${1:-help}" in
    "dev")
        start_dev
        ;;
    "prod")
        start_prod
        ;;
    "stop")
        stop_services
        ;;
    "restart")
        restart_services
        ;;
    "logs")
        show_logs "$2"
        ;;
    "clean")
        clean_env
        ;;
    "rebuild")
        rebuild_services
        ;;
    "status")
        show_status
        ;;
    "shell")
        open_shell "$2"
        ;;
    "db")
        access_db
        ;;
    "test")
        run_tests
        ;;
    "help"|*)
        show_usage
        ;;
esac
