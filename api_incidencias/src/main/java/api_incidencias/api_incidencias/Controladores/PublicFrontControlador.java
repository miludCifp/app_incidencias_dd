package api_incidencias.api_incidencias.Controladores;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
public class PublicFrontControlador {
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

}
