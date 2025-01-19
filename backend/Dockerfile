FROM amazoncorretto:23-alpine
WORKDIR /app

# Copy the JAR file into the container
COPY myapp/build/libs/backend-all.jar app.jar

# Expose the port (default for Spring Boot is 8080)
EXPOSE 8080

# Health check (optional)
HEALTHCHECK --interval=30s --timeout=10s --retries=3 CMD curl --fail http://localhost:8080/actuator/health || exit 1

# Run the application
CMD ["java", "-jar", "app.jar"]
