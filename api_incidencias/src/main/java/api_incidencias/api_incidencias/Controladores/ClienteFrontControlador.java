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
    @Autowired
    private Seguridad seguridad;

    @GetMapping("/ajustes_perfil_user")
    public String ajustes_perfil_user() {
        if (seguridad.isCliente())
        return "app_cliente/ajuste_perfil_user";
        return " error_404";
    }

    @GetMapping("/inicio")
    public String inicio() {
        if (seguridad.isCliente())
        return "app_cliente/inicio";
        return " error_404";
    }


    @GetMapping("/add_incidencias")
    public String add_incidencias() {
        if (seguridad.isCliente())
        return "app_cliente/add_incidencias";
        return " error_404";
    }


    @GetMapping("/ver_incidencias")
    public String ver_incidencias() {
        if (seguridad.isCliente())
        return "app_cliente/ver_incidencias";
        return " error_404";
    }
    @GetMapping("/ver_partes_trabajo")
    public String ver_partes_trabajo() {
        if (seguridad.isCliente())
        return "app_cliente/ver_partes_trabajo";
        return " error_404";
    }


}
