# Jeevan - Healthcare Management System

A comprehensive healthcare management system built with modern technologies, featuring a Kotlin Android app, Spring Boot backend, and React frontend.

## Project Overview

Jeevan is a full-stack healthcare management system that provides:
- Patient management
- Medical records
- Appointment scheduling
- Authentication and authorization
- Cross-platform access (Web, Mobile)

## Technology Stack

### Mobile Application (Kotlin)
- Kotlin with Jetpack Compose
- Material3 Design
- MVVM Architecture
- Coroutines for async operations
- Retrofit for API calls

### Backend (Spring Boot)
- Kotlin with Spring Boot
- PostgreSQL Database
- JWT Authentication
- RESTful APIs
- Spring Security

### Web Frontend (React)
- React with TypeScript
- Material-UI
- Redux Toolkit
- Vite build system
- Axios for API calls

## Project Structure
```
.
├── Kotlin_Application/     # Android mobile app
├── backend/               # Spring Boot backend
├── frontend/             # React web application
├── docker-compose.yml    # Docker configuration
└── DOCKER_README.md      # Docker setup guide
```

## Quick Start

### Prerequisites
- Docker and Docker Compose
- JDK 17 or later
- Node.js 16+ (for local frontend development)
- Android Studio (for mobile development)

### Using Docker (Recommended)
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd jeevan
   ```

2. Start all services:
   ```bash
   docker-compose up --build
   ```

3. Access the applications:
   - Web Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - PostgreSQL: localhost:5432

### Manual Setup

#### Backend
1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Build and run:
   ```bash
   ./gradlew build
   java -jar build/libs/*.jar
   ```

#### Frontend
1. Navigate to frontend directory:
   ```bash
   cd frontend/my_app
   ```

2. Install dependencies and run:
   ```bash
   npm install
   npm run dev
   ```

#### Android App
1. Open Kotlin_Application in Android Studio
2. Sync Gradle files
3. Run on emulator or physical device

## Features

### Authentication
- Secure login/registration
- Password recovery
- JWT-based authentication
- Role-based access control

### User Interface
- Modern Material Design
- Responsive layouts
- Dark/Light themes
- Custom loading indicators
- Animated transitions

### Data Management
- Real-time updates
- Offline support
- Data synchronization
- Secure storage

## Development

### Code Style
- Follow Kotlin style guide for Android and backend
- Use ESLint and Prettier for frontend
- Maintain consistent naming conventions

### Testing
- Unit tests for all components
- Integration tests for backend
- UI tests for frontend
- E2E tests for critical flows

### Documentation
- API documentation with Swagger
- Component documentation
- Setup guides
- Architecture diagrams

## Docker Support

The project is containerized using Docker for consistent development and deployment environments. See [DOCKER_README.md](DOCKER_README.md) for detailed Docker setup instructions.

### Key Docker Features
- Multi-stage builds
- Environment configuration
- Volume management
- Network isolation
- Health checks

## Security

- JWT-based authentication
- Password encryption
- HTTPS support
- Input validation
- XSS protection
- CSRF protection

## Performance

- Code splitting
- Lazy loading
- Image optimization
- Caching strategies
- Database optimization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please:
1. Check the documentation
2. Search existing issues
3. Create a new issue if needed

## Acknowledgments

- Material Design for UI components
- Spring Boot team for backend framework
- React team for frontend framework
- Android team for mobile platform

---

### Stay Connected 💬
For any queries or feedback, feel free to contact us:
- Email: [support@jeevan.com](mailto:support@jeevan.com)
- Website: [www.jeevan.com](http://www.jeevan.com)
