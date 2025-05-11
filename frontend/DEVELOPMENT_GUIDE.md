# Frontend Development Guide

## Project Structure

```
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page components
│   ├── services/         # API services
│   ├── store/            # Redux store
│   ├── hooks/            # Custom hooks
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript types
│   ├── assets/           # Static assets
│   └── styles/           # Global styles
├── public/               # Public assets
└── package.json          # Dependencies
```

## Core Components

### 1. Components (`components/`)
- **Purpose**: Reusable UI components
- **Files**:
  - `common/`: Common UI components
  - `layout/`: Layout components
  - `forms/`: Form components
  - `modals/`: Modal components
- **When to Modify**:
  - Add new components
  - Update existing components
  - Fix component bugs
- **Do Not Modify**:
  - Core component logic
  - Component interfaces

### 2. Pages (`pages/`)
- **Purpose**: Page components
- **Files**:
  - `auth/`: Authentication pages
  - `dashboard/`: Dashboard pages
  - `profile/`: Profile pages
  - `medical/`: Medical record pages
- **When to Modify**:
  - Add new pages
  - Update page layouts
  - Modify page logic
- **Do Not Modify**:
  - Page routing logic
  - Authentication logic

### 3. Services (`services/`)
- **Purpose**: API integration
- **Files**:
  - `api.ts`: API configuration
  - `auth.service.ts`: Authentication service
  - `user.service.ts`: User service
  - `medical.service.ts`: Medical record service
- **When to Modify**:
  - Add new API endpoints
  - Update API logic
  - Modify request handling
- **Do Not Modify**:
  - API configuration
  - Authentication logic

### 4. Store (`store/`)
- **Purpose**: State management
- **Files**:
  - `slices/`: Redux slices
  - `hooks.ts`: Redux hooks
  - `store.ts`: Store configuration
- **When to Modify**:
  - Add new state slices
  - Update state logic
  - Modify actions
- **Do Not Modify**:
  - Store configuration
  - Middleware setup

## Development Workflow

### Adding New Features

1. **Create/Update Components**:
   - Add new components
   - Update existing components
   - Test components

2. **Create/Update Pages**:
   - Add new pages
   - Update page layouts
   - Add routing

3. **Create/Update Services**:
   - Add new API endpoints
   - Update service logic
   - Test API integration

4. **Update State Management**:
   - Add new state slices
   - Update actions
   - Test state changes

### Best Practices

1. **Code Style**:
   - Use TypeScript
   - Follow ESLint rules
   - Use Prettier formatting

2. **Component Design**:
   - Use functional components
   - Implement proper prop types
   - Use custom hooks

3. **State Management**:
   - Use Redux Toolkit
   - Implement proper actions
   - Use selectors

4. **Testing**:
   - Write unit tests
   - Test components
   - Test API integration

## File Creation Guidelines

### Where to Create New Files

1. **New Component**:
   - Create in `components/`
   - Add to appropriate subdirectory
   - Create test file

2. **New Page**:
   - Create in `pages/`
   - Add to routing
   - Create test file

3. **New Service**:
   - Create in `services/`
   - Add to API configuration
   - Create test file

### Files to Never Modify

1. **Core Configuration**:
   - `vite.config.ts`
   - `tsconfig.json`
   - `.eslintrc.js`

2. **Store Configuration**:
   - `store.ts`
   - `middleware.ts`

3. **API Configuration**:
   - `api.ts`
   - `interceptors.ts`

## Common Tasks

### Adding New Component

1. Create component file
2. Add TypeScript types
3. Implement component logic
4. Add styles
5. Write tests
6. Add to storybook

### Adding New Page

1. Create page component
2. Add routing
3. Implement page logic
4. Add styles
5. Write tests

### Adding New API Integration

1. Add service method
2. Add types
3. Implement API call
4. Add error handling
5. Test integration

## Testing

1. **Unit Tests**:
   - Test components
   - Test hooks
   - Test utilities

2. **Integration Tests**:
   - Test pages
   - Test API integration
   - Test state management

3. **E2E Tests**:
   - Test user flows
   - Test critical paths
   - Test edge cases

## Performance

1. **Code Splitting**:
   - Use lazy loading
   - Split routes
   - Optimize imports

2. **Asset Optimization**:
   - Optimize images
   - Use proper formats
   - Implement lazy loading

3. **State Management**:
   - Use proper selectors
   - Implement memoization
   - Optimize re-renders

## Security

1. **Authentication**:
   - Use JWT
   - Implement refresh tokens
   - Secure storage

2. **Data Protection**:
   - Sanitize inputs
   - Validate data
   - Handle errors

3. **API Security**:
   - Use HTTPS
   - Implement CORS
   - Handle tokens

## Deployment

1. **Build**:
   - Run tests
   - Build production
   - Optimize assets

2. **Deploy**:
   - Deploy to server
   - Configure CDN
   - Set up monitoring

3. **Monitor**:
   - Track errors
   - Monitor performance
   - Analyze usage 