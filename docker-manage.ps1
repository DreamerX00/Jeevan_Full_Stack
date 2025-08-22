# Jeevan Healthcare System Docker Management Script (PowerShell)

param(
    [Parameter(Position=0)]
    [string]$Command = "help",
    
    [Parameter(Position=1)]
    [string]$Service = ""
)

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Function to check if Docker is running
function Test-Docker {
    try {
        docker info | Out-Null
        return $true
    }
    catch {
        Write-Error "Docker is not running. Please start Docker and try again."
        exit 1
    }
}

# Function to check if required files exist
function Test-RequiredFiles {
    if (-not (Test-Path ".env")) {
        Write-Warning ".env file not found. Creating from template..."
        Copy-Item ".env.example" ".env"
        Write-Warning "Please edit .env file with your configuration before proceeding."
    }
    
    if (-not (Test-Path "frontend/myNewApp/.env")) {
        Write-Warning "Frontend .env file not found. Creating from template..."
        Copy-Item "frontend/myNewApp/env.example" "frontend/myNewApp/.env"
        Write-Warning "Please edit frontend/myNewApp/.env file with your configuration."
    }
}

# Function to show usage
function Show-Usage {
    Write-Host "Usage: .\docker-manage.ps1 [COMMAND] [SERVICE]"
    Write-Host ""
    Write-Host "Commands:"
    Write-Host "  dev         Start in development mode"
    Write-Host "  prod        Start in production mode"
    Write-Host "  stop        Stop all services"
    Write-Host "  restart     Restart all services"
    Write-Host "  logs        Show logs for all services"
    Write-Host "  logs [svc]  Show logs for specific service (db, backend, frontend)"
    Write-Host "  clean       Stop services and remove volumes"
    Write-Host "  rebuild     Clean rebuild of all services"
    Write-Host "  status      Show status of all services"
    Write-Host "  shell [svc] Open shell in service container"
    Write-Host "  db          Access database shell"
    Write-Host "  test        Run backend tests"
    Write-Host "  help        Show this help message"
}

# Function to start development environment
function Start-DevEnvironment {
    Write-Status "Starting Jeevan Healthcare System in development mode..."
    Test-Docker
    Test-RequiredFiles
    docker-compose -f docker-compose.yml -f docker-compose.override.yml up --build
}

# Function to start production environment
function Start-ProdEnvironment {
    Write-Status "Starting Jeevan Healthcare System in production mode..."
    Test-Docker
    Test-RequiredFiles
    docker-compose -f docker-compose.prod.yml up --build -d
    Write-Success "Production environment started!"
    Write-Status "Access the application at: http://localhost"
    Write-Status "API available at: http://localhost/api"
}

# Function to stop services
function Stop-Services {
    Write-Status "Stopping all services..."
    docker-compose down
    try { docker-compose -f docker-compose.prod.yml down } catch { }
    Write-Success "All services stopped!"
}

# Function to restart services
function Restart-Services {
    Write-Status "Restarting services..."
    Stop-Services
    Start-Sleep -Seconds 2
    Start-DevEnvironment
}

# Function to show logs
function Show-Logs {
    param([string]$ServiceName)
    
    if ([string]::IsNullOrEmpty($ServiceName)) {
        docker-compose logs -f
    } else {
        docker-compose logs -f $ServiceName
    }
}

# Function to clean environment
function Clear-Environment {
    $response = Read-Host "This will stop all services and remove volumes. Continue? (y/N)"
    if ($response -match "^[yY]([eE][sS])?$") {
        Write-Status "Cleaning environment..."
        docker-compose down -v
        try { docker-compose -f docker-compose.prod.yml down -v } catch { }
        docker system prune -f
        Write-Success "Environment cleaned!"
    } else {
        Write-Status "Operation cancelled."
    }
}

# Function to rebuild services
function Rebuild-Services {
    Write-Status "Rebuilding all services..."
    docker-compose down
    docker-compose build --no-cache
    docker-compose up -d
    Write-Success "Services rebuilt and started!"
}

# Function to show status
function Show-Status {
    Write-Status "Service Status:"
    docker-compose ps
    Write-Host ""
    Write-Status "Container Health:"
    docker-compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
}

# Function to open shell in service
function Open-ServiceShell {
    param([string]$ServiceName)
    
    if ([string]::IsNullOrEmpty($ServiceName)) {
        Write-Error "Please specify a service: db, backend, frontend"
        exit 1
    }
    
    switch ($ServiceName) {
        { $_ -in @("backend", "db", "frontend") } {
            docker-compose exec $ServiceName /bin/sh
        }
        default {
            Write-Error "Invalid service. Available: db, backend, frontend"
            exit 1
        }
    }
}

# Function to access database
function Connect-Database {
    Write-Status "Connecting to database..."
    docker-compose exec db psql -U postgres -d jeevanDB
}

# Function to run tests
function Invoke-Tests {
    Write-Status "Running backend tests..."
    docker-compose exec backend ./gradlew test
}

# Main script logic
switch ($Command.ToLower()) {
    "dev" {
        Start-DevEnvironment
    }
    "prod" {
        Start-ProdEnvironment
    }
    "stop" {
        Stop-Services
    }
    "restart" {
        Restart-Services
    }
    "logs" {
        Show-Logs -ServiceName $Service
    }
    "clean" {
        Clear-Environment
    }
    "rebuild" {
        Rebuild-Services
    }
    "status" {
        Show-Status
    }
    "shell" {
        Open-ServiceShell -ServiceName $Service
    }
    "db" {
        Connect-Database
    }
    "test" {
        Invoke-Tests
    }
    default {
        Show-Usage
    }
}
