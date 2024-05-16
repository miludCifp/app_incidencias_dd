package api_incidencias.api_incidencias.Servicios;

import api_incidencias.api_incidencias.Entidades.Clases.Cliente;
import api_incidencias.api_incidencias.Repositorios.RepositorioCliente;
import api_incidencias.api_incidencias.Repositorios.RepositorioUsuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {
    @Autowired
    private RepositorioCliente reposCliente;
    @Autowired
    private UsuarioService usuarioService;
    @Autowired
    private Seguridad seguridad;
    @Autowired
    private PasswordEncoder passwdEncoder;
    public Cliente addCliente(Cliente cliente) {
        return reposCliente.save(cliente);
    }

    public List<Cliente> getCliente() {
        return reposCliente.findAll();
    }

    public Optional<Cliente> getCliente(Long id) {
        return reposCliente.findById(id);
    }

    public Optional<Cliente> getCliente(String email) {
        return reposCliente.findByEmail(email);
    }

    /**
     * Si es el mismo o admin
     *
     * @param idCliente
     * @param cliente
     * @return
     */
    public Cliente updateCliente(Long idCliente, Cliente cliente) {
        if (seguridad.isAdmin() || seguridad.isElMismo(cliente.getCorreoElectronico())){
            Optional<Cliente> clienteExistenteOptional = reposCliente.findById(idCliente);

            if (clienteExistenteOptional.isPresent()) {
                Cliente clienteExixtente = clienteExistenteOptional.get();

                if (idCliente.equals(cliente.getIdUsuario())) {
                    usuarioService.updateUser(idCliente,cliente);

                    clienteExixtente.setCalle(cliente.getCalle());
                    clienteExixtente.setCiudad(cliente.getCiudad());
                    clienteExixtente.setProvincia(cliente.getProvincia());
                    clienteExixtente.setCodigoPostal(cliente.getCodigoPostal());
                    clienteExixtente.setPais(cliente.getPais());

                    // Guarda el usuario actualizado en el repositorio
                    return reposCliente.save(clienteExixtente);
                } else {
                    throw new IllegalArgumentException("El id proporcionado no coincide con el ID del usuario.");
                }
            } else {
                throw new IllegalArgumentException("El usuario con el ID proporcionado no existe.");
            }
        }
        throw new IllegalArgumentException("No tienes permisos");
    }
    public Cliente updateClienteContraseña(Long idCliente, Cliente cliente) {
        if (seguridad.isAdmin() || seguridad.isElMismo(cliente.getCorreoElectronico())){
            Optional<Cliente> clienteExistenteOptional = reposCliente.findById(idCliente);

            if (clienteExistenteOptional.isPresent()) {
                Cliente clienteExixtente = clienteExistenteOptional.get();

                if (idCliente.equals(cliente.getIdUsuario())) {
                    usuarioService.updateUser(idCliente,cliente);

                    /*
                    clienteExixtente.setDocumento(cliente.getDocumento());
                    clienteExixtente.setNombre(cliente.getNombre());
                    clienteExixtente.setApellido(cliente.getApellido());
                    clienteExixtente.setCorreoElectronico(cliente.getCorreoElectronico());


                    clienteExixtente.setFechaRegistro(cliente.getFechaRegistro());
                    clienteExixtente.setImagenPerfil(cliente.getImagenPerfil());
                    clienteExixtente.setTelefono(cliente.getTelefono());
                    */
                    clienteExixtente.setCalle(cliente.getCalle());
                    clienteExixtente.setCiudad(cliente.getCiudad());
                    clienteExixtente.setProvincia(cliente.getProvincia());
                    clienteExixtente.setCodigoPostal(cliente.getCodigoPostal());
                    clienteExixtente.setPais(cliente.getPais());
                    clienteExixtente.setContrasena(passwdEncoder.encode( cliente.getContrasena()));

                    // Guarda el usuario actualizado en el repositorio
                    return reposCliente.save(clienteExixtente);
                } else {
                    throw new IllegalArgumentException("El id proporcionado no coincide con el ID del usuario.");
                }
            } else {
                throw new IllegalArgumentException("El usuario con el ID proporcionado no existe.");
            }
        }
        throw new IllegalArgumentException("No tienes permisos");
    }

    /**
     * Solo admin
     *
     * @param id
     * @return
     */
    public ResponseEntity<String> deleteCliente(Long id) {
        if (seguridad.isAdmin()){
            Optional<Cliente> userOptional = reposCliente.findById(id);
            if (userOptional.isPresent()) {
                reposCliente.deleteById(id);

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
