# 🔧 Backend Application Information

## 🛠️ Technology Stack (Latest Versions)

| Technology | Version | Purpose |
|------------|---------|---------|
| **🔧 Framework** | Spring Boot 3.4.3 | Core application framework |
| **☕ Language** | Kotlin 1.9.25 | Primary programming language |
| **🏗️ Runtime** | JDK 21 | Java runtime environment |
| **📦 Build System** | Gradle 8.5+ (Kotlin DSL) | Build automation |
| **🗄️ Database** | PostgreSQL 15 Alpine | Primary database |
| **🔒 Security** | Spring Security 6.x | Authentication & authorization |
| **📋 API Docs** | OpenAPI 3 / Swagger | API documentation |
| **🐳 Container** | Docker Multi-stage | Containerization |

## 📚 Key Dependencies & Versions

### 🏗️ Core Spring Boot Starters
```kotlin
dependencies {
    implementation("org.springframework.boot:spring-boot-starter-actuator")       // Health checks & metrics
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")       // Database operations
    implementation("org.springframework.boot:spring-boot-starter-security")       // Security framework
    implementation("org.springframework.boot:spring-boot-starter-validation")     // Input validation
    implementation("org.springframework.boot:spring-boot-starter-web")            // REST API
    implementation("org.springframework.boot:spring-boot-starter-mail")           // Email functionality
    implementation("org.springframework.boot:spring-boot-starter-websocket")      // Real-time communication
}
```

### 🔐 Security & Authentication
```kotlin
// JWT Token Management
implementation("io.jsonwebtoken:jjwt-api:0.11.5")
runtimeOnly("io.jsonwebtoken:jjwt-impl:0.11.5")
runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.11.5")
```

### 🗄️ Database & Persistence
```kotlin
runtimeOnly("org.postgresql:postgresql")        // PostgreSQL JDBC driver
runtimeOnly("com.h2database:h2")               // H2 for testing
```

### 🧪 Testing Framework
```kotlin
testImplementation("org.springframework.boot:spring-boot-starter-test")  // Spring Boot Test
testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")           // Kotlin + JUnit 5
// testImplementation("org.testcontainers:postgresql")                  // TestContainers (if needed)
```

## 📁 Project Structure (Detailed)

```
🔧 backend/
├── 📂 src/
│   ├── 📂 main/
│   │   ├── 📂 kotlin/com/jeevan/backend/
│   │   │   ├── 📂 config/              # Configuration classes
│   │   │   │   ├── SecurityConfig.kt   # Spring Security configuration
│   │   │   │   ├── WebConfig.kt        # Web MVC configuration
│   │   │   │   └── DatabaseConfig.kt   # Database configuration
│   │   │   ├── 📂 controller/          # REST controllers
│   │   │   │   ├── AuthController.kt   # Authentication endpoints
│   │   │   │   ├── UserController.kt   # User management
│   │   │   │   └── HealthController.kt # Health check endpoints
│   │   │   ├── 📂 model/              # Data models & entities
│   │   │   │   ├── User.kt            # User entity
│   │   │   │   ├── Role.kt            # Role enumeration
│   │   │   │   └── BaseEntity.kt      # Common entity fields
│   │   │   ├── 📂 repository/         # Data access layer
│   │   │   │   ├── UserRepository.kt  # User data operations
│   │   │   │   └── BaseRepository.kt  # Common repository methods
│   │   │   ├── 📂 service/            # Business logic
│   │   │   │   ├── UserService.kt     # User business logic
│   │   │   │   ├── AuthService.kt     # Authentication logic
│   │   │   │   └── EmailService.kt    # Email functionality
│   │   │   ├── 📂 security/           # Security components
│   │   │   │   ├── JwtTokenProvider.kt # JWT token management
│   │   │   │   ├── UserPrincipal.kt   # Security user details
│   │   │   │   └── JwtAuthFilter.kt   # JWT authentication filter
│   │   │   ├── 📂 dto/                # Data Transfer Objects
│   │   │   │   ├── LoginRequest.kt    # Login request DTO
│   │   │   │   ├── LoginResponse.kt   # Login response DTO
│   │   │   │   └── UserDto.kt         # User DTO
│   │   │   └── 📂 exception/          # Exception handling
│   │   │       ├── GlobalExceptionHandler.kt # Global error handling
│   │   │       └── CustomExceptions.kt       # Custom exception classes
│   │   └── 📂 resources/
│   │       ├── 📄 application.yml     # Main configuration
│   │       ├── 📄 application-dev.yml # Development configuration
│   │       ├── 📄 application-docker.yml # Docker configuration
│   │       └── 🗄️ schema.sql         # Database initialization
│   └── 📂 test/                       # Test files
│       ├── 📂 kotlin/                 # Kotlin test files
│       │   ├── 📂 integration/        # Integration tests
│       │   ├── 📂 unit/              # Unit tests
│       │   └── 📂 security/          # Security tests
│       └── 📂 resources/             # Test resources
├── 🐳 Dockerfile                     # Multi-stage Docker build
├── 📋 build.gradle.kts               # Gradle build script
├── ⚙️ gradle.properties              # Gradle properties
├── 📄 settings.gradle.kts            # Gradle settings
└── 📚 Information.md                 # This documentation
```

