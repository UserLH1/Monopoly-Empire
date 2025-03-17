FROM openjdk:17-jdk-slim

# Set working directory
WORKDIR /app

# Copy Maven wrapper
COPY .mvn/wrapper/maven-wrapper.properties .mvn/wrapper/

# Copy Maven executable files
COPY mvnw mvnw
COPY mvnw.cmd mvnw.cmd

# Copy pom.xml
COPY pom.xml .

# Resolve dependencies
RUN ./mvnw dependency:go-offline

# Copy source code
COPY src src

# Build the application
RUN ./mvnw package -DskipTests

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
ENTRYPOINT ["java", "-jar", "target/monopolyEmpire-0.0.1-SNAPSHOT.jar"]