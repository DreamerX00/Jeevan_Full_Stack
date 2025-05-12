# Jeevan Project Information Guide

## Project Structure Overview

```
jeevan/
├── backend/                 # Spring Boot Backend
│   ├── src/                # Source code
│   │   ├── main/          # Main application code
│   │   └── test/          # Test code
│   ├── build.gradle.kts    # Gradle build configuration
│   └── application.properties.example  # Configuration template
├── frontend/               # React Web Application
│   ├── myNewApp/          # Main React application
│   │   ├── src/          # Source code
│   │   │   ├── components/ # Reusable components
│   │   │   ├── pages/     # Page components
│   │   │   ├── context/   # React context providers
│   │   │   ├── services/  # API services
│   │   │   └── assets/    # Static assets
│   │   ├── public/       # Static files
│   │   ├── .env          # Environment variables (not in version control)
│   │   └── package.json  # Dependencies
│   └── DEVELOPMENT_GUIDE.md # Frontend development guide
├── android/               # Android Mobile Application
│   ├── app/              # Android app source
│   │   ├── src/         # Source code
│   │   └── build.gradle.kts  # Build configuration
│   └── DEVELOPMENT_GUIDE.md # Android development guide
└── docs/                  # Documentation
```

## Critical Files and Directories

### Files That Should Never Be Modified
1. Configuration Files:
   - `backend/build.gradle.kts`
   - `frontend/myNewApp/package.json`
   - `android/app/build.gradle.kts`
   - `.gitignore`
   - `docker-compose.yml`

2. Security Files:
   - `SECURITY.md`
   - `backend/src/main/resources/application.properties`
   - `frontend/myNewApp/.env` (never commit this file)
   - Any files containing credentials or secrets

3. Documentation:
   - `LICENSE`
   - `README.md`
   - `DEVELOPMENT_GUIDE.md` files

### Files That Require Special Attention
1. Environment Files:
   - Always use `.env.example` as a template
   - Never commit actual `.env` files
   - Keep sensitive data in environment variables
   - For Google Maps API: set VITE_GOOGLE_MAPS_API_KEY in .env file

2. Database Files:
   - Never commit database dumps
   - Use migrations for schema changes
   - Keep backup scripts in version control

3. Build Output:
   - Never commit `build/` directories
   - Never commit `node_modules/`
   - Never commit `.gradle/` directories

## Development Guidelines

### Backend Development
1. Code Organization:
   - Follow package structure in `backend/src/main/kotlin`
   - Keep controllers in `controllers` package
   - Keep services in `services` package
   - Keep models in `models` package

2. Testing:
   - Write unit tests for all services
   - Write integration tests for controllers
   - Maintain test coverage above 80%

3. Documentation:
   - Document all public APIs
   - Keep API documentation up to date
   - Document database schema changes

### Frontend Development
1. Code Organization:
   - Keep components in `src/components`
   - Keep pages in `src/pages`
   - Keep services in `src/services`
   - Keep types in `src/types`

2. State Management:
   - Use React Context for theme/auth
   - Keep state logic in separate files

3. Styling:
   - Use Tailwind CSS for styling
   - Follow design system guidelines
   - Keep styles modular and responsive
   - Support dark/light mode via ThemeContext

4. Maps Integration:
   - GoogleMapComponent uses Google Maps JavaScript API
   - API key must be set in .env file as VITE_GOOGLE_MAPS_API_KEY
   - Never hardcode the API key in the source code
   - API key should have proper restrictions set in Google Cloud Console
   - Hospital and Pharmacy status (open/closed) is managed via the isOpen function

### Android Development
1. Code Organization:
   - Follow MVVM architecture
   - Keep UI in `presentation` package
   - Keep business logic in `domain` package
   - Keep data in `data` package

2. UI Development:
   - Use Jetpack Compose
   - Follow Material Design
   - Keep UI components reusable

3. Testing:
   - Write unit tests for ViewModels
   - Write UI tests for composables
   - Test navigation flows

## Security Guidelines

1. Authentication:
   - Use JWT for authentication
   - Implement refresh tokens
   - Secure token storage

2. Data Protection:
   - Encrypt sensitive data
   - Use HTTPS for all API calls
   - Implement proper CORS

3. File Security:
   - Validate file uploads
   - Scan for malware
   - Implement file size limits

4. API Keys:
   - Never commit API keys to version control
   - Store API keys in environment variables (.env file)
   - For Google Maps API:
     - Add HTTP referrer restrictions in Google Cloud Console
     - Limit API key usage to only required APIs
     - Monitor API usage in Google Cloud Console
     - Rotate keys if compromised

## Deployment Guidelines

1. Backend:
   - Use Docker for deployment
   - Configure proper logging
   - Set up monitoring

2. Frontend:
   - Build for production
   - Optimize assets
   - Configure CDN
   - Use environment-specific .env files

3. Android:
   - Sign release builds
   - Configure ProGuard
   - Test release builds

## Maintenance Guidelines

1. Dependencies:
   - Keep dependencies updated
   - Check for security vulnerabilities
   - Document major version changes

2. Code Quality:
   - Run linters regularly
   - Fix code smells
   - Maintain documentation

3. Performance:
   - Monitor API response times
   - Optimize database queries
   - Profile frontend performance

## Google Maps Integration Notes

1. API Key Setup:
   - Create a project in Google Cloud Console
   - Enable Maps JavaScript API, Places API, and Directions API
   - Create API key with proper restrictions
   - Add key to .env file as VITE_GOOGLE_MAPS_API_KEY

2. Component Functionality:
   - GoogleMapComponent handles map display and place search
   - NearbyHospitals and NearbyPharmacies handle list/details display
   - For hospitals: isOpen() defaults to true (hospitals are generally 24/7)
   - For pharmacies: isOpen() checks actual opening hours

3. Common Issues:
   - Maps not loading: Check API key and quotas
   - Status inconsistency: Check console log for isOpenNow logs
   - Direction links: Uses maps/dir API with destination_place_id parameter

## Support and Resources

1. Documentation:
   - README.md for project overview
   - DEVELOPMENT_GUIDE.md for specific components
   - API documentation in backend

2. Tools:
   - IDE: IntelliJ IDEA/Android Studio/VS Code
   - Version Control: Git
   - CI/CD: GitHub Actions

3. Communication:
   - Use GitHub Issues for bugs
   - Use Pull Requests for changes
   - Follow code review guidelines 