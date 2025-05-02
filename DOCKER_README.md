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
└── DOCKER_README.md        # This file
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