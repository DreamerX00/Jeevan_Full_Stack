# Android Development Guide

## Project Structure

```
android/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/jeevan/
│   │   │   │   ├── data/           # Data layer
│   │   │   │   │   ├── api/        # API interfaces
│   │   │   │   │   ├── db/         # Room database
│   │   │   │   │   ├── repository/ # Repository implementations
│   │   │   │   │   └── model/      # Data models
│   │   │   │   ├── domain/         # Domain layer
│   │   │   │   │   ├── model/      # Domain models
│   │   │   │   │   ├── repository/ # Repository interfaces
│   │   │   │   │   └── usecase/    # Use cases
│   │   │   │   ├── presentation/   # UI layer
│   │   │   │   │   ├── ui/         # Compose UI components
│   │   │   │   │   ├── viewmodel/  # ViewModels
│   │   │   │   │   └── state/      # UI states
│   │   │   │   └── utils/          # Utilities
│   │   │   ├── res/                # Resources
│   │   │   └── AndroidManifest.xml # App manifest
│   │   └── test/                   # Unit tests
│   └── build.gradle.kts           # App-level build config
├── build.gradle.kts               # Project-level build config
└── local.properties              # Local configuration (gitignored)
```

## Environment Configuration

### API Keys and Environment Variables
1. Create a `local.properties` file in the root directory:
   ```properties
   MAPS_API_KEY=your_maps_api_key
   API_BASE_URL=http://localhost:8080/api
   ```

2. Access environment variables in code:
   ```kotlin
   val mapsApiKey = BuildConfig.MAPS_API_KEY
   ```

3. Never commit `local.properties` to version control
4. Use `local.properties.example` as a template

## Core Components

### 1. Data Layer (`data/`)
- **Purpose**: Data sources and repositories
- **Structure**:
  - `api/`: API interfaces and implementations
  - `db/`: Room database
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
- **Structure**:
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
- **Structure**:
  - `ui/`: Compose UI components
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
   - Add data models in `data/model/`
   - Implement repositories in `data/repository/`
   - Update data sources in `data/api/`

2. **Create/Update Domain Layer**:
   - Add use cases in `domain/usecase/`
   - Update business logic
   - Modify domain models in `domain/model/`

3. **Create/Update Presentation Layer**:
   - Add UI components in `presentation/ui/`
   - Create ViewModels in `presentation/viewmodel/`
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
   - Create data models in `data/model/`
   - Add repository in `data/repository/`
   - Create use cases in `domain/usecase/`
   - Add UI components in `presentation/ui/`

2. **New Screen**:
   - Create composable in `presentation/ui/`
   - Add ViewModel in `presentation/viewmodel/`
   - Update navigation in `presentation/navigation/`

3. **New Data Source**:
   - Add API interface in `data/api/`
   - Implement repository in `data/repository/`
   - Update models in `data/model/`

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

1. Create composable in `presentation/ui/`
2. Add ViewModel in `presentation/viewmodel/`
3. Update navigation in `presentation/navigation/`
4. Add state handling
5. Implement UI logic
6. Write tests

### Adding New Feature

1. Create data models in `data/model/`
2. Add repository in `data/repository/`
3. Create use cases in `domain/usecase/`
4. Add UI components in `presentation/ui/`
5. Update navigation
6. Write tests

### Adding New API Integration

1. Add API interface in `data/api/`
2. Create repository in `data/repository/`
3. Add use cases in `domain/usecase/`
4. Update ViewModel in `presentation/viewmodel/`
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

3. **Environment**:
   - Set up production environment
   - Configure API endpoints
   - Set up monitoring

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