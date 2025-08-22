# Development Environment Setup - Jeevan Healthcare System

## 🚀 Quick Start for Development

### Current Development Environment Features:
- **Hot Reloading**: Both frontend and backend support live code changes
- **Debug Support**: Backend debug port (5005) exposed for debugging
- **Development Database**: Separate `jeevanDB_dev` database
- **Source Code Mounting**: Local code changes reflected immediately
- **Development Logging**: Verbose logging enabled for debugging

## 📁 Development Structure

```
Development Environment:
├── Frontend (React/Vite) - Port 3000
│   ├── Hot Module Replacement (HMR)
│   ├── Development server with proxy
│   └── Source maps enabled
├── Backend (Spring Boot) - Port 8080
│   ├── Spring DevTools enabled
│   ├── Debug port 5005
│   └── Live restart on code changes
└── Database (PostgreSQL) - Port 5432
    ├── Development database: jeevanDB_dev
    └── Persistent data in Docker volume
```

## 🛠️ Development Commands

### Start Development Environment:
```bash
# Full development stack
docker-compose up --build

# Or use the management scripts
make dev                    # Linux/Mac
.\docker-manage.ps1 dev     # Windows PowerShell

# Or use npm scripts
npm run dev
```

### Development Workflow Commands:
```bash
# View logs (all services)
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db

# Access service containers
docker-compose exec backend /bin/sh
docker-compose exec frontend /bin/sh

# Access database
docker-compose exec db psql -U postgres -d jeevanDB_dev

# Restart specific service
docker-compose restart backend
docker-compose restart frontend

# Stop development environment
docker-compose down
```

## 🔧 Development Configuration

### Environment Variables (Development):
```env
# Backend
SPRING_PROFILES_ACTIVE=dev
SPRING_DEVTOOLS_RESTART_ENABLED=true
JDBC_URL=jdbc:postgresql://db:5432/jeevanDB_dev

# Frontend
NODE_ENV=development
VITE_API_BASE_URL=http://localhost:8080
VITE_WEBSOCKET_URL=ws://localhost:8080
```

### Development Ports:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Backend Debug**: localhost:5005 (for IDE debugging)
- **Database**: localhost:5432
- **Vite HMR**: localhost:24678

## 🎯 Development Features

### Frontend Development:
- **Vite HMR**: Instant updates on code changes
- **Hot Reloading**: React components update without page refresh
- **Development Proxy**: API calls proxied to backend
- **Source Maps**: Easy debugging in browser DevTools
- **ESLint**: Real-time linting

### Backend Development:
- **Spring DevTools**: Automatic restart on code changes
- **Debug Port**: Remote debugging support (port 5005)
- **Development Profile**: Enhanced logging and error details
- **Live Reload**: Gradle continuous build mode
- **Database Auto-migration**: Schema updates applied automatically

### Database Development:
- **Separate Dev Database**: `jeevanDB_dev` isolated from production
- **Schema Migrations**: Automatic on startup
- **Data Persistence**: Data preserved between container restarts
- **Direct Access**: Database accessible on localhost:5432

## 🔍 Debugging Setup

### Backend Debugging (IntelliJ IDEA):
1. Add Remote JVM Debug configuration
2. Host: `localhost`, Port: `5005`
3. Set breakpoints in your Kotlin code
4. Start debugging session

### Frontend Debugging:
1. Open browser DevTools (F12)
2. Source maps enabled for easy debugging
3. React DevTools browser extension recommended
4. Vue.js DevTools if using Vue components

### Database Debugging:
```bash
# Connect to development database
docker-compose exec db psql -U postgres -d jeevanDB_dev

# View tables
\dt

# View specific table data
SELECT * FROM users;

# Check database logs
docker-compose logs db
```

## 📝 Development Best Practices

### Code Changes:
1. **Frontend**: Save files → Vite HMR → Browser updates instantly
2. **Backend**: Save files → Spring DevTools → Application restarts
3. **Database**: Schema changes → Update schema.sql → Restart backend

### Testing:
```bash
# Run backend tests
docker-compose exec backend ./gradlew test

# Run frontend tests (when test files exist)
docker-compose exec frontend npm test

# Run specific test file
docker-compose exec backend ./gradlew test --tests "AuthControllerTest"
```

### Performance Monitoring:
```bash
# Monitor resource usage
docker stats

# Check service health
curl http://localhost:8080/actuator/health
curl http://localhost:3000/health
```

## 🐛 Common Development Issues & Solutions

### Backend Not Starting:
```bash
# Check backend logs
docker-compose logs backend

# Common issues:
# 1. Database connection - ensure db service is healthy
# 2. Port conflicts - ensure 8080 is free
# 3. Gradle build issues - check dependencies
```

### Frontend Not Loading:
```bash
# Check frontend logs
docker-compose logs frontend

# Common issues:
# 1. Node modules - ensure npm install completed
# 2. Port conflicts - ensure 3000 is free
# 3. API connectivity - check backend is running
```

### Database Connection Issues:
```bash
# Check database status
docker-compose ps db

# Test database connection
docker-compose exec db pg_isready -U postgres

# Reset database (if needed)
docker-compose down -v
docker-compose up --build
```

## 🔄 Development Workflow

### Daily Development Flow:
1. **Start Environment**: `docker-compose up`
2. **Make Code Changes**: Edit files in your IDE
3. **Test Changes**: Changes auto-reload in browser/application
4. **Debug Issues**: Use browser DevTools or IDE debugger
5. **Commit Changes**: Git workflow as usual
6. **Stop Environment**: `docker-compose down` (optional)

### File Watching:
- **Frontend**: Vite watches all src files
- **Backend**: Spring DevTools watches class files
- **Configs**: Restart services if config changes needed

## 📚 Development Resources

### API Endpoints (Development):
- **Health Check**: http://localhost:8080/actuator/health
- **API Base**: http://localhost:8080/api/
- **WebSocket**: ws://localhost:8080/ws/

### Development Tools:
- **Database GUI**: Use pgAdmin or DBeaver with localhost:5432
- **API Testing**: Use Postman or curl
- **Log Monitoring**: Use `docker-compose logs -f`

## 🚨 Important Notes

1. **Data Persistence**: Database data is preserved between restarts
2. **Environment Isolation**: Development environment is completely isolated
3. **Resource Usage**: Development mode uses more resources (hot reloading, etc.)
4. **Network**: All services communicate via Docker network
5. **Security**: Development environment has relaxed security settings

Happy coding! 🎉