## 🌐 API Endpoints (REST API)

### 🔐 Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| 📝 POST | `/api/auth/register` | User registration | ❌ |
| 🔐 POST | `/api/auth/login` | User authentication | ❌ |
| 🔄 POST | `/api/auth/refresh` | Refresh JWT token | ❌ |
| 🔑 POST | `/api/auth/forgot-password` | Password reset request | ❌ |
| 🔒 POST | `/api/auth/reset-password` | Password reset confirmation | ❌ |
| 🚪 POST | `/api/auth/logout` | User logout | ✅ |

### 👤 User Management Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| 👀 GET | `/api/users/profile` | Get user profile | ✅ |
| ✏️ PUT | `/api/users/profile` | Update user profile | ✅ |
| 🗑️ DELETE | `/api/users/profile` | Delete user account | ✅ |
| 📋 GET | `/api/users/me` | Get current user info | ✅ |

### 🏥 Healthcare Endpoints (Future)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| 📅 GET | `/api/appointments` | List user appointments | ✅ |
| 📝 POST | `/api/appointments` | Create new appointment | ✅ |
| 💊 GET | `/api/prescriptions` | List user prescriptions | ✅ |
| 🏥 GET | `/api/hospitals/nearby` | Find nearby hospitals | ✅ |

### 🔍 Health & Monitoring
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| ❤️ GET | `/actuator/health` | Application health status | ❌ |
| 📊 GET | `/actuator/metrics` | Application metrics | ❌ |
| ℹ️ GET | `/actuator/info` | Application information | ❌ |

## 🗄️ Database Schema (PostgreSQL 15)

