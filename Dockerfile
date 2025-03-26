

# Use the Maven image as the base
# add compiler here
FROM maven:3.9.9-eclipse-temurin-23 AS compiler


# Define application directory
ARG APP_DIR=/app
WORKDIR ${APP_DIR}

# Copy project files into the image
COPY backend/pom.xml .
COPY backend/mvnw .
COPY backend/mvnw.cmd .
COPY backend/.mvn .mvn
COPY backend/src src

# Ensure the mvnw script has execution permissions
RUN chmod +x mvnw

# Build the application
#./mvnw
RUN mvn package -Dmaven.test.skip=true



#Stage 2
FROM maven:3.9.9-eclipse-temurin-23

ARG DEPLOY_DIR=/code_folder

WORKDIR ${DEPLOY_DIR}
#change the names here
COPY --from=compiler /app/target/testssfproject2jb-0.0.1-SNAPSHOT.jar app.jar

# Set the server port
ENV SERVER_PORT=8080

# Expose the port
EXPOSE ${SERVER_PORT}

#change the name here
# Run the application
ENTRYPOINT SERVER_PORT=${SERVER_PORT} java -jar app.jar