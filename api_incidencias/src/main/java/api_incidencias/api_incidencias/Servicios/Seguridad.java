package api_incidencias.api_incidencias.Servicios;

import api_incidencias.api_incidencias.Entidades.Clases.Cliente;
import api_incidencias.api_incidencias.Entidades.Clases.Trabajador;
import api_incidencias.api_incidencias.Entidades.Clases.Usuario;
import api_incidencias.api_incidencias.Entidades.Enum.Rol;
import api_incidencias.api_incidencias.Jwt.JwtService;
import api_incidencias.api_incidencias.Repositorios.RepositorioCliente;
import api_incidencias.api_incidencias.Repositorios.RepositorioTrabajador;
import api_incidencias.api_incidencias.Repositorios.RepositorioUsuario;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.Authentication;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Objects;
import java.util.Optional;
@Service
public class Seguridad {
   @Autowired
   private JwtService jwtService;
    /**
     * devuelve el usuario que hace la peticion
     * @return
     */
    public String getCorreoPeticion(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && authentication.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String correo = userDetails.getUsername();

            // Aquí puedes usar el username para obtener más detalles del usuario si es necesario

            return correo;
        }
        return null;
    }

    /**
     *
     * @return cliente,tecnico,tecnico_jefe,admin
     */
    public String getRol() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && authentication.getPrincipal() instanceof UserDetails) {
            HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
            String tokenHeader = request.getHeader("Authorization");

            if (tokenHeader != null && tokenHeader.startsWith("Bearer ")) {
                String token = tokenHeader.substring(7); // Eliminar el prefijo "Bearer "

                // Obtener el "rol" del token
                String rol = jwtService.getRoleFromToken(token);

                // Crear y devolver el objeto Rol con la información obtenida del token
                return rol;
            }
        }
        return null;
    }

    public Long getIdUsuario() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && authentication.getPrincipal() instanceof UserDetails) {
            HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
            String tokenHeader = request.getHeader("Authorization");

            if (tokenHeader != null && tokenHeader.startsWith("Bearer ")) {
                String token = tokenHeader.substring(7); // Eliminar el prefijo "Bearer "

                // Obtener el "id" del token
                Long id = jwtService.getIdFromToken(token);

                // Crear y devolver el objeto id con la información obtenida del token
                System.out.println("Id usuario = "+id);
                return id;
            }
        }
        return null;
    }

    public boolean isAdmin(){
        return getRol().equalsIgnoreCase("administrador");
    }
    public boolean isTrabajador(){
        return getRol().equalsIgnoreCase("tecnico") || getRol().equalsIgnoreCase("tecnico_jefe") || getRol().equalsIgnoreCase("administrador");
    }
    public boolean isTecnicoJefe(){
        return getRol().equalsIgnoreCase("tecnico");
    }
    public boolean isElMismo(String correo){
        return getCorreoPeticion().equals(correo);
    }
    public boolean isCliente(){
        return getRol().equalsIgnoreCase("cliente");
    }
}
