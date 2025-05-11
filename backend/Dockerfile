# Build stage
FROM gradle:8.5-jdk17 AS build
WORKDIR /app
COPY . .
RUN gradle build --no-daemon

# Run stage
FROM openjdk:17-slim
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar

# Create a non-root user
RUN useradd -m -u 1000 appuser
USER appuser

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"] 