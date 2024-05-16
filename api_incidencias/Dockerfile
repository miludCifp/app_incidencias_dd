FROM amazoncorretto:17
ARG JAR_FILE=target/api_incidencias-0.0.1.jar
COPY ${JAR_FILE} api_incidencias.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "api_incidencias.jar"]