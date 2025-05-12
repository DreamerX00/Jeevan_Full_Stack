# Frontend Development Guide

## Project Structure

```
frontend/
├── myNewApp/              # Main React application
│   ├── src/              # Source code
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context providers
│   │   ├── assets/      # Static assets
│   │   ├── App.jsx      # Main application component
│   │   ├── main.jsx     # Application entry point
│   │   └── index.css    # Global styles
│   ├── public/          # Public assets
│   ├── package.json     # Dependencies
│   ├── vite.config.js   # Vite configuration
│   ├── tailwind.config.js # Tailwind CSS configuration
│   └── postcss.config.js # PostCSS configuration
└── DEVELOPMENT_GUIDE.md  # This guide
```

## Environment Configuration

### API Keys and Environment Variables
1. Create a `.env` file in the `myNewApp` directory:
   ```
   VITE_GOOGLE_MAPS_API_KEY=your_maps_api_key
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

2. Access environment variables in code:
   ```javascript
   const mapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
   ```

3. Never commit `.env` file to version control
4. Use `.env.example` as a template for required environment variables

## Core Components

### 1. Components (`src/components/`)
- **Purpose**: Reusable UI components
- **Structure**:
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

### 2. Pages (`src/pages/`)
- **Purpose**: Page components
- **Structure**:
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

### 3. Context (`src/context/`)
- **Purpose**: React context providers
- **Files**:
  - `AuthContext.jsx`: Authentication context
  - `ThemeContext.jsx`: Theme context
- **When to Modify**:
  - Add new context providers
  - Update context logic
  - Modify state management
- **Do Not Modify**:
  - Core context logic
  - Provider interfaces

## Development Workflow

### Adding New Features

1. **Create/Update Components**:
   - Add new components in `src/components/`
   - Update existing components
   - Test components

2. **Create/Update Pages**:
   - Add new pages in `src/pages/`
   - Update page layouts
   - Add routing in `App.jsx`

3. **Update Context**:
   - Add new context providers in `src/context/`
   - Update context logic
   - Test context changes

### Best Practices

1. **Code Style**:
   - Use functional components
   - Follow ESLint rules
   - Use Prettier formatting

2. **Component Design**:
   - Use React hooks
   - Implement proper prop types
   - Keep components small and focused

3. **State Management**:
   - Use React Context for global state
   - Use local state for component state
   - Keep state logic simple

4. **Testing**:
   - Write unit tests
   - Test components
   - Test context providers

## File Creation Guidelines

### Where to Create New Files

1. **New Component**:
   - Create in `src/components/`
   - Add to appropriate subdirectory
   - Create test file

2. **New Page**:
   - Create in `src/pages/`
   - Add to routing in `App.jsx`
   - Create test file

3. **New Context**:
   - Create in `src/context/`
   - Add provider to `App.jsx`
   - Create test file

### Files to Never Modify

1. **Core Configuration**:
   - `vite.config.js`
   - `tailwind.config.js`
   - `postcss.config.js`

2. **Build Files**:
   - `package.json`
   - `package-lock.json`

3. **Environment Files**:
   - `.env`
   - `.env.production`

## Common Tasks

### Adding New Component

1. Create component file in `src/components/`
2. Add component logic
3. Add styles using Tailwind CSS
4. Write tests
5. Add to storybook

### Adding New Page

1. Create page component in `src/pages/`
2. Add routing in `App.jsx`
3. Implement page logic
4. Add styles
5. Write tests

### Adding New API Integration

1. Create API service in `src/services/`
2. Add API configuration
3. Implement API calls
4. Add error handling
5. Test integration

## Testing

1. **Unit Tests**:
   - Test components
   - Test hooks
   - Test context providers

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
   - Use proper context
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

3. **Environment**:
   - Set up production environment
   - Configure API endpoints
   - Set up monitoring 