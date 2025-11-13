# CoWorkingSpace RMI (Spring) + JPA (MySQL) + REST + React
Academic group project for the Distributed Systems module at Université Ibn Zohr – FSA, implementing a multi-machine client-server architecture using RMI, with a web interface for user interaction. Managed under Agile (Scrum) using Taiga.

## Modules
- common: interfaces and DTOs shared between server and client
- rmi-server: Spring Boot application exposing RMI services and persisting with JPA/MySQL
- rest-client: Spring Boot REST application consuming RMI and exposing HTTP endpoints for React
- react-client: simple React frontend

## MySQL
Create a database `coworking_db` and update `rmi-server/src/main/resources/application.properties` with your username/password.

## Build & Run
From project root:
1. mvn clean package -DskipTests
2. In `rmi-server` module: mvn spring-boot:run (this starts RMI registry & server)
3. In `rest-client` module: mvn spring-boot:run
4. In `react-client`: npm install && npm start
