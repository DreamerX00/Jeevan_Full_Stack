# Android Development Guide

## Project Structure

```
android/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/jeevan/
│   │   │   │   ├── data/           # Data layer
│   │   │   │   ├── domain/         # Domain layer
│   │   │   │   ├── presentation/   # UI layer
│   │   │   │   └── utils/          # Utilities
│   │   │   ├── res/                # Resources
│   │   │   └── AndroidManifest.xml # App manifest
│   │   └── test/                   # Unit tests
│   └── build.gradle.kts           # App-level build config
└── build.gradle.kts               # Project-level build config
```

## Core Components

### 1. Data Layer (`data/`)
- **Purpose**: Data sources and repositories
- **Files**:
  - `api/`: API interfaces and implementations
  - `db/`: Local database
  - `repository/`: Repository implementations
  - `model/`: Data models
- **When to Modify**:
  - Add new data sources
  - Update repository logic
  - Modify data models
- **Do Not Modify**:
  - Base repository interfaces
  - Database schema

### 2. Domain Layer (`domain/`)
- **Purpose**: Business logic
- **Files**:
  - `model/`: Domain models
  - `repository/`: Repository interfaces
  - `usecase/`: Use cases
- **When to Modify**:
  - Add new use cases
  - Update business logic
  - Modify domain models
- **Do Not Modify**:
  - Base use case interfaces
  - Repository interfaces

### 3. Presentation Layer (`presentation/`)
- **Purpose**: UI components
- **Files**:
  - `ui/`: UI components
  - `viewmodel/`: ViewModels
  - `state/`: UI states
- **When to Modify**:
  - Add new screens
  - Update UI components
  - Modify ViewModels
- **Do Not Modify**:
  - Base ViewModel classes
  - Navigation logic

## Development Workflow

### Adding New Features

1. **Create/Update Data Layer**:
   - Add data models
   - Implement repositories
   - Update data sources

2. **Create/Update Domain Layer**:
   - Add use cases
   - Update business logic
   - Modify domain models

3. **Create/Update Presentation Layer**:
   - Add UI components
   - Create ViewModels
   - Implement navigation

### Best Practices

1. **Architecture**:
   - Follow MVVM pattern
   - Use Clean Architecture
   - Implement dependency injection

2. **Code Style**:
   - Follow Kotlin style guide
   - Use ktlint
   - Write clean code

3. **Testing**:
   - Write unit tests
   - Test ViewModels
   - Test repositories

4. **Performance**:
   - Use coroutines
   - Implement caching
   - Optimize UI

## File Creation Guidelines

### Where to Create New Files

1. **New Feature**:
   - Create data models
   - Add repository
   - Create use cases
   - Add UI components

2. **New Screen**:
   - Create composable
   - Add ViewModel
   - Update navigation

3. **New Data Source**:
   - Add API interface
   - Implement repository
   - Update models

### Files to Never Modify

1. **Core Configuration**:
   - `build.gradle.kts`
   - `AndroidManifest.xml`
   - `proguard-rules.pro`

2. **Base Classes**:
   - Base ViewModel
   - Base Repository
   - Base UseCase

3. **Navigation**:
   - Navigation graph
   - Route definitions

## Common Tasks

### Adding New Screen

1. Create composable
2. Add ViewModel
3. Update navigation
4. Add state handling
5. Implement UI logic
6. Write tests

### Adding New Feature

1. Create data models
2. Add repository
3. Create use cases
4. Add UI components
5. Update navigation
6. Write tests

### Adding New API Integration

1. Add API interface
2. Create repository
3. Add use cases
4. Update ViewModel
5. Test integration

## Testing

1. **Unit Tests**:
   - Test ViewModels
   - Test repositories
   - Test use cases

2. **Integration Tests**:
   - Test API integration
   - Test database
   - Test navigation

3. **UI Tests**:
   - Test composables
   - Test navigation
   - Test user flows

## Performance

1. **Memory Management**:
   - Use proper scoping
   - Implement caching
   - Handle lifecycle

2. **UI Performance**:
   - Use lazy loading
   - Optimize recomposition
   - Handle state properly

3. **Network**:
   - Implement caching
   - Handle offline mode
   - Optimize requests

## Security

1. **Data Security**:
   - Encrypt sensitive data
   - Secure storage
   - Handle tokens

2. **Network Security**:
   - Use HTTPS
   - Implement certificate pinning
   - Handle SSL

3. **Authentication**:
   - Secure token storage
   - Handle refresh tokens
   - Implement biometrics

## Deployment

1. **Build**:
   - Run tests
   - Generate release build
   - Sign APK

2. **Release**:
   - Upload to Play Store
   - Configure rollout
   - Monitor crashes

3. **Monitor**:
   - Track crashes
   - Monitor performance
   - Analyze usage

## Troubleshooting

1. **Common Issues**:
   - Build problems
   - Runtime crashes
   - Performance issues

2. **Debugging**:
   - Use Android Studio
   - Check logs
   - Use debug tools

3. **Maintenance**:
   - Update dependencies
   - Fix bugs
   - Optimize code 