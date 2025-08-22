# 🏥 Jeevan Project Information Guide

## 📁 Project Structure Overview

```
🏥 jeevan/
├── 🔧 backend/                    # Spring Boot Backend (Kotlin + JDK 21)
│   ├── 📂 src/                   # Source code
│   │   ├── 📂 main/              # Main application code
│   │   │   ├── 📂 kotlin/        # Kotlin source files
│   │   │   └── 📂 resources/     # Configuration & schema files
│   │   └── 📂 test/              # Test code
│   ├── 🐳 Dockerfile             # Backend containerization
│   ├── 📋 build.gradle.kts       # Gradle build configuration (Spring Boot 3.4.3)
│   └── 📄 application.properties.example  # Configuration template
├── 🌐 frontend/                   # React Web Application (React 19 + Vite 6.2)
│   ├── 📱 myNewApp/              # Main React application
│   │   ├── 📂 src/               # Source code
│   │   │   ├── 📂 components/    # Reusable UI components
│   │   │   ├── 📂 pages/         # Page components
│   │   │   ├── 📂 context/       # React context providers
│   │   │   ├── 📂 services/      # API services
│   │   │   ├── 📂 hooks/         # Custom React hooks
│   │   │   ├── 📂 store/         # State management (Zustand)
│   │   │   ├── 📂 utils/         # Utility functions
│   │   │   └── 📂 assets/        # Static assets
│   │   ├── 📂 public/            # Static files
│   │   ├── 🐳 Dockerfile         # Frontend containerization
│   │   ├── 🔒 .env.example       # Environment variables template
│   │   └── 📦 package.json       # Dependencies (npm)
│   └── 📚 Information.md         # Frontend documentation
├── 📱 android/                    # Android Mobile Application (Kotlin + Compose)
│   ├── 📂 app/                   # Android app source
│   │   ├── 📂 src/               # Kotlin source code
│   │   └── 🔧 build.gradle.kts   # Android build configuration
│   ├── 📂 gradle/                # Gradle wrapper & libs.versions.toml
│   │   └── 📄 libs.versions.toml # Version catalog (Compose BOM 2025.05.00)
│   └── 📚 Information.md         # Android documentation
├── 🐳 docker-compose.yml         # Production Docker configuration
├── 🔧 docker-compose.override.yml # Development Docker configuration
├── 📚 DEVELOPMENT_GUIDE.md       # Comprehensive development guide
├── 📄 README.md                  # Project overview & setup
└── 📚 docs/                      # Additional documentation
```

## 🚫 Critical Files and Directories

### ⛔ Files That Should Never Be Modified

1. **🔧 Core Configuration Files:**
   - `backend/build.gradle.kts` (Spring Boot 3.4.3, Kotlin 1.9.25)
   - `frontend/myNewApp/package.json` (React 19, Vite 6.2.0)
   - `android/app/build.gradle.kts` (AGP 8.11.0, Kotlin 2.1.0)
   - `android/gradle/libs.versions.toml` (Compose BOM 2025.05.00)
   - `.gitignore`
   - `docker-compose.yml` & `docker-compose.override.yml`

2. **🔒 Security Files:**
   - `SECURITY.md`
   - `backend/src/main/resources/application.properties`
   - `frontend/myNewApp/.env` (never commit this file)
   - Any files containing credentials, API keys, or secrets

3. **📚 Documentation:**
   - `LICENSE`
   - `README.md`
   - `Information.md` files across all components
   - `DEVELOPMENT_GUIDE.md` files

### ⚠️ Files That Require Special Attention

1. **🔒 Environment Files:**
   - Always use `.env.example` as a template
   - Never commit actual `.env` files to version control
   - Keep sensitive data in environment variables
   - **Google Maps API**: Set `VITE_GOOGLE_MAPS_API_KEY` in .env file
   - **Firebase**: Configure in environment variables, not hardcoded
   - **JWT Secrets**: Use strong, randomly generated secrets

2. **🗄️ Database Files:**
   - Never commit database dumps or backups
   - Use migrations for schema changes (Spring Boot JPA)
   - Keep schema.sql for Docker initialization
   - PostgreSQL 15 Alpine in production

3. **📦 Build Output (Never Commit):**
   - `build/` directories (Gradle/Android builds)
   - `node_modules/` (npm dependencies)
   - `.gradle/` directories (Gradle cache)
   - `dist/` (Vite build output)

## 🛠️ Development Guidelines

### 🔧 Backend Development (Spring Boot 3.4.3 + Kotlin 1.9.25)

1. **📂 Code Organization:**
   - Follow package structure in `backend/src/main/kotlin/com/jeevan/backend/`
   - Controllers in `controllers` package
   - Services in `services` package  
   - Models/Entities in `model` package
   - Repositories in `repository` package
   - Security configs in `security` package

