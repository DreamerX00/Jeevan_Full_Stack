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
├── frontend/               # React Web Application
├── android/               # Android Mobile Application
└── docs/                  # Documentation
```

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
   cd ../frontend
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

## Features

### Patient Features
- User registration and authentication
- Medical record management
- Appointment scheduling
- Prescription tracking
- Real-time notifications

### Doctor Features
- Patient management
- Appointment management
- Prescription creation
- Medical record updates
- Real-time patient updates

### Pharmacy Features
- Prescription verification
- Order management
- Inventory tracking
- Delivery status updates

## API Documentation

The API documentation is available at `/api/docs` when running the backend server.

## Security

- JWT-based authentication
- Role-based access control
- Secure file storage
- Data encryption
- CORS configuration
- Rate limiting

## Development Guidelines

Please refer to the following documentation for development guidelines:

- [Backend Development Guide](backend/DEVELOPMENT_GUIDE.md)
- [Frontend Development Guide](frontend/DEVELOPMENT_GUIDE.md)
- [Android Development Guide](android/DEVELOPMENT_GUIDE.md)

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

## Acknowledgments

- Spring Boot Team
- React Team
- Android Team
- All contributors

## Support

For support, email support@jeevan.com or create an issue in the repository.
