# Use the official Gradle image to build and run the app
FROM gradle:7.4.2-jdk11 AS builder
WORKDIR /app
COPY . .

# Build the Spring Boot application
RUN gradle build

# Run the Spring Boot application
CMD ["gradle", "bootRun"]

# Expose the port
EXPOSE 8080
