package api_incidencias.api_incidencias.Controladores;

import api_incidencias.api_incidencias.Servicios.Seguridad;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("app_trabajador")
public class AdminFrontControlador {
    /*
    @GetMapping("/login")
    public String index() {
        return "login"; // Se refiere al archivo login.html en src/main/resources/templates
    }
    @GetMapping("/recup_password")
    public String recup_password() {
        return "recup_password";
    }
    @GetMapping("/register_user")
    public String register_user() {
        return "register_user";
    }
     */
    @Autowired
    private Seguridad seguridad;
    @GetMapping("/ajustes_perfil_user")
    public String ajustes_perfil_user() {
        if (seguridad.isAdmin())
        return "app_trabajador/ajustes_perfil_user";
        return null;
    }
    @GetMapping("/inicio")
    public String inicio() {
        if (seguridad.isAdmin())
        return "app_trabajador/inicio";
        return null;
    }
    @GetMapping("/add_incidencias")
    public String add_incidencias() {
        if (seguridad.isAdmin())
        return "app_trabajador/add_incidencias";
        return null;
    }
    @GetMapping("/add_user_cliente")
    public String add_user_cliente() {
        if (seguridad.isAdmin())
        return "app_trabajador/add_user_cliente";
        return null;
    }

    @GetMapping("/add_user_trabajador")
    public String add_user_trabajador() {
        if (seguridad.isAdmin())
        return "app_trabajador/add_user_trabajador";
        return null;
    }

    @GetMapping("/gestion_users_clientes")
    public String gestion_users_clientes() {
        if (seguridad.isAdmin())
        return "app_trabajador/gestion_users_clientes";
        return null;
    }

    @GetMapping("/gestion_users_trabajadores")
    public String gestion_users_trabajadores() {
        if (seguridad.isAdmin())
        return "app_trabajador/gestion_users_trabajadores";
        return null;
    }

    @GetMapping("/ver_incidencias")
    public String ver_incidencias() {
        if (seguridad.isAdmin())
        return "app_trabajador/ver_incidencias";
        return null;
    }

    @GetMapping("/ver_partes_trabajo")
    public String ver_partes_trabajo() {
        if (seguridad.isAdmin())
        return "app_trabajador/ver_partes_trabajo";
        return null;
    }
}
