# Jeevan Healthcare System - Makefile

.PHONY: help dev prod stop restart logs clean rebuild status shell db test install build

# Default target
.DEFAULT_GOAL := help

# Colors
BLUE = \033[0;34m
GREEN = \033[0;32m
YELLOW = \033[1;33m
NC = \033[0m # No Color

help: ## Show this help message
	@echo "$(BLUE)Jeevan Healthcare System - Docker Management$(NC)"
	@echo ""
	@echo "$(GREEN)Available commands:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(BLUE)%-15s$(NC) %s\n", $$1, $$2}'

dev: ## Start in development mode
	@echo "$(YELLOW)Starting development environment...$(NC)"
	@docker-compose -f docker-compose.yml -f docker-compose.override.yml up --build

prod: ## Start in production mode
	@echo "$(YELLOW)Starting production environment...$(NC)"
	@docker-compose -f docker-compose.prod.yml up --build -d
	@echo "$(GREEN)Production environment started!$(NC)"
	@echo "Access the application at: http://localhost"

stop: ## Stop all services
	@echo "$(YELLOW)Stopping all services...$(NC)"
	@docker-compose down
	@docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
	@echo "$(GREEN)All services stopped!$(NC)"

restart: stop dev ## Restart all services

logs: ## Show logs for all services
	@docker-compose logs -f

logs-backend: ## Show backend logs
	@docker-compose logs -f backend

logs-frontend: ## Show frontend logs
	@docker-compose logs -f frontend

logs-db: ## Show database logs
	@docker-compose logs -f db

clean: ## Stop services and remove volumes
	@echo "$(YELLOW)Cleaning environment...$(NC)"
	@docker-compose down -v
	@docker-compose -f docker-compose.prod.yml down -v 2>/dev/null || true
	@docker system prune -f
	@echo "$(GREEN)Environment cleaned!$(NC)"

rebuild: ## Clean rebuild of all services
	@echo "$(YELLOW)Rebuilding all services...$(NC)"
	@docker-compose down
	@docker-compose build --no-cache
	@docker-compose up -d
	@echo "$(GREEN)Services rebuilt and started!$(NC)"

status: ## Show status of all services
	@echo "$(BLUE)Service Status:$(NC)"
	@docker-compose ps
	@echo ""
	@echo "$(BLUE)Container Health:$(NC)"
	@docker-compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"

shell-backend: ## Open shell in backend container
	@docker-compose exec backend /bin/sh

shell-frontend: ## Open shell in frontend container
	@docker-compose exec frontend /bin/sh

shell-db: ## Open shell in database container
	@docker-compose exec db /bin/sh

db: ## Access database shell
	@echo "$(YELLOW)Connecting to database...$(NC)"
	@docker-compose exec db psql -U postgres -d jeevanDB

test: ## Run backend tests
	@echo "$(YELLOW)Running backend tests...$(NC)"
	@docker-compose exec backend ./gradlew test

install: ## Install dependencies for all services
	@echo "$(YELLOW)Installing frontend dependencies...$(NC)"
	@cd frontend/myNewApp && npm install
	@echo "$(GREEN)Dependencies installed!$(NC)"

build-frontend: ## Build frontend application
	@echo "$(YELLOW)Building frontend...$(NC)"
	@cd frontend/myNewApp && npm run build

build-backend: ## Build backend application
	@echo "$(YELLOW)Building backend...$(NC)"
	@cd backend && ./gradlew build

build-android: ## Build Android application
	@echo "$(YELLOW)Building Android application...$(NC)"
	@cd Kotlin_Application && ./gradlew assembleDebug

build-all: build-frontend build-backend build-android ## Build all applications

# Environment setup
setup: ## Setup environment files
	@echo "$(YELLOW)Setting up environment files...$(NC)"
	@cp -n .env.example .env 2>/dev/null || true
	@cp -n frontend/myNewApp/env.example frontend/myNewApp/.env 2>/dev/null || true
	@echo "$(GREEN)Environment files created!$(NC)"
	@echo "$(YELLOW)Please edit .env and frontend/myNewApp/.env with your configuration$(NC)"

# Health checks
health: ## Check health of all services
	@echo "$(BLUE)Checking service health...$(NC)"
	@curl -s http://localhost:8080/actuator/health || echo "Backend not responding"
	@curl -s http://localhost:3000/health || echo "Frontend not responding"

# Database operations
db-backup: ## Backup database
	@echo "$(YELLOW)Creating database backup...$(NC)"
	@docker-compose exec -T db pg_dump -U postgres jeevanDB > backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "$(GREEN)Database backup created!$(NC)"

db-restore: ## Restore database from backup (usage: make db-restore BACKUP=backup_file.sql)
	@echo "$(YELLOW)Restoring database from $(BACKUP)...$(NC)"
	@docker-compose exec -T db psql -U postgres jeevanDB < $(BACKUP)
	@echo "$(GREEN)Database restored!$(NC)"

# Development helpers
fresh: clean setup dev ## Fresh start (clean + setup + dev)

# Production helpers
deploy: setup prod ## Deploy to production

# Monitoring
monitor: ## Monitor resource usage
	@docker stats $$(docker-compose ps -q)

# Update
update: ## Pull latest images and rebuild
	@echo "$(YELLOW)Updating Docker images...$(NC)"
	@docker-compose pull
	@docker-compose build --pull
	@echo "$(GREEN)Images updated!$(NC)"
