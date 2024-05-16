package api_incidencias.api_incidencias.Servicios;

import api_incidencias.api_incidencias.Entidades.Clases.Usuario;
import api_incidencias.api_incidencias.Repositorios.RepositorioUsuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UsuarioService {

    @Autowired
    private RepositorioUsuario reposUser;
    @Autowired
    private Seguridad seguridad;

    private static final String RUTA_IMG = "./imgUsuarios";


    /*
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = reposUser.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
        return new User(usuario.getCorreoElectronico(), usuario.getContrasena(), new ArrayList<>());
    }

    */
    public Usuario addUser(Usuario user){
        return reposUser.save(user);
    }

    public String subirImagen(Long idUsuario, MultipartFile file) {
        // Verifica que el archivo no esté vacío
        if (file.isEmpty()) {
            throw new RuntimeException("El archivo está vacío");
        }

        try {
            // Genera un nombre único para la imagen
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();

            // Crea el directorio si no existe
            Path directory = Paths.get(RUTA_IMG);
            if (!Files.exists(directory)) {
                Files.createDirectories(directory);
            }

            // Guarda el archivo en el servidor
            Path filePath = directory.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);

            // Obtener la URL de la nueva imagen
            String urlImagen = fileName;

            // Actualizar la base de datos
            Optional<Usuario> usuarioOptional = getUser(idUsuario);
            if (usuarioOptional.isPresent()) {
                Usuario usuario = usuarioOptional.get();
                String rutaImagenAnterior = usuario.getImagenPerfil();

                // Verifica si hay una imagen anterior
                if (rutaImagenAnterior != null && !rutaImagenAnterior.isEmpty()) {
                    // Elimina la imagen anterior del servidor
                    if (!rutaImagenAnterior.equals("userLogoH.png") && !rutaImagenAnterior.equals("userLogoM.png")){
                        Path rutaImagenAnteriorCompleta = directory.resolve(rutaImagenAnterior);
                        Files.deleteIfExists(rutaImagenAnteriorCompleta);
                    }
                }

                // Actualiza la ruta de la imagen en el usuario
                usuario.setImagenPerfil(urlImagen);
                updateUser(idUsuario, usuario);
            } else {
                System.out.println("Error al actualizar la imagen del usuario: usuario no encontrado");
            }

            return urlImagen;
        } catch (Exception e) {
            throw new RuntimeException("Falló la carga de la imagen", e);
        }
    }


    public ResponseEntity<InputStreamResource> getImagenUser(Long idUser) {
        Optional<Usuario> userOptional = getUser(idUser);

        if (!userOptional.isPresent()) {
            System.out.println("No existe el usuario que buscas");
            return ResponseEntity.notFound().build();
        }

        String rutaImagenUser = RUTA_IMG+File.separator+userOptional.get().getImagenPerfil();

        if(rutaImagenUser == null){
            System.out.println("El usuario no tiene imagen asignada");
            return ResponseEntity.notFound().build();
        }

        // Le quito la palabra uploads a la cadena rutaImagenLibro
        //String rutaImgUserServidor = uploadDir + "/" +rutaImagenUser.replace("uploads", "");

        try {
            // Construir la ruta completa de la imagen a partir de la ruta relativa y la ubicación del proyecto
            //Path imagePath = Paths.get(System.getProperty("user.dir"), rutaImagenUser);
            Path imagePath = Paths.get(rutaImagenUser);

            File imageFile = imagePath.toFile();

            if (!imageFile.exists()) {
                System.out.println("La imagen no fue encontrada en la ruta especificada: " + imagePath);
                return ResponseEntity.notFound().build();
            }

            // Obtener la extensión del archivo
            String extension = rutaImagenUser.substring(rutaImagenUser.lastIndexOf(".") + 1);

            // Determinar el tipo de contenido basado en la extensión del archivo
            MediaType mediaType = null;
            if ("jpg".equalsIgnoreCase(extension) || "jpeg".equalsIgnoreCase(extension)) {
                mediaType = MediaType.IMAGE_JPEG;
            } else if ("png".equalsIgnoreCase(extension)) {
                mediaType = MediaType.IMAGE_PNG;
            } else if ("gif".equalsIgnoreCase(extension)) {
                mediaType = MediaType.IMAGE_GIF;
            } else {
                System.out.println("Extensión de archivo no compatible: " + extension);
                return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).body(null);
            }

            // Cargar la imagen desde el sistema de archivos
            InputStream inputStream = new FileInputStream(imageFile);

            // Devolver la imagen en la respuesta con el tipo de contenido adecuado
            return ResponseEntity
                    .ok()
                    .contentType(mediaType)
                    .body(new InputStreamResource(inputStream));
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    /**
     * Solo trabajadores
     * @return
     */
    public List<Usuario> getUser(){
        return reposUser.findAll();
    }
    public Optional<Usuario> getUser(Long id){
        return reposUser.findById(id);
    }

    public Optional<Usuario> getUser(String email){
        return reposUser.findByEmail(email);
    }

    /**
     * Solo si es admin o el mismo
     * @param idUser
     * @param user
     * @return
     */

    public Usuario updateUser(Long idUser, Usuario user){
        if (seguridad.isAdmin() || seguridad.isElMismo(user.getCorreoElectronico())) {
            Optional<Usuario> userExistenteOptional = reposUser.findById(idUser);
            if (userExistenteOptional.isPresent()) {
                Usuario usuarioExistente = userExistenteOptional.get();

                if (idUser.equals(user.getIdUsuario())) {
                    usuarioExistente.setTipoDocumento(user.getTipoDocumento());
                    usuarioExistente.setDocumento(user.getDocumento());
                    usuarioExistente.setGenero(user.getGenero());
                    usuarioExistente.setNombre(user.getNombre());
                    usuarioExistente.setApellido(user.getApellido());
                    usuarioExistente.setCorreoElectronico(user.getCorreoElectronico());
                   // usuarioExistente.setContrasena(user.getContrasena());

                    usuarioExistente.setFechaRegistro(user.getFechaRegistro());
                   // usuarioExistente.setImagenPerfil(user.getImagenPerfil());
                    usuarioExistente.setTelefono(user.getTelefono());

                    usuarioExistente.setUsuarioModificacion(this.getUser(seguridad.getIdUsuario()).get());
                    usuarioExistente.setFechaModificacion(LocalDateTime.now());

                    return reposUser.save(usuarioExistente);
                } else {
                    throw new IllegalArgumentException("El id proporcionado no coincide con el ID del usuario.");
                }
            } else {
                throw new IllegalArgumentException("El usuario con el ID proporcionado no existe.");
            }
        }
        throw new IllegalArgumentException("No tienes permisos.");
    }
/*
    public Usuario updateUserConContraseña(Long idUser, Usuario user){
        if (seguridad.isAdmin() || seguridad.isElMismo(user.getCorreoElectronico())) {
            Optional<Usuario> userExistenteOptional = reposUser.findById(idUser);
            if (userExistenteOptional.isPresent()) {
                Usuario usuarioExistente = userExistenteOptional.get();

                if (idUser.equals(user.getIdUsuario())) {

                    usuarioExistente.setDni(user.getDni());
                    usuarioExistente.setNombre(user.getNombre());
                    usuarioExistente.setApellido(user.getApellido());
                    usuarioExistente.setCorreoElectronico(user.getCorreoElectronico());
                    usuarioExistente.setContrasena(user.getContrasena());

                    usuarioExistente.setFechaRegistro(user.getFechaRegistro());
                    // usuarioExistente.setImagenPerfil(user.getImagenPerfil());
                    usuarioExistente.setTelefono(user.getTelefono());

                    usuarioExistente.setUsuarioModificacion(user.getUsuarioModificacion());
                    usuarioExistente.setFechaModificacion(LocalDateTime.now());

                    return reposUser.save(usuarioExistente);
                } else {
                    throw new IllegalArgumentException("El id proporcionado no coincide con el ID del usuario.");
                }
            } else {
                throw new IllegalArgumentException("El usuario con el ID proporcionado no existe.");
            }
        }
        throw new IllegalArgumentException("No tienes permisos.");
    }
    */
    /**
     * Solo si es admin
     * @param id
     * @return
     */
    public ResponseEntity<String> deleteUser(Long id){
        if (seguridad.isAdmin()) {
            //si es admin
            Optional<Usuario> userOptional = reposUser.findById(id);
            if (userOptional.isPresent()) {
                reposUser.deleteById(id);
                return ResponseEntity.status(HttpStatus.NO_CONTENT)
                        .body("Usuario eliminado correctamente.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No se encontró el usuario correspondiente.");
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("No tienes permisos.");
    }
}
