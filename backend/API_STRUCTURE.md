# Jeevan API Structure

This document outlines the API structure for the Jeevan healthcare management system, which serves both a Kotlin Android mobile application and a React web application.

## API Separation Strategy

To maintain a clean separation between mobile and web APIs while reusing as much code as possible, we've implemented the following structure:

### Endpoints

- **Mobile-specific APIs**: `/api/*`
  - Used by the Kotlin Android application
  - Example: `/api/appointments`, `/api/prescriptions`

- **Web-specific APIs**: `/api/web/*`
  - Used exclusively by the React web application
  - Example: `/api/web/appointments`, `/api/web/prescriptions`

### Package Structure

1. **Common components**: `com.jeevan.backend.*`
   - Shared models, repositories, and common services
   - Used by both mobile and web endpoints

2. **Web-specific components**: `com.jeevan.backend.web.*`
   - Controllers, DTOs, and services specific to web
   - Located in dedicated web packages

### Naming Conventions

- Web-specific classes use the `Web` prefix or suffix:
  - Controllers: `*WebController`
  - DTOs: `*WebDto` (if needed)
  - Services: `*WebService` (if needed)

## Why This Structure?

This separation provides several benefits:

1. **Independent evolution**: Mobile and web APIs can evolve independently
2. **Clear boundaries**: Explicit separation makes the codebase more maintainable
3. **Code reuse**: Common functionality is shared through the service layer
4. **API versioning**: Easier to version mobile and web APIs separately if needed
5. **Documentation**: Clear distinction in API documentation

## Mobile API Endpoints

| Endpoint | Description |
|----------|-------------|
| `/api/auth/*` | Authentication endpoints |
| `/api/user/*` | User profile management |
| `/api/appointments/*` | Appointment management |
| `/api/prescriptions/*` | Prescription management |
| `/api/medicalrecords/*` | Medical records management |
| `/api/products/*` | Product management for medical shop |
| `/api/orders/*` | Order management for medical shop |

## Web API Endpoints

| Endpoint | Description |
|----------|-------------|
| `/api/web/auth/*` | Authentication endpoints for web |
| `/api/web/user/*` | User profile management for web |
| `/api/web/appointments/*` | Appointment management for web |
| `/api/web/prescriptions/*` | Prescription management for web |
| `/api/web/medicalrecords/*` | Medical records management for web |
| `/api/web/products/*` | Product management for web medical shop |
| `/api/web/orders/*` | Order management for web medical shop |

## Shared Models

Both API sets use the same underlying data models:

- User
- UserProfile
- Appointment
- Prescription
- MedicalRecord
- Product
- Order
- OrderItem

## Development Guidelines

1. Always place web-specific controllers in `com.jeevan.backend.web.controller`
2. Use the `/api/web/` prefix for all web-specific endpoints
3. Keep common logic in shared services when possible
4. Create web-specific services only when the logic differs significantly
5. Use clear naming conventions to distinguish web vs. mobile components 