
# Usamos una imagen base de Amazon Corretto 17
FROM amazoncorretto:17

# Definimos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos el archivo JAR de la aplicación
ARG JAR_FILE=target/api_incidencias-0.0.1.jar
COPY ${JAR_FILE} api_incidencias.jar

# Copiamos los archivos estáticos
COPY src/main/resources/static /app/static


# Exponemos el puerto en el que la aplicación Spring Boot escucha
EXPOSE 8080

# Comando para ejecutar la aplicación Spring Boot al iniciar el contenedor
ENTRYPOINT ["java", "-jar", "api_incidencias.jar"]
