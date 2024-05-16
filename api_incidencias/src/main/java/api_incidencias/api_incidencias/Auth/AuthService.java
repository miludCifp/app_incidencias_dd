package api_incidencias.api_incidencias.Auth;

import api_incidencias.api_incidencias.Entidades.Clases.Cliente;
import api_incidencias.api_incidencias.Entidades.Clases.Trabajador;
import api_incidencias.api_incidencias.Entidades.Clases.Usuario;
import api_incidencias.api_incidencias.Entidades.Enum.Genero;
import api_incidencias.api_incidencias.Entidades.Enum.Rol;
import api_incidencias.api_incidencias.Jwt.JwtService;
import api_incidencias.api_incidencias.Repositorios.RepositorioUsuario;
import api_incidencias.api_incidencias.Servicios.ClienteService;
import api_incidencias.api_incidencias.Servicios.Seguridad;
import api_incidencias.api_incidencias.Servicios.TrabajadorService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    // Inyectamos el repositorio del usuario
    @Autowired
    private RepositorioUsuario reposUser;

    @Autowired
    private ClienteService clienteService;

    // Inyectamos el servicio del Jwt encargado de los tokens
    @Autowired
    private JwtService jwtService;
    @Autowired
    private AuthenticationManager authManager;
    @Autowired
    private Seguridad seguridad;
    @Autowired
    private TrabajadorService trabajadorService;
    @Autowired
    private PasswordEncoder passwdEncoder;


    public AuthResponse login(LoginRequest request){
        String rol;
        authManager.authenticate(new UsernamePasswordAuthenticationToken(request.getCorreoElectronico(), request.getContrasena()));
        Optional<Usuario> optional = reposUser.findByEmail(request.getCorreoElectronico());
        UserDetails userLogueado = optional.orElseThrow();

        if (trabajadorService.getTrabajador(optional.get().getIdUsuario()).isPresent()){
            Rol r = trabajadorService.getTrabajador(optional.get().getIdUsuario()).get().getRol();
            rol = r.name();
        }else {
            rol = "cliente";
        }

        String tokenUser = jwtService.getToken(userLogueado,rol,optional.get().getIdUsuario());

        return AuthResponse.builder().token(tokenUser).build();
    }
    public AuthResponse registrarCliente(RegisterRequest_Cliente request){
        /*
        Usuario newUser = Usuario.builder()
                .dni(request.getDni())
                .nombre(request.getNombre())
                .apellido(request.getApellido())
                .correoElectronico(request.getCorreoElectronico())
                .contrasena(passwdEncoder.encode(request.getContrasena()))
                .telefono(request.getTelefono())
                .calle(request.getCalle())
                .ciudad(request.getCiudad())
                .provincia(request.getProvincia())
                .codigoPostal(request.getCodigoPostal())
                .pais(request.getPais())
                .rol(Rol.cliente)
                .build();
        */

        /*
        Cliente newCliente = Cliente.builder()
                .dni(request.getDni())
                .nombre(request.getNombre())
                .apellido(request.getApellido())
                .correoElectronico(request.getCorreoElectronico())
                .contrasena(passwdEncoder.encode(request.getContrasena()))
                .telefono(request.getTelefono())
                .calle(request.getCalle())
                .ciudad(request.getCiudad())
                .provincia(request.getProvincia())
                .codigoPostal(request.getCodigoPostal())
                .pais(request.getPais())
                .build();
         */


        Cliente newCliente = new Cliente();
        newCliente.setTipoDocumento(request.getTipoDocumento());
        newCliente.setDocumento(request.getDocumento());
        newCliente.setGenero(request.getGenero());
        newCliente.setNombre(request.getNombre());
        newCliente.setApellido(request.getApellido());
        newCliente.setCorreoElectronico(request.getCorreoElectronico());
        newCliente.setContrasena(passwdEncoder.encode(request.getContrasena()));
        newCliente.setTelefono(request.getTelefono());
        newCliente.setCalle(request.getCalle());
        newCliente.setCiudad(request.getCiudad());
        newCliente.setProvincia(request.getProvincia());
        newCliente.setCodigoPostal(request.getCodigoPostal());
        newCliente.setPais(request.getPais());
        newCliente.setFechaRegistro(LocalDate.now());
        if (request.getGenero() == Genero.mujer) {
            newCliente.setImagenPerfil("userLogoM.png");
        }else{
            newCliente.setImagenPerfil("userLogoH.png");
        }


        // Guardamos el usuario usando el repositorio del usuario
        clienteService.addCliente(newCliente);

        Long id = clienteService.getCliente(newCliente.getCorreoElectronico()).get().getIdUsuario();

        // Retornamos el objeto usuario creado junto con el token que obtenemos mediante el servicio JWT
        return AuthResponse.builder()
                .token(jwtService.getToken(newCliente,"cliente",id))
                .build();
    }

    /**
     * Solo admin
     * @param request
     * @return
     */
    public AuthResponse registrarTrabajador(RegisterRequest_Trabajador request){

      //  if (seguridad.isAdmin()){

            Trabajador newTrabajador = new Trabajador();
            newTrabajador.setTipoDocumento(request.getTipoDocumento());
            newTrabajador.setDocumento(request.getDocumento());
            newTrabajador.setGenero(request.getGenero());
            newTrabajador.setNombre(request.getNombre());
            newTrabajador.setApellido(request.getApellido());
            newTrabajador.setCorreoElectronico(request.getCorreoElectronico());
            newTrabajador.setContrasena(passwdEncoder.encode(request.getContrasena()));
            newTrabajador.setTelefono(request.getTelefono());
            newTrabajador.setRol(request.getRol());
            newTrabajador.setFechaRegistro(LocalDate.now());
            if (request.getGenero() == Genero.mujer) {
                newTrabajador.setImagenPerfil("userLogoM.png");
            }else{
                newTrabajador.setImagenPerfil("userLogoH.png");
            }

            // Guardamos el usuario usando el repositorio del usuario
            trabajadorService.addTrabajador(newTrabajador);

            Long id = trabajadorService.getTrabajador(newTrabajador.getCorreoElectronico()).get().getIdUsuario();

            // Retornamos el objeto usuario creado junto con el token que obtenemos mediante el servicio JWT
            return AuthResponse.builder()
                    .token(jwtService.getToken(newTrabajador,newTrabajador.getRol().name(),id))
                    .build();
        }
       // return null;
   // }

}
