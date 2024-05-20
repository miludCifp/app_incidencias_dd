package api_incidencias.api_incidencias.Controladores;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("app_cliente")
public class ClienteFrontControlador {
    @GetMapping("/login")
    public String login() {
        return "login";
    }
    @GetMapping("/recup_password")
    public String recup_password() {
        return "recup_password";
    }
    @GetMapping("/register_user")
    public String register_user() {
        return "register_user";
    }
    @GetMapping("/ajustes_perfil_user")
    public String ajustes_perfil_user() {
        return "app_cliente/ajustes_perfil_user";
    }
    @GetMapping("/inicio")
    public String inicio() {
        return "app_cliente/inicio";
    }
    @GetMapping("/add_incidencias")
    public String add_incidencias() {
        return "app_cliente/add_incidencias";
    }

    @GetMapping("/ver_incidencias")
    public String ver_incidencias() {
        return "app_cliente/ver_incidencias";
    }

}
