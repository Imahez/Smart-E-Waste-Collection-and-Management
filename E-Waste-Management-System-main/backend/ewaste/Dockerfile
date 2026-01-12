# Build stage
FROM eclipse-temurin:17-jdk-alpine as build
WORKDIR /app

# Copy gradle files
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .
COPY src src

# Fix permissions for gradlew
RUN chmod +x gradlew

# Build the application
RUN ./gradlew clean bootJar -x test

# Run stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar

# Expose the port (Render uses the PORT env var, but Spring defaults to 8080)
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
