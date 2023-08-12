FROM openjdk:17-jdk-alpine
WORKDIR /app
RUN apk add --no-cache maven
COPY . /app
RUN mvn clean install -DskipTests
EXPOSE 8080
CMD ["java", "-jar", "./target/Board_API-0.0.1.jar"]