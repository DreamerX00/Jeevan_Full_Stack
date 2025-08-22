# 🏥 Jeevan - Healthcare Management System

<div align="center">

![Jeevan Logo](https://via.placeholder.com/200x100/4A90E2/FFFFFF?text=JEEVAN)

**A comprehensive healthcare management system that connects patients, doctors, and pharmacies through a unified platform.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-2.7+-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![Kotlin](https://img.shields.io/badge/Kotlin-1.8+-purple.svg)](https://kotlinlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://docker.com/)

</div>

## 🚀 Project Overview

Jeevan is a modern, full-stack healthcare management system built with cutting-edge technologies to provide seamless healthcare services. The system connects all stakeholders in the healthcare ecosystem through an intuitive and secure platform.

### ✨ Key Features

- 👥 **Patient Management** - Comprehensive patient profiles and medical history
- 📅 **Doctor Appointments** - Easy scheduling and management system
- 📋 **Medical Records** - Secure digital health records
- 💊 **Prescription Management** - Digital prescriptions and pharmacy integration
- 🏪 **Pharmacy Integration** - Connected pharmacy network
- 🔄 **Real-time Updates** - Live notifications and updates via WebSocket
- 🔒 **Secure File Storage** - HIPAA-compliant data storage
- 📱 **Cross-Platform** - Web and mobile applications

## 🛠️ Tech Stack

<div align="center">

### Backend
![Kotlin](https://img.shields.io/badge/kotlin-%237F52FF.svg?style=for-the-badge&logo=kotlin&logoColor=white)
![Spring](https://img.shields.io/badge/spring-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Gradle](https://img.shields.io/badge/Gradle-02303A.svg?style=for-the-badge&logo=Gradle&logoColor=white)

### Frontend
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

### Mobile
![Kotlin](https://img.shields.io/badge/kotlin-%237F52FF.svg?style=for-the-badge&logo=kotlin&logoColor=white)
![Android](https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white)
![Jetpack Compose](https://img.shields.io/badge/Jetpack%20Compose-4285F4?style=for-the-badge&logo=jetpack-compose&logoColor=white)

### DevOps & Infrastructure
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white)

</div>

## 📁 Project Structure

```
🏥 jeevan/
├── 🔧 backend/                    # Spring Boot Backend
│   ├── 📂 src/                   # Source code
│   │   ├── 📂 main/
│   │   │   ├── 📂 kotlin/        # Kotlin source files
│   │   │   └── 📂 resources/     # Configuration files
│   │   └── 📂 test/              # Test files
│   ├── 🐳 Dockerfile             # Backend Docker configuration
│   ├── 📋 build.gradle.kts       # Gradle build configuration
│   └── 📄 application.properties.example  # Configuration template
├── 🌐 frontend/                   # React Web Application
│   ├── 📱 myNewApp/              # Main React application
│   │   ├── 📂 src/               # React source code
│   │   ├── 🐳 Dockerfile         # Frontend Docker configuration
│   │   ├── 📦 package.json       # Node.js dependencies
│   │   └── ⚡ vite.config.js      # Vite configuration
│   └── 📚 DEVELOPMENT_GUIDE.md   # Frontend development guide
├── 📱 android/                    # Android Mobile Application
│   ├── 📂 app/                   # Android app source
│   │   ├── 📂 src/               # Kotlin source files
│   │   └── 🔧 build.gradle.kts   # Android build configuration
│   └── 📚 DEVELOPMENT_GUIDE.md   # Android development guide
├── 🐳 docker-compose.yml         # Production Docker configuration
├── 🔧 docker-compose.override.yml # Development Docker configuration
├── 📄 README.md                  # Project documentation
└── 📚 docs/                      # Additional documentation
```

## 🐳 Docker Setup & Deployment

Jeevan is fully containerized with Docker for easy deployment and development. We provide both production and development configurations.

### 🚀 Quick Start with Docker

#### Prerequisites
- Docker & Docker Compose installed
- Git

#### 🏃‍♂️ Production Deployment

```bash
# Clone the repository
git clone https://github.com/DreamerX00/Jeevan_Full_Stack.git
cd Jeevan_Full_Stack

# Start the production environment
docker-compose up -d

# Or with build
docker-compose up --build -d
```

#### 🔧 Development Environment

For development with hot reloading and debugging:

```bash
# Start development environment
docker-compose -f docker-compose.yml -f docker-compose.override.yml up --build

# Or use the shorthand (if docker-compose.override.yml exists)
docker-compose up --build
```

### 🌐 Service URLs

| Service | Production URL | Development URL | Description |
|---------|---------------|-----------------|-------------|
| 🌐 Frontend | http://localhost:3000 | http://localhost:3000 | React Web Application |
| ⚡ Backend API | http://localhost:8080 | http://localhost:8080 | Spring Boot REST API |
| 🗄️ Database | localhost:5432 | localhost:5432 | PostgreSQL Database |
| 🐛 Debug Port | - | localhost:5005 | Backend Debug Port |
| 🔥 Vite HMR | - | localhost:24678 | Frontend Hot Reload |

### 🔧 Docker Services

#### Database (PostgreSQL 15)
- **Image**: `postgres:15-alpine`
- **Port**: `5432`
- **Features**: 
  - Automatic schema initialization
  - Health checks
  - Data persistence with volumes
  - Development/Production database separation

#### Backend (Spring Boot + Kotlin)
- **Build**: Multi-stage Docker build
- **Port**: `8080`
- **Features**:
  - JDK 21 runtime
  - Gradle build optimization
  - Debug port (development: `5005`)
  - Hot reloading (development)
  - Environment-specific configurations

#### Frontend (React + Vite)
- **Build**: Multi-stage Docker build
- **Port**: `3000`
- **Features**:
  - Node.js 20 Alpine
  - Nginx production server
  - Hot Module Replacement (development)
  - Optimized production builds
  - Terser minification

### 🎛️ Environment Configuration

#### Production Environment Variables
```env
# Database
POSTGRES_DB=jeevanDB
POSTGRES_USER=postgres
POSTGRES_PASSWORD=mydb123

# Backend
SPRING_PROFILES_ACTIVE=docker
JWT_SECRET=your-jwt-secret
CORS_ALLOWED_ORIGINS=http://localhost:3000

# Frontend
NODE_ENV=production
VITE_API_BASE_URL=http://localhost:8080
```

#### Development Environment Variables
```env
# Database
POSTGRES_DB=jeevanDB_dev

# Backend
SPRING_PROFILES_ACTIVE=dev
SPRING_DEVTOOLS_RESTART_ENABLED=true

# Frontend
NODE_ENV=development
```

### 📋 Docker Commands Cheat Sheet

```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs [service_name]

# Stop services
docker-compose down

# Rebuild specific service
docker-compose build [service_name]

# Start specific service
docker-compose up [service_name]

# Clean up volumes (⚠️ Will delete data)
docker-compose down -v

# Scale services
docker-compose up --scale backend=2
```

## ⚠️ Important Guidelines

### 🚫 Files and Directories to Never Modify
1. **Core Configuration Files**:
   - `backend/build.gradle.kts`
   - `frontend/myNewApp/package.json`
   - `android/app/build.gradle.kts`
   - `.gitignore`

2. **Security Files**:
   - `SECURITY.md`
   - `backend/src/main/resources/application.properties`
   - Any files containing credentials or secrets

3. **Documentation**:
   - `LICENSE`
   - `README.md`
   - `DEVELOPMENT_GUIDE.md` files

### 🔄 Development Workflow

<div align="center">

| Component | Technology | Commands | Guidelines |
|-----------|------------|----------|------------|
| 🔧 **Backend** | Kotlin + Spring Boot | `./gradlew bootRun` | Follow Kotlin standards, Write tests |
| 🌐 **Frontend** | React + TypeScript | `npm run dev` | Use TypeScript, Follow React patterns |
| 📱 **Android** | Kotlin + Compose | Build in Android Studio | Material Design, Write UI tests |

</div>

## 🚀 Getting Started

### 📋 Prerequisites

<div align="center">

| Requirement | Version | Purpose |
|-------------|---------|---------|
| ☕ **JDK** | 17+ | Backend development |
| 🟢 **Node.js** | 18+ | Frontend development |
| 🐘 **PostgreSQL** | 13+ | Database (if not using Docker) |
| 📱 **Android Studio** | Latest | Mobile development |
| 🐳 **Docker** | Latest | Containerization |
| 🔧 **Gradle** | 7.0+ | Build automation |

</div>

### 🐳 Recommended Setup (Docker)

**The easiest way to get started is using Docker:**

```bash
# 1. Clone the repository
git clone https://github.com/DreamerX00/Jeevan_Full_Stack.git
cd Jeevan_Full_Stack

# 2. Start development environment
docker-compose -f docker-compose.yml -f docker-compose.override.yml up --build

# 3. Access the applications
# Frontend: http://localhost:3000
# Backend API: http://localhost:8080
# Database: localhost:5432
```

### 🔧 Manual Setup (Alternative)

#### 🔧 Backend Setup

```bash
# 1. Clone the repository
git clone https://github.com/DreamerX00/Jeevan_Full_Stack
cd Jeevan_Full_Stack/backend

# 2. Configure the database
cp application.properties.example application.properties
# Edit application.properties with your database credentials

# 3. Build and run
./gradlew build
./gradlew bootRun
```

#### 🌐 Frontend Setup

```bash
# 1. Navigate to frontend directory
cd frontend/myNewApp

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

#### 📱 Android Setup

```bash
# 1. Open Android Studio
# 2. Open the 'android' directory
# 3. Sync Gradle files
# 4. Run the application
```

## 🔒 Security Guidelines

<div align="center">

### 🛡️ Security Checklist

| ✅ Do | ❌ Don't |
|-------|----------|
| Use environment variables for secrets | Commit API keys to repository |
| Follow HTTPS in production | Store passwords in plaintext |
| Validate all inputs | Trust user input directly |
| Use JWT with expiration | Use hardcoded secrets |
| Regular security audits | Ignore security warnings |

</div>

### 🔐 Environment Variables Setup

Create a `.env` file in each component:

**Backend (.env)**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=jeevanDB
DB_USERNAME=your_username
DB_PASSWORD=your_password
JWT_SECRET=your-super-secret-jwt-key
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

**Frontend (.env)**
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_WEBSOCKET_URL=ws://localhost:8080
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### 📝 Contribution Process

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/AmazingFeature

# 3. Commit your changes
git commit -m 'Add some AmazingFeature'

# 4. Push to the branch
git push origin feature/AmazingFeature

# 5. Open a Pull Request
```

### 📋 Pull Request Guidelines

- ✅ Write clear commit messages
- ✅ Add tests for new features
- ✅ Update documentation
- ✅ Follow code style guidelines
- ✅ Ensure all tests pass

## 📊 API Documentation

### 🔗 REST API Endpoints

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| 📝 POST | `/api/auth/register` | User registration | ❌ |
| 🔐 POST | `/api/auth/login` | User login | ❌ |
| 👤 GET | `/api/users/profile` | Get user profile | ✅ |
| 📅 GET | `/api/appointments` | List appointments | ✅ |
| 📋 POST | `/api/appointments` | Create appointment | ✅ |
| 💊 GET | `/api/prescriptions` | List prescriptions | ✅ |

### 🔌 WebSocket Events

| Event | Description | Payload |
|-------|-------------|---------|
| `appointment.created` | New appointment | `{ appointmentId, patientId, doctorId }` |
| `prescription.updated` | Prescription change | `{ prescriptionId, status }` |
| `notification.new` | New notification | `{ message, type, timestamp }` |

## 🧪 Testing

### 🔧 Backend Testing
```bash
# Run all tests
./gradlew test

# Run specific test class
./gradlew test --tests UserServiceTest

# Generate test report
./gradlew jacocoTestReport
```

### 🌐 Frontend Testing
```bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

### 📱 Android Testing
```bash
# Run unit tests
./gradlew test

# Run instrumented tests
./gradlew connectedAndroidTest
```

## 📈 Performance & Monitoring

### 📊 Metrics

- **Backend**: Spring Boot Actuator endpoints
- **Frontend**: Vite build analyzer
- **Database**: PostgreSQL performance insights
- **Mobile**: Android profiling tools

### 🔍 Health Checks

| Service | Endpoint | Status |
|---------|----------|--------|
| Backend | `http://localhost:8080/actuator/health` | ✅ Active |
| Database | `docker-compose ps` | ✅ Healthy |
| Frontend | `http://localhost:3000` | ✅ Running |

## 📦 Versioning & Releases

We use [SemVer](http://semver.org/) for versioning.

### 🏷️ Current Version: `v1.0.0`

### 📋 Release Notes
- ✨ Initial release with core features
- 🐳 Docker containerization
- 🔐 JWT authentication
- 📱 Cross-platform support

## 📞 Support & Community

<div align="center">

### 💬 Get Help

[![Email](https://img.shields.io/badge/Email-akashsinghaa008%40gmail.com-red.svg)](mailto:akashsinghaa008@gmail.com)
[![GitHub Issues](https://img.shields.io/badge/GitHub-Issues-green.svg)](https://github.com/DreamerX00/Jeevan_Full_Stack/issues)
[![Documentation](https://img.shields.io/badge/Docs-Available-blue.svg)](./docs/)

</div>

### 🐛 Reporting Issues

1. Check existing issues first
2. Use issue templates
3. Provide detailed reproduction steps
4. Include environment information

### 💡 Feature Requests

1. Open a GitHub issue
2. Use the feature request template
3. Describe the use case
4. Provide mockups if applicable

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

<div align="center">

### 🌟 Show Your Support

If this project helped you, please consider giving it a ⭐️!

[![GitHub stars](https://img.shields.io/github/stars/DreamerX00/Jeevan_Full_Stack.svg?style=social&label=Star)](https://github.com/DreamerX00/Jeevan_Full_Stack)
[![GitHub forks](https://img.shields.io/github/forks/DreamerX00/Jeevan_Full_Stack.svg?style=social&label=Fork)](https://github.com/DreamerX00/Jeevan_Full_Stack/fork)

---

**Made with ❤️ by the Jeevan Team**

</div>
