# Docker Setup Instructions

This document provides instructions for setting up and running the Jeevan project using Docker.

## Prerequisites

- Docker Engine (version 20.10.0 or later)
- Docker Compose (version 2.0.0 or later)
- Git

## Project Structure

```
.
├── backend/                 # Spring Boot backend
├── frontend/               # React frontend
├── Kotlin_Application/     # Android application
├── docker-compose.yml      # Docker Compose configuration
└── # Docker Configuration for Jeevan Healthcare System

This document explains how to run the Jeevan Healthcare System using Docker and Docker Compose.

## Architecture

The application consists of three main services:
- **Frontend**: React application with Vite (Port 3000)
- **Backend**: Spring Boot with Kotlin (Port 8080)
- **Database**: PostgreSQL (Port 5432)
- **Android**: Kotlin Android application (built separately)

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- Git

## Quick Start

### 1. Clone and Setup

```bash
git clone <repository-url>
cd Jeevan_Full_Stack
cp .env.example .env
cp frontend/myNewApp/env.example frontend/myNewApp/.env
```

### 2. Configure Environment Variables

Edit `.env` file in the root directory:
```env
DB_NAME=jeevanDB
DB_USER=postgres
DB_PASSWORD=mydb123
JWT_SECRET=your-jwt-secret-here
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

Edit `frontend/myNewApp/.env`:
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### 3. Run the Application

#### Development Mode
```bash
# Start all services in development mode
docker-compose -f docker-compose.yml -f docker-compose.override.yml up --build

# Or use the shorthand (override is loaded automatically)
docker-compose up --build
```

#### Production Mode
```bash
# Start in production mode
docker-compose -f docker-compose.prod.yml up --build -d
```

## Service Details

### Database (PostgreSQL)
- **Image**: postgres:15-alpine
- **Port**: 5432
- **Database**: jeevanDB
- **Volume**: Persistent storage for data
- **Health Check**: Built-in PostgreSQL health check

### Backend (Spring Boot)
- **Build**: Multi-stage Gradle build with JDK 21
- **Port**: 8080
- **Features**: 
  - Health checks via Spring Actuator
  - Database migrations
  - JWT authentication
  - Email services
  - WebSocket support
- **Profiles**: 
  - `docker` for containerized environment
  - `dev` for development
  - `prod` for production

### Frontend (React/Vite)
- **Build**: Multi-stage Node.js build with Nginx
- **Port**: 3000
- **Features**:
  - Optimized production build
  - Nginx reverse proxy
  - API proxying to backend
  - WebSocket proxy support
  - Static asset caching

## Available Commands

### Basic Operations
```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Rebuild and start
docker-compose up --build

# View logs
docker-compose logs -f [service-name]
```

### Development Commands
```bash
# Start with development overrides
docker-compose -f docker-compose.yml -f docker-compose.override.yml up

# Run backend tests
docker-compose exec backend ./gradlew test

# Access database
docker-compose exec db psql -U postgres -d jeevanDB

# Backend shell access
docker-compose exec backend /bin/sh

# Frontend shell access
docker-compose exec frontend /bin/sh
```

### Production Commands
```bash
# Production deployment
docker-compose -f docker-compose.prod.yml up -d

# Production with SSL reverse proxy
docker-compose -f docker-compose.prod.yml up -d
```

## Configuration Files

### Docker Compose Files
- `docker-compose.yml` - Base configuration
- `docker-compose.override.yml` - Development overrides
- `docker-compose.prod.yml` - Production configuration

### Dockerfiles
- `Dockerfile` - Root Dockerfile (for backend)
- `backend/Dockerfile` - Spring Boot application
- `frontend/myNewApp/Dockerfile` - React application

### Configuration Files
- `backend/src/main/resources/application-docker.properties` - Docker-specific backend config
- `frontend/myNewApp/nginx.conf` - Frontend Nginx configuration
- `nginx/nginx.conf` - Production reverse proxy configuration

## Health Checks

All services include health checks:

- **Database**: `pg_isready` command
- **Backend**: Spring Actuator `/actuator/health` endpoint
- **Frontend**: Nginx health endpoint `/health`

Check health status:
```bash
docker-compose ps
docker inspect <container-name> | grep -A 5 Health
```

## Networking

Services communicate through a custom Docker network (`jeevan-network`):
- Frontend → Backend: Internal Docker network
- External access: Host ports 3000 (frontend) and 8080 (backend)
- Database: Internal access only (port 5432)

## Volumes

### Development
- `postgres_dev_data`: Development database data
- `gradle_cache`: Gradle build cache for faster builds

### Production
- `postgres_prod_data`: Production database data

## Troubleshooting

### Common Issues

1. **Port conflicts**
   ```bash
   # Check if ports are in use
   netstat -an | grep :3000
   netstat -an | grep :8080
   netstat -an | grep :5432
   ```

2. **Database connection issues**
   ```bash
   # Check database logs
   docker-compose logs db
   
   # Verify database is accessible
   docker-compose exec backend ping db
   ```

