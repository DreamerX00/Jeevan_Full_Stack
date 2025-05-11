# Jeevan - Healthcare Management System

## Project Overview
- Comprehensive healthcare management system with mobile app, web interface, and backend
- Features patient management, medical records, appointment scheduling, and secure authentication
- Cross-platform access via Android mobile app and web interface

## Technology Stack
- **Mobile Application**: Kotlin with Jetpack Compose
- **Backend**: Spring Boot with Kotlin
- **Frontend**: React.js with TypeScript
- **Database**: PostgreSQL
- **Containerization**: Docker and Docker Compose

## Project Structure
```
.
├── Kotlin_Application/     # Android mobile app
├── backend/               # Spring Boot backend
├── frontend/             # React web application
├── docker-compose.yml    # Docker configuration
├── DOCKER_README.md      # Docker setup guide
├── README.md             # Project documentation
└── SECURITY.md           # Security guidelines
```

## Development Setup
- Docker and Docker Compose for containerized development
- JDK 17+ for backend development
- Node.js 16+ for frontend development
- Android Studio for mobile app development

## Docker Configuration
- PostgreSQL database container
- Spring Boot backend container
- React frontend container
- Docker network for service communication
- Volume mapping for database persistence

## Security Features
- JWT-based authentication
- Password encryption
- Role-based access control
- Input validation
- XSS and CSRF protection

## Building and Deployment
- Docker-based deployment
- Environment-specific configurations
- CI/CD pipeline support
- Containerized services

## Documentation
- Comprehensive README
- Docker setup guide
- Security guidelines
- Information documentation for each component

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Future Roadmap
- Enhanced analytics dashboard
- Telemedicine integration
- Machine learning for health predictions
- Internationalization support
- Enhanced mobile features 