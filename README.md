# Jeevan - Healthcare Management System

A comprehensive healthcare management system that connects patients, doctors, and pharmacies through a unified platform.

## Project Overview

Jeevan is a full-stack healthcare management system built with modern technologies to provide seamless healthcare services. The system includes:

- Patient management
- Doctor appointments
- Medical records
- Prescription management
- Pharmacy integration
- Real-time updates
- Secure file storage

## Tech Stack

### Backend
- Kotlin
- Spring Boot
- PostgreSQL
- JWT Authentication
- WebSocket
- Gradle

### Frontend (Web)
- React
- TypeScript
- Material-UI
- Redux Toolkit
- WebSocket Client

### Mobile (Android)
- Kotlin
- Jetpack Compose
- Retrofit
- Room Database
- WebSocket Client

## Project Structure

```
jeevan/
├── backend/                 # Spring Boot Backend
│   ├── src/                # Source code
│   ├── build.gradle.kts    # Gradle build configuration
│   └── application.properties.example  # Configuration template
├── frontend/               # React Web Application
│   ├── myNewApp/          # Main React application
│   └── DEVELOPMENT_GUIDE.md # Frontend development guide
├── android/               # Android Mobile Application
│   ├── app/              # Android app source
│   └── DEVELOPMENT_GUIDE.md # Android development guide
└── docs/                  # Documentation
```

## Important Guidelines

### Files and Directories to Never Modify
1. Core Configuration Files:
   - `backend/build.gradle.kts`
   - `frontend/myNewApp/package.json`
   - `android/app/build.gradle.kts`
   - `.gitignore`

2. Security Files:
   - `SECURITY.md`
   - `backend/src/main/resources/application.properties`
   - Any files containing credentials or secrets

3. Documentation:
   - `LICENSE`
   - `README.md`
   - `DEVELOPMENT_GUIDE.md` files

### Development Workflow

1. **Backend Development**:
   - Follow the backend development guide
   - Use Kotlin coding standards
   - Write unit tests for new features
   - Document API changes

2. **Frontend Development**:
   - Follow the frontend development guide
   - Use TypeScript for type safety
   - Follow React best practices
   - Write component tests

3. **Android Development**:
   - Follow the Android development guide
   - Use Jetpack Compose
   - Follow Material Design guidelines
   - Write UI tests

## Getting Started

### Prerequisites

- JDK 17 or higher
- Node.js 16 or higher
- PostgreSQL 13 or higher
- Android Studio (for mobile development)
- Gradle 7.0 or higher

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/jeevan.git
   cd jeevan/backend
   ```

2. Configure the database:
   - Copy `application.properties.example` to `application.properties`
   - Update database credentials and other configurations

3. Build and run:
   ```bash
   ./gradlew build
   ./gradlew bootRun
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend/myNewApp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm start
   ```

### Android Setup

1. Open Android Studio
2. Open the `android` directory
3. Sync Gradle files
4. Run the application

## Security Guidelines

1. Never commit sensitive information:
   - API keys
   - Database credentials
   - JWT secrets
   - Environment variables

2. Always use environment variables for sensitive data
3. Follow security best practices in each component
4. Review security documentation regularly

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Versioning

We use [SemVer](http://semver.org/) for versioning. Current version: 1.0.0

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@jeevan.com or create an issue in the repository.