3. **Build failures**
   ```bash
   # Clean build
   docker-compose down -v
   docker system prune -f
   docker-compose up --build
   ```

4. **Frontend not loading**
   ```bash
   # Check frontend logs
   docker-compose logs frontend
   
   # Verify backend connectivity
   curl http://localhost:8080/actuator/health
   ```

### Log Access
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Database Management
```bash
# Access database shell
docker-compose exec db psql -U postgres -d jeevanDB

# Backup database
docker-compose exec db pg_dump -U postgres jeevanDB > backup.sql

# Restore database
docker-compose exec -T db psql -U postgres jeevanDB < backup.sql
```

## Security Considerations

1. **Production Environment Variables**: Never commit real credentials to version control
2. **SSL/TLS**: Configure SSL certificates for production deployment
3. **Network Security**: Database is not exposed to external network
4. **User Permissions**: Containers run as non-root users
5. **Image Security**: Using official, minimal base images

## Performance Optimization

1. **Multi-stage Builds**: Reduced image sizes
2. **Layer Caching**: Optimized Dockerfile layer structure
3. **Nginx Caching**: Static asset caching in production
4. **Database Optimization**: Connection pooling and proper indexes
5. **Resource Limits**: Configure memory and CPU limits in production

## Development Workflow

1. **Local Development**: Use override file for hot reloading
2. **Testing**: Run tests in containers to match production environment
3. **Debugging**: Backend debug port (5005) exposed in development mode
4. **Hot Reloading**: Frontend supports Vite HMR, backend supports Spring DevTools

## Production Deployment

1. Configure environment variables
2. Set up SSL certificates
3. Configure domain name in Nginx
4. Use production compose file
5. Set up monitoring and logging
6. Configure backup strategies

## Android Development

The Android application is not containerized but can connect to the containerized backend:

1. Update `local.properties` in the Android project:
   ```properties
   API_BASE_URL=http://your-docker-host:8080
   WEBSOCKET_URL=ws://your-docker-host:8080
   ```

2. Build the Android app:
   ```bash
   cd Kotlin_Application
   ./gradlew assembleDebug
   ```

## Support

For issues and questions:
1. Check the logs using the commands above
2. Verify environment configuration
3. Check Docker and Docker Compose versions
4. Review the troubleshooting section        # This file
```

## Quick Start

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. Build and start the containers:
   ```bash
   docker-compose up --build
   ```

3. Access the applications:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - PostgreSQL: localhost:5432

## Services

### PostgreSQL Database
- Port: 5432
- Database: jeevan_db
- Username: jeevan_user
- Password: jeevan_password

### Backend Service
- Port: 8080
- Built with Spring Boot
- Connects to PostgreSQL
- JWT authentication

### Frontend Service
- Port: 3000
- Built with React
- Served by Nginx
- Connects to Backend API

## Environment Variables

### Backend
- `SPRING_DATASOURCE_URL`: Database connection URL
- `SPRING_DATASOURCE_USERNAME`: Database username
- `SPRING_DATASOURCE_PASSWORD`: Database password
- `JWT_SECRET`: Secret key for JWT tokens
- `SERVER_PORT`: Port for the backend service

### Frontend
- `VITE_API_URL`: Backend API URL

## Development

### Rebuilding Services
```bash
# Rebuild all services
docker-compose up --build

# Rebuild specific service
docker-compose up --build <service-name>
```

### Viewing Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f <service-name>
```

### Stopping Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## Database Management

### Accessing PostgreSQL
```bash
docker-compose exec postgres psql -U jeevan_user -d jeevan_db
```

### Backup Database
```bash
docker-compose exec postgres pg_dump -U jeevan_user jeevan_db > backup.sql
```

### Restore Database
```bash
docker-compose exec -T postgres psql -U jeevan_user -d jeevan_db < backup.sql
```

## Troubleshooting

### Common Issues

1. Port Conflicts
   - Ensure ports 3000, 8080, and 5432 are not in use
   - Change ports in docker-compose.yml if needed

2. Database Connection
   - Wait for PostgreSQL to be healthy before starting backend
   - Check database credentials in environment variables

3. Build Failures
   - Clear Docker cache: `docker system prune -a`
   - Rebuild without cache: `docker-compose build --no-cache`

### Logs and Debugging

1. View container logs:
   ```bash
   docker-compose logs -f <service-name>
   ```

2. Access container shell:
   ```bash
   docker-compose exec <service-name> sh
   ```

## Security Considerations

1. Change default passwords in production
2. Use secure JWT secret
3. Enable HTTPS in production
4. Regular security updates
5. Monitor container logs

## Production Deployment

1. Update environment variables
2. Enable HTTPS
3. Set up proper backup strategy
4. Configure monitoring
5. Set up CI/CD pipeline

## Maintenance

### Regular Tasks
1. Update dependencies
2. Backup database
3. Monitor logs
4. Check security updates
5. Clean up unused resources

### Cleanup Commands
```bash
# Remove unused containers
docker container prune

# Remove unused images
docker image prune

# Remove unused volumes
docker volume prune

# Remove all unused resources
docker system prune
``` 