### 👥 Users Table
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL DEFAULT 'USER',
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(10),
    profile_picture_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_role CHECK (role IN ('USER', 'ADMIN', 'DOCTOR', 'PHARMACIST'))
);
```

### 🔐 Authentication Tokens (Future)
```sql
CREATE TABLE refresh_tokens (
    id BIGSERIAL PRIMARY KEY,
    token VARCHAR(500) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL REFERENCES users(id),
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 📋 Audit Logs
```sql
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(255),
    entity_id BIGINT,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔒 Security Features

### 🛡️ Authentication & Authorization
- **JWT-based Authentication**: Stateless token-based auth
- **Password Encryption**: BCrypt with strong salt rounds
- **Role-based Access Control**: USER, ADMIN, DOCTOR, PHARMACIST roles
- **Token Expiration**: Configurable JWT expiration times
- **Refresh Tokens**: Secure token renewal mechanism

### 🌐 Web Security
- **CORS Configuration**: Configurable allowed origins
- **CSRF Protection**: Enabled for state-changing operations
- **Rate Limiting**: API endpoint rate limiting (future)
- **Input Validation**: Bean validation with custom constraints
- **SQL Injection Prevention**: JPA/Hibernate parameterized queries

### 🔐 Security Headers
```yaml
security:
  headers:
    frame-options: DENY
    content-type-options: nosniff
    xss-protection: 1; mode=block
    hsts: max-age=31536000; includeSubDomains
```

## ⚙️ Configuration Management

### 🔧 Application Profiles
```yaml
# application.yml (default)
spring:
  profiles:
    active: dev
  application:
    name: jeevan-backend

# application-dev.yml (development)
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/jeevanDB_dev
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true

# application-docker.yml (Docker environment)
spring:
  datasource:
    url: jdbc:postgresql://db:5432/jeevanDB
  jpa:
    hibernate:
      ddl-auto: validate
```

### 🔑 Environment Variables
```bash
# Database Configuration
JDBC_URL=jdbc:postgresql://db:5432/jeevanDB
DB_USERNAME=postgres
DB_PASSWORD=mydb123

# Security Configuration
JWT_SECRET=your-super-secure-jwt-secret-key
JWT_EXPIRATION=86400000  # 24 hours in milliseconds

# Email Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://frontend:3000
```

## 🐳 Docker Integration

### 📦 Multi-stage Build
```dockerfile
# Build stage
FROM gradle:8.5-jdk21 AS build
WORKDIR /app
COPY . .
RUN ./gradlew build --no-daemon -x test

# Runtime stage
FROM openjdk:21-jre-slim
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1
CMD ["java", "-jar", "app.jar"]
```

### 🔧 Docker Compose Integration
- **Development**: Hot reloading with volume mounts
- **Production**: Optimized builds with health checks
- **Database**: PostgreSQL 15 Alpine with persistent volumes
- **Network**: Isolated Docker network for service communication

## 🧪 Testing Strategy

### 🔬 Unit Testing (JUnit 5 + Kotlin)
```kotlin
@ExtendWith(MockitoExtension::class)
class UserServiceTest {
    @Mock private lateinit var userRepository: UserRepository
    @InjectMocks private lateinit var userService: UserService
    
    @Test
    fun `should create user successfully`() {
        // Test implementation
    }
}
```

### 🔗 Integration Testing
```kotlin
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
class UserControllerIntegrationTest {
    @Container
    val postgres = PostgreSQLContainer("postgres:15-alpine")
    
    @Test
    fun `should register user via API`() {
        // Integration test implementation
    }
}
```

### 🛡️ Security Testing
- Authentication flow testing
- Authorization testing
- JWT token validation
- CORS configuration testing
- Input validation testing

### 📊 Test Coverage Goals
- **Unit Tests**: 90%+ code coverage
- **Integration Tests**: All API endpoints
- **Security Tests**: Authentication/authorization flows
- **Performance Tests**: Load testing for critical endpoints

## 🚀 Performance Optimizations

### 🔄 Database Optimizations
- **Connection Pooling**: HikariCP with optimized settings
- **Query Optimization**: JPA query optimization and indexing
- **Lazy Loading**: Efficient entity loading strategies
- **Batch Processing**: Bulk operations for large datasets

### 📱 Application Performance
- **Caching**: Spring Cache abstraction (Redis ready)
- **Async Operations**: CompletableFuture for non-blocking operations
- **Connection Reuse**: HTTP client connection pooling
- **Memory Management**: JVM tuning for containerized environments

### 🔍 Monitoring & Observability

#### 📊 Spring Boot Actuator Endpoints
```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: when-authorized
```

#### 📈 Available Metrics
- **JVM Metrics**: Memory, GC, threads
- **HTTP Metrics**: Request counts, response times
- **Database Metrics**: Connection pool, query performance
- **Custom Metrics**: Business-specific metrics

#### 🔍 Health Checks
```kotlin
@Component
class DatabaseHealthIndicator : HealthIndicator {
    override fun health(): Health {
        return try {
            // Database connectivity check
            Health.up().withDetail("database", "Available").build()
        } catch (e: Exception) {
            Health.down(e).build()
        }
    }
}
```

## 🚀 Deployment & DevOps

### 🌍 Environment-Specific Deployments
- **Development**: Local development with H2/PostgreSQL
- **Docker**: Containerized with Docker Compose
- **Staging**: Pre-production environment (future)
- **Production**: Kubernetes deployment (future)

### 📋 CI/CD Pipeline (Future)
```yaml
# .github/workflows/backend.yml
name: Backend CI/CD
on:
  push:
    paths: ['backend/**']
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          java-version: '21'
      - run: ./gradlew test
      - run: ./gradlew build
```

### 🔧 Infrastructure as Code
- **Docker**: Multi-stage optimized builds
- **Kubernetes**: Helm charts for deployment (future)
- **Monitoring**: Prometheus + Grafana (future)
- **Logging**: ELK Stack integration (future)

## 🔮 Future Improvements & Roadmap

### 🏗️ Architecture Enhancements
- **Microservices**: Break monolith into domain services
- **Event-Driven**: Apache Kafka for event streaming
- **CQRS**: Command Query Responsibility Segregation
- **API Gateway**: Centralized API management

### 🔐 Security Enhancements
- **OAuth 2.0/OIDC**: Third-party authentication
- **API Rate Limiting**: Redis-based rate limiting
- **Audit Logging**: Comprehensive audit trail
- **Encryption**: Field-level encryption for sensitive data

### 📊 Observability & Monitoring
- **Distributed Tracing**: Jaeger/Zipkin integration
- **APM**: Application Performance Monitoring
- **Log Aggregation**: Centralized logging with ELK
- **Alerting**: PrometheusAlert Manager

### 🚀 Performance & Scalability
- **Caching Layer**: Redis for distributed caching
- **Database Sharding**: Horizontal database scaling
- **Load Balancing**: Multiple instance deployment
- **CDN Integration**: Static content delivery

### 📱 API Evolution
- **GraphQL**: Flexible API queries
- **API Versioning**: Backward-compatible API evolution
- **OpenAPI 3.1**: Enhanced API documentation
- **Webhook Support**: Event-driven integrations

## 📚 Development Best Practices

### 🔧 Code Quality
- **Kotlin Conventions**: Follow Kotlin coding standards
- **Documentation**: KDoc for public APIs
- **Linting**: Ktlint for code formatting
- **Static Analysis**: Detekt for code quality

### 🔄 Git Workflow
- **Conventional Commits**: Structured commit messages
- **Feature Branches**: GitFlow or GitHub Flow
- **Code Reviews**: Mandatory PR reviews
- **Automated Testing**: CI pipeline validation

### 📋 Maintenance
- **Dependency Updates**: Regular security updates
- **Performance Monitoring**: Continuous performance tracking
- **Backup Strategy**: Database backup and recovery
- **Documentation**: Keep technical docs current 