2. **🧪 Testing:**
   - Unit tests for all services (JUnit 5 + Kotlin)
   - Integration tests for controllers (MockMvc)
   - Maintain test coverage above 80%
   - Use TestContainers for database testing

3. **📖 Documentation:**
   - Document all public APIs with OpenAPI/Swagger
   - Keep API documentation current
   - Document database schema changes
   - Use KDoc for Kotlin documentation

4. **🔧 Current Tech Stack:**
   - **Framework**: Spring Boot 3.4.3
   - **Language**: Kotlin 1.9.25 (JDK 21)
   - **Database**: PostgreSQL 15 Alpine
   - **Security**: Spring Security + JWT (jjwt 0.11.5)
   - **Build**: Gradle 8.5+ with Kotlin DSL
   - **Container**: Docker multi-stage builds

### 🌐 Frontend Development (React 19 + Vite 6.2.0)

1. **📂 Code Organization:**
   - Components in `src/components/` (reusable UI)
   - Pages in `src/pages/` (route components)
   - Services in `src/services/` (API layer)
   - Types in `src/types/` (TypeScript definitions)
   - Hooks in `src/hooks/` (custom React hooks)
   - State in `src/store/` (Zustand state management)

2. **🎨 State Management & Styling:**
   - **State**: Zustand 5.0+ (replacing Redux)
   - **Styling**: Tailwind CSS 3.4+ with responsive design
   - **Icons**: Lucide React 0.515+ and React Icons 4.12+
   - **UI Components**: Material-UI 7.1+ with Emotion
   - **Animations**: Framer Motion 12.18+

3. **🔧 Modern React Patterns:**
   - React 19 features (Server Components ready)
   - TypeScript for type safety
   - Custom hooks for logic reuse
   - Context for theme/auth only
   - Hot Module Replacement in development

4. **🗺️ Maps Integration:**
   - **Google Maps**: React Google Maps API 2.20.6
   - API key in environment: `VITE_GOOGLE_MAPS_API_KEY`
   - Places API for hospital/pharmacy search
   - Directions API for navigation
   - **Security**: Never hardcode API keys

5. **🔧 Current Tech Stack:**
   - **Framework**: React 19.0.0
   - **Build Tool**: Vite 6.2.0 with Terser 5.36.0
   - **Language**: TypeScript with strict mode
   - **State**: Zustand 5.0.5
   - **Routing**: React Router DOM 6.30.1
   - **HTTP**: Axios 1.9.0
   - **WebSocket**: Socket.io Client 4.8.1
   - **Forms**: React Hook Form with validation

### 📱 Android Development (Kotlin 2.1.0 + Jetpack Compose)

1. **🏗️ Architecture:**
   - **Pattern**: MVVM with Clean Architecture
   - **UI**: Jetpack Compose with Material 3
   - **Navigation**: Compose Navigation 2.9.0
   - **State**: Compose State + ViewModel
   - **DI**: Hilt (if implemented)

2. **📂 Code Organization:**
   - `presentation/` - UI layer (Composables, ViewModels)
   - `domain/` - Business logic (Use Cases, Repositories)
   - `data/` - Data layer (API, Database, Repositories Impl)
   - Follow Android Architecture Guidelines

3. **🎨 UI Development:**
   - **Compose BOM**: 2025.05.00
   - **Material 3**: Latest design system
   - **Responsive**: Support different screen sizes
   - **Accessibility**: TalkBack and accessibility features
   - **Theme**: Dynamic colors and dark mode

4. **🔧 Current Tech Stack:**
   - **Language**: Kotlin 2.1.0
   - **UI**: Jetpack Compose (BOM 2025.05.00)
   - **Build**: Android Gradle Plugin 8.11.0
   - **Target SDK**: Latest Android (API 35+)
   - **Network**: Retrofit 2.9.0 + OkHttp 4.12.0
   - **Maps**: Google Maps Compose 4.3.0

## 🔒 Security Guidelines

### 🛡️ Authentication & Authorization
- **JWT**: Secure token-based authentication
- **Refresh Tokens**: Implement token rotation
- **Storage**: Secure token storage (Android Keystore, Secure Storage)
- **Expiration**: Proper token lifecycle management

### 🔐 Data Protection
- **Encryption**: Encrypt sensitive data at rest
- **HTTPS**: All API communications over TLS
- **CORS**: Properly configured for frontend domains
- **Validation**: Input validation and sanitization

### 🔑 API Security
- **Rate Limiting**: Implement API rate limits
- **Authentication**: Protected endpoints
- **File Uploads**: Validate file types and sizes
- **SQL Injection**: Use parameterized queries (JPA handles this)

### 🗝️ API Keys Management
- **Environment Variables**: Store in .env files only
- **Never Commit**: API keys to version control
- **Google Maps API:**
  - Restrict by HTTP referrer in Google Cloud Console
  - Enable only required APIs (Maps, Places, Directions)
  - Monitor usage and set quotas
  - Rotate keys if compromised

## 🐳 Docker Deployment Guidelines

### 🚀 Production Deployment (docker-compose.yml)
- **Database**: PostgreSQL 15 Alpine with persistent volumes
- **Backend**: Multi-stage build with JDK 21
- **Frontend**: Nginx Alpine with optimized React build
- **Network**: Isolated Docker network for security
- **Health Checks**: Database health monitoring

### 🔧 Development Environment (docker-compose.override.yml)
- **Hot Reloading**: Live code changes without rebuild
- **Debug Ports**: Backend debug port 5005, Vite HMR 24678
- **Volume Mounts**: Source code mounted for development
- **Separate Database**: Development database isolation

### 📊 Service Configuration

| Service | Production Port | Debug Port | Technology |
|---------|----------------|------------|------------|
| 🌐 Frontend | 3000 | 3000 + 24678 (HMR) | React 19 + Vite 6.2 |
| 🔧 Backend | 8080 | 8080 + 5005 (Debug) | Spring Boot 3.4.3 |
| 🗄️ Database | 5432 | 5432 | PostgreSQL 15 Alpine |

### 🛠️ Docker Commands
```bash
# Production
docker-compose up -d

# Development with hot reload
docker-compose -f docker-compose.yml -f docker-compose.override.yml up

# Rebuild specific service
docker-compose build [service]

# View logs
docker-compose logs [service]
```

## 📈 Performance & Maintenance Guidelines

### 🔧 Backend Performance
- **Connection Pooling**: HikariCP for database connections
- **Caching**: Redis for session and data caching (if implemented)
- **JVM Tuning**: Optimized for containerized environments
- **Monitoring**: Spring Boot Actuator endpoints

### 🌐 Frontend Performance
- **Code Splitting**: Vite automatic code splitting
- **Bundle Analysis**: Monitor build sizes
- **Image Optimization**: WebP format support
- **Caching**: Browser caching strategies
- **CDN**: Static asset delivery optimization

### 📱 Android Performance
- **R8/ProGuard**: Code shrinking and obfuscation
- **APK Optimization**: App Bundle for Play Store
- **Memory Management**: Lifecycle-aware components
- **Network**: Efficient API calls with caching

### 🔄 Dependency Management
1. **Regular Updates**:
   - Security patches for all dependencies
   - Major version updates with testing
   - Monitor vulnerability reports

2. **Version Compatibility**:
   - Spring Boot 3.4.3 with JDK 21
   - React 19 with Node.js 18+
   - Android AGP 8.11.0 with Kotlin 2.1.0

3. **Quality Checks**:
   - Run linters and formatters
   - Code quality analysis
   - Performance profiling

## 🗺️ Google Maps Integration (Updated)

### 🔧 API Setup & Configuration
1. **Google Cloud Console**:
   - Enable Maps JavaScript API, Places API, Directions API
   - Create API key with HTTP referrer restrictions
   - Set daily quotas and billing alerts

2. **Environment Setup**:
   ```env
   # Frontend .env
   VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

3. **Component Architecture**:
   - `GoogleMapComponent`: Main map display and interaction
   - `NearbyHospitals`: Hospital search and listing
   - `NearbyPharmacies`: Pharmacy search with hours
   - `DirectionService`: Navigation and route planning

### 🏥 Business Logic
- **Hospitals**: Assume 24/7 operation (emergency services)
- **Pharmacies**: Check actual business hours via Places API
- **Search Radius**: Configurable distance for nearby places
- **Caching**: Cache place details to reduce API calls

### 🔍 Troubleshooting
- **Maps not loading**: Check API key, quotas, and network
- **Place details missing**: Verify Places API is enabled
- **Directions not working**: Check Directions API permissions

## 📞 Support and Resources

### 📚 Documentation Hierarchy
1. **README.md**: Project overview and quick start
2. **Information.md**: Detailed technical information (this file)
3. **DEVELOPMENT_GUIDE.md**: Step-by-step development setup
4. **Component-specific Information.md**: Detailed component docs

### 🛠️ Development Tools
- **IDEs**: IntelliJ IDEA (Backend), VS Code (Frontend), Android Studio (Mobile)
- **Version Control**: Git with conventional commits
- **CI/CD**: GitHub Actions (if configured)
- **Monitoring**: Docker logs, Spring Boot Actuator

### 💬 Communication & Support
- **Issues**: Use GitHub Issues with templates
- **Pull Requests**: Follow PR guidelines and code review
- **Documentation**: Keep all docs updated with changes
- **Security**: Report security issues privately first

### 🚀 Future Roadmap
- **Microservices**: Break monolith into services
- **Message Queue**: Event-driven architecture
- **PWA**: Progressive Web App features
- **Analytics**: User behavior and performance tracking
- **Internationalization**: Multi-language support 