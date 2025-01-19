FROM amazoncorretto:23-alpine
WORKDIR /app
COPY build/libs/backend.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
