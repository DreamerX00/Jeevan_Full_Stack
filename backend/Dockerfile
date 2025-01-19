FROM amazoncorretto:23-alpine
WORKDIR /app
COPY build/libs/ktor-sample-all.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
