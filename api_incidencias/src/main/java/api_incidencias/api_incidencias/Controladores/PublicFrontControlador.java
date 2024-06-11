package api_incidencias.api_incidencias.Controladores;

import api_incidencias.api_incidencias.Jwt.JwtService;
import api_incidencias.api_incidencias.Servicios.Seguridad;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
public class PublicFrontControlador {

    @Autowired
    private Seguridad seguridad;

    @Autowired
    private JwtService jwtService;

    @GetMapping("login")
    public String iniciarSesion() {
        System.out.println("-----> Iniciando sesion desde el controlador publico");
        return "login"; // Se refiere al archivo login.html en src/main/resources/templates
    }
    @GetMapping("register_user")
    public String registrarCuenta() {
        return "register_user";
    }
    @GetMapping("recup_password")
    public String recupPassword() {
        return "recup_password";
    }

    @GetMapping("error_401")
    public String error401() {
        return "error_401";
    }
    @GetMapping("error_404")
    public String error404() {
        return "error_404";
    }
    @GetMapping("error_500")
    public String error500() {
        return "error_500";
    }

    /**************
    @GetMapping("inicio")
    public String inicio(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7); // Eliminar el prefijo "Bearer "
        }

        //String rolUser = jwtService.getRoleFromToken(token);

        if (seguridad.isAdmin()) {
            return "app_trabajador/inicio";
        } else if (seguridad.isTrabajador()) {
            return "app_tecnico/inicio";
        } else if (seguridad.isCliente()) {
            return "app_cliente/inicio";
        } else {
            return "error_404"; // Ajusta esta línea para redirigir a una página de error adecuada
        }
    }
    **********/
    @GetMapping("inicio")
    public String inicio() {

        if (seguridad.isAdmin()) {
            return "app_trabajador/inicio";
        } else if (seguridad.isTrabajador()) {
            return "app_tecnico/inicio";
        } else if (seguridad.isCliente()) {
            return "app_cliente/inicio";
        } else {
            return "error_404"; // Ajusta esta línea para redirigir a una página de error adecuada
        }
    }

/*************
    @GetMapping("inicio/{token}")
    public String inicio(@PathVariable("token") String token) {

        String rolUser = jwtService.getRoleFromToken(token);

        if ("administrador".equalsIgnoreCase(rolUser)) {
            return "app_trabajador/inicio";
        } else if ("tecnico".equalsIgnoreCase(rolUser)) {
            return "app_tecnico/inicio";
        } else if ("cliente".equalsIgnoreCase(rolUser)) {
            return "app_cliente/inicio";
        } else {
            return "error_404"; // Ajusta esta línea para redirigir a una página de error adecuada
        }
    }
 *************/

}
