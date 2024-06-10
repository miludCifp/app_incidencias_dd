package api_incidencias.api_incidencias.Controladores;

import api_incidencias.api_incidencias.Servicios.Seguridad;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("app_cliente")
public class ClienteFrontControlador {
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
    @GetMapping("/ver_partes_trabajo")
    public String ver_partes_trabajo() {
        return "app_cliente/ver_partes_trabajo";
    }


}
