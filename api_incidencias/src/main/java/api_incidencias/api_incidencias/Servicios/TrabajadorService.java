package api_incidencias.api_incidencias.Servicios;

import api_incidencias.api_incidencias.Entidades.Clases.Trabajador;
import api_incidencias.api_incidencias.Repositorios.RepositorioTrabajador;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TrabajadorService {
    @Autowired
    private RepositorioTrabajador reposTrabajador;
    @Autowired
    private UsuarioService usuarioService;
    @Autowired
    private PasswordEncoder passwdEncoder;
    @Autowired
    private Seguridad seguridad;
    public Trabajador addTrabajador(Trabajador trabajador){
        return reposTrabajador.save(trabajador);
    }

    public List<Trabajador> getTrabajador(){
        return reposTrabajador.findAll();
    }
    public Optional<Trabajador> getTrabajador(Long id){
        return reposTrabajador.findById(id);
    }

    public Optional<Trabajador> getTrabajador(String email){
        return reposTrabajador.findByEmail(email);
    }

    public Trabajador updateTrabajador(Long idUser, Trabajador trabajador){
        //reposUser.save(user);
        if (seguridad.isAdmin()) {
            Optional<Trabajador> trabajadorExistenteOptional = reposTrabajador.findById(idUser);

            if (trabajadorExistenteOptional.isPresent()) {
                Trabajador trabajadorExistente = trabajadorExistenteOptional.get();

                if (idUser.equals(trabajador.getIdUsuario())) {
                    usuarioService.updateUser(idUser,trabajador);
                    /*
                    trabajadorExistente.setDocumento(trabajador.getDocumento());
                    trabajadorExistente.setNombre(trabajador.getNombre());
                    trabajadorExistente.setApellido(trabajador.getApellido());
                    trabajadorExistente.setCorreoElectronico(trabajador.getCorreoElectronico());
                    //trabajadorExistente.setContrasena(passwdEncoder.encode( trabajador.getContrasena()));
                    trabajadorExistente.setFechaRegistro(trabajador.getFechaRegistro());
                    trabajadorExistente.setImagenPerfil(trabajador.getImagenPerfil());
                    trabajadorExistente.setTelefono(trabajador.getTelefono());
                    */

                    trabajadorExistente.setRol(trabajador.getRol());
                    // Guarda el usuario actualizado en el repositorio
                    return reposTrabajador.save(trabajadorExistente);
                } else {
                    throw new IllegalArgumentException("El id proporcionado no coincide con el ID del usuario.");
                }
            } else {
                throw new IllegalArgumentException("El usuario con el ID proporcionado no existe.");
            }
        }
        throw new IllegalArgumentException("No tienes permisos.");
    }
    public Trabajador updateTrabajadorContraseña(Long idUser, Trabajador trabajador){
        //reposUser.save(user);
        if (seguridad.isAdmin()) {
            Optional<Trabajador> trabajadorExistenteOptional = reposTrabajador.findById(idUser);

            if (trabajadorExistenteOptional.isPresent()) {
                Trabajador trabajadorExistente = trabajadorExistenteOptional.get();

                if (idUser.equals(trabajador.getIdUsuario())) {
                    usuarioService.updateUser(idUser,trabajador);
                    /*
                    trabajadorExistente.setDocumento(trabajador.getDocumento());
                    trabajadorExistente.setNombre(trabajador.getNombre());
                    trabajadorExistente.setApellido(trabajador.getApellido());
                    trabajadorExistente.setCorreoElectronico(trabajador.getCorreoElectronico());
                    trabajadorExistente.setFechaRegistro(trabajador.getFechaRegistro());
                    trabajadorExistente.setImagenPerfil(trabajador.getImagenPerfil());
                    trabajadorExistente.setTelefono(trabajador.getTelefono());
                    trabajadorExistente.setTipoDocumento(trabajador.getTipoDocumento());
                    */
                    trabajadorExistente.setContrasena(passwdEncoder.encode( trabajador.getContrasena()));
                    trabajadorExistente.setRol(trabajador.getRol());
                    // Guarda el usuario actualizado en el repositorio
                    return reposTrabajador.save(trabajadorExistente);
                } else {
                    throw new IllegalArgumentException("El id proporcionado no coincide con el ID del usuario.");
                }
            } else {
                throw new IllegalArgumentException("El usuario con el ID proporcionado no existe.");
            }
        }
        throw new IllegalArgumentException("No tienes permisos.");
    }

    public ResponseEntity<String> deleteTrabajador(Long id){
        if (seguridad.isAdmin()) {

            Optional<Trabajador> userOptional = reposTrabajador.findById(id);

            if (userOptional.isPresent()) {
                reposTrabajador.deleteById(id);
                ;

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
