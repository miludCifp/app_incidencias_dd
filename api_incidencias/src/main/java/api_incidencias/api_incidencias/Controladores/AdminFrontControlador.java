package api_incidencias.api_incidencias.Controladores;

import api_incidencias.api_incidencias.Servicios.Seguridad;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("app_trabajador")
public class AdminFrontControlador {
    @Autowired
    private Seguridad seguridad;

    @GetMapping("/ajustes_perfil_user")
    public String ajustes_perfil_user() {
        if(seguridad.isAdmin())
        return "app_trabajador/ajustes_perfil_user";
        return " error_404";
    }
    @GetMapping("/inicio")
    public String inicio() {
        if(seguridad.isAdmin())
        return "app_trabajador/inicio";
        return " error_404";
    }
    @GetMapping("/add_incidencias")
    public String add_incidencias() {
        if(seguridad.isAdmin())
        return "app_trabajador/add_incidencias";
        return " error_404";
    }
    @GetMapping("/add_user_cliente")
    public String add_user_cliente() {
        if(seguridad.isAdmin())
        return "app_trabajador/add_user_cliente";
        return " error_404";
    }

    @GetMapping("/add_user_trabajador")
    public String add_user_trabajador() {
        if(seguridad.isAdmin())
        return "app_trabajador/add_user_trabajador";
        return " error_404";
    }


    @GetMapping("/gestion_users_clientes")
    public String gestion_users_clientes() {
        if(seguridad.isAdmin())
        return "app_trabajador/gestion_users_clientes";
        return " error_404";
    }


    @GetMapping("/gestion_users_trabajadores")
    public String gestion_users_trabajadores() {
        if(seguridad.isAdmin())
        return "app_trabajador/gestion_users_trabajadores";
        return " error_404";
    }


    @GetMapping("/ver_incidencias")
    public String ver_incidencias() {
        if(seguridad.isAdmin())
        return "app_trabajador/ver_incidencias";
        return " error_404";
    }


    @GetMapping("/ver_partes_trabajo")
    public String ver_partes_trabajo() {
        if(seguridad.isAdmin())
        return "app_trabajador/ver_partes_trabajo";
        return " error_404";
    }
}
