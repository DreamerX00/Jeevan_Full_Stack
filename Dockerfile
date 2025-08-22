# Multi-stage build for Spring Boot backend
FROM gradle:8.5-jdk21 AS build

WORKDIR /app

# Copy backend files
COPY backend/ .

# Build the application
RUN gradle build --no-daemon -x test

# Production stage
FROM openjdk:21-jdk-slim

WORKDIR /app

# Create non-root user
RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app

# Copy the built JAR file
COPY --from=build /app/build/libs/*.jar app.jar

# Change to non-root user
USER appuser

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
