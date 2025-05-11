# Frontend Application Information

## Technology Stack
- **Framework**: React.js
- **Language**: TypeScript
- **Build Tool**: Vite
- **Package Manager**: npm/yarn
- **UI Library**: Material-UI (MUI)
- **State Management**: Redux Toolkit
- **Routing**: React Router
- **API Client**: Axios

## Key Dependencies
- **React**: Core UI library
- **TypeScript**: Type safety
- **Material-UI**: Component library
- **Redux Toolkit**: State management
- **React Router**: Navigation
- **Axios**: HTTP client
- **Formik**: Form handling
- **Yup**: Form validation
- **JWT Decode**: Token handling
- **React Query**: Data fetching
- **Styled Components**: CSS-in-JS

## Project Structure
```
frontend/
├── myNewApp/          # React application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── store/        # Redux store
│   │   ├── types/        # TypeScript types
│   │   ├── utils/        # Utility functions
│   │   ├── hooks/        # Custom hooks
│   │   └── assets/       # Static assets
│   ├── public/           # Public assets
│   └── package.json      # Dependencies
└── Information.md        # Documentation
```

## Key Features
1. Authentication
   - Login
   - Registration
   - Password Recovery
   - Protected Routes

2. User Interface
   - Responsive Design
   - Material Design
   - Dark/Light Theme
   - Loading States
   - Error Handling

3. State Management
   - Redux Store
   - Local Storage
   - Session Management
   - Form State

## Development Setup
- Node.js 16+
- npm 7+ or yarn 1.22+
- Modern browser with dev tools
- Access to backend API endpoints

## Configuration
- Environment variables in .env files
- API endpoints configuration
- Theme configuration
- Route configuration
- Authentication settings

## Docker Integration
- Containerized via docker-compose.yml
- Environment variable setup for API connection
- Port 3000 exposed for web access
- Connected to backend services

## Testing
- Jest for unit testing
- React Testing Library
- Cypress for E2E testing
- Mock Service Worker

## Performance Optimizations
- Code splitting
- Lazy loading
- Image optimization
- Caching strategies
- Bundle size optimization

## Security
- JWT handling
- XSS prevention
- CSRF protection
- Secure storage
- Input sanitization

## Build and Deployment
- Production build process
- Docker containerization
- CI/CD pipeline
- Environment-specific builds
- Static file serving

## Future Improvements
- PWA support
- Offline capabilities
- Performance monitoring
- Analytics integration
- Enhanced error tracking
- Accessibility improvements 