# Jeevan Backend Development Guide

## Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── kotlin/
│   │   │   └── com/
│   │   │       └── jeevan/
│   │   │           └── backend/
│   │   │               ├── config/         # Configuration files
│   │   │               ├── controller/     # REST API endpoints
│   │   │               ├── dto/           # Data Transfer Objects
│   │   │               ├── models/        # Database entities
│   │   │               ├── repositories/  # Database access layer
│   │   │               ├── security/      # Authentication & Authorization
│   │   │               └── services/      # Business logic
│   │   └── resources/
│   │       └── application.properties     # Application configuration
└── build.gradle.kts                      # Dependencies and build config
```

## Core Components

### 1. Models (`models/`)
- **Purpose**: Define database entities and their relationships
- **Files**:
  - `User.kt`: User entity
  - `MedicalRecord.kt`: Medical records
  - `Prescription.kt`: Prescriptions
  - `Product.kt`: Products
  - `Order.kt`: Orders
  - `Appointment.kt`: Appointments
  - `MedicalImage.kt`: Medical images
  - `UserProfile.kt`: User profiles
- **When to Modify**: 
  - Add new database fields
  - Change entity relationships
  - Add new entities
- **Do Not Modify**:
  - Primary key configurations
  - Version fields (for optimistic locking)
  - Base entity relationships

### 2. DTOs (`dto/`)
- **Purpose**: Define data transfer objects for API requests/responses
- **Files**:
  - `UserDto.kt`: User-related DTOs
  - `MedicalRecordDto.kt`: Medical record DTOs
  - `PrescriptionDto.kt`: Prescription DTOs
  - `ProductDto.kt`: Product DTOs
  - `OrderDto.kt`: Order DTOs
  - `AppointmentDto.kt`: Appointment DTOs
  - `MedicalImageDto.kt`: Medical image DTOs
- **When to Modify**:
  - Add new request/response fields
  - Create new DTOs for new features
- **Do Not Modify**:
  - Base DTO structures
  - Validation annotations

### 3. Repositories (`repositories/`)
- **Purpose**: Database access layer
- **Files**:
  - `UserRepository.kt`
  - `MedicalRecordRepository.kt`
  - `PrescriptionRepository.kt`
  - `ProductRepository.kt`
  - `OrderRepository.kt`
  - `AppointmentRepository.kt`
  - `MedicalImageRepository.kt`
- **When to Modify**:
  - Add new query methods
  - Implement custom queries
- **Do Not Modify**:
  - Base repository interfaces
  - Transaction management

### 4. Services (`services/`)
- **Purpose**: Business logic implementation
- **Files**:
  - `AuthService.kt`: Authentication logic
  - `MedicalRecordService.kt`: Medical record operations
  - `PrescriptionService.kt`: Prescription management
  - `ProductService.kt`: Product operations
  - `OrderService.kt`: Order processing
  - `AppointmentService.kt`: Appointment scheduling
  - `MedicalImageService.kt`: Image handling
  - `WebSocketService.kt`: Real-time updates
- **When to Modify**:
  - Add new business logic
  - Implement new features
  - Modify existing operations
- **Do Not Modify**:
  - Security-related logic
  - Transaction boundaries

### 5. Controllers (`controller/`)
- **Purpose**: REST API endpoints
- **Files**:
  - `AuthController.kt`: Authentication endpoints
  - `MedicalRecordController.kt`: Medical record endpoints
  - `PrescriptionController.kt`: Prescription endpoints
  - `ProductController.kt`: Product endpoints
  - `OrderController.kt`: Order endpoints
  - `AppointmentController.kt`: Appointment endpoints
  - `MedicalImageController.kt`: Image endpoints
- **When to Modify**:
  - Add new endpoints
  - Modify existing endpoints
  - Update request/response handling
- **Do Not Modify**:
  - Security annotations
  - Base controller configurations

### 6. Security (`security/`)
- **Purpose**: Authentication and authorization
- **Files**:
  - `JwtService.kt`: JWT token handling
  - `JwtAuthenticationFilter.kt`: JWT authentication
  - `CustomUserDetailsService.kt`: User details service
- **When to Modify**:
  - Update security policies
  - Add new authentication methods
- **Do Not Modify**:
  - Core security mechanisms
  - Token generation logic

### 7. Configuration (`config/`)
- **Purpose**: Application configuration
- **Files**:
  - `SecurityConfig.kt`: Security configuration
  - `WebApiConfig.kt`: API configuration
  - `DataInitializer.kt`: Data initialization
  - `WebConfig.kt`: Web configuration
- **When to Modify**:
  - Update security rules
  - Modify API configurations
  - Add new configurations
- **Do Not Modify**:
  - Base security configurations
  - Core API settings

## Development Workflow

### Adding New Features

1. **Create/Update Models**:
   - Add new fields to existing models
   - Create new model classes if needed
   - Update relationships

2. **Create/Update DTOs**:
   - Add new request/response DTOs
   - Update existing DTOs

3. **Create/Update Repository**:
   - Add new query methods
   - Implement custom queries

4. **Create/Update Service**:
   - Implement business logic
   - Add new operations
   - Handle transactions

5. **Create/Update Controller**:
   - Add new endpoints
   - Implement request handling
   - Add security annotations

### Best Practices

1. **Security**:
   - Always use `@AuthenticationPrincipal` for user context
   - Validate all inputs
   - Use proper authorization checks

2. **Error Handling**:
   - Use custom exceptions
   - Implement proper error responses
   - Log errors appropriately

3. **Performance**:
   - Use pagination for large datasets
   - Implement caching where appropriate
   - Optimize database queries

4. **Testing**:
   - Write unit tests for services
   - Write integration tests for controllers
   - Test security configurations

## File Creation Guidelines

### Where to Create New Files

1. **New Entity**:
   - Create model in `models/`
   - Create DTOs in `dto/`
   - Create repository in `repositories/`
   - Create service in `services/`
   - Create controller in `controller/`

2. **New Feature**:
   - Add to existing service
   - Add to existing controller
   - Update DTOs if needed

3. **New Configuration**:
   - Add to `config/` directory
   - Update `application.properties`

### Files to Never Modify

1. **Security Core**:
   - `JwtService.kt` core logic
   - `SecurityConfig.kt` base configuration
   - `JwtAuthenticationFilter.kt` core filter

2. **Base Configurations**:
   - `WebApiConfig.kt` base settings
   - `WebConfig.kt` core web settings

3. **Data Initialization**:
   - `DataInitializer.kt` core data

## Common Tasks

### Adding New API Endpoint

1. Update/create DTO in `dto/`
2. Add service method in `services/`
3. Add controller endpoint in `controller/`
4. Add security annotations
5. Test the endpoint

### Adding New Entity

1. Create model in `models/`
2. Create DTOs in `dto/`
3. Create repository in `repositories/`
4. Create service in `services/`
5. Create controller in `controller/`
6. Update security configuration if needed

### Modifying Existing Feature

1. Update model if needed
2. Update DTOs
3. Update service logic
4. Update controller endpoints
5. Test changes

## Testing

1. **Unit Tests**:
   - Test services
   - Test repositories
   - Test DTOs

2. **Integration Tests**:
   - Test controllers
   - Test security
   - Test database operations

3. **Security Tests**:
   - Test authentication
   - Test authorization
   - Test input validation

## Deployment

1. **Configuration**:
   - Update `application.properties`
   - Set environment variables
   - Configure database

2. **Build**:
   - Run tests
   - Build application
   - Create deployment package

3. **Deploy**:
   - Deploy to server
   - Configure reverse proxy
   - Set up SSL

## Troubleshooting

1. **Common Issues**:
   - Database connection issues
   - Security configuration problems
   - Performance issues

2. **Debugging**:
   - Check logs
   - Use debug mode
   - Monitor performance

3. **Maintenance**:
   - Regular updates
   - Security patches
   - Performance optimization 