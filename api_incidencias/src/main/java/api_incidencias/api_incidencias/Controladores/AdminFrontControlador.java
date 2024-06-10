package api_incidencias.api_incidencias.Controladores;

import api_incidencias.api_incidencias.Servicios.Seguridad;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("app_trabajador")
public class AdminFrontControlador {

    @GetMapping("/ajustes_perfil_user")
    public String ajustes_perfil_user() {
        return "app_trabajador/ajustes_perfil_user";
    }
    @GetMapping("/inicio")
    public String inicio() {
        return "app_trabajador/inicio";
    }
    @GetMapping("/add_incidencias")
    public String add_incidencias() {
        return "app_trabajador/add_incidencias";
    }
    @GetMapping("/add_user_cliente")
    public String add_user_cliente() {
        return "app_trabajador/add_user_cliente";
    }


    @GetMapping("/add_user_trabajador")
    public String add_user_trabajador() {
        return "app_trabajador/add_user_trabajador";
    }


    @GetMapping("/gestion_users_clientes")
    public String gestion_users_clientes() {
        return "app_trabajador/gestion_users_clientes";
    }


    @GetMapping("/gestion_users_trabajadores")
    public String gestion_users_trabajadores() {
        return "app_trabajador/gestion_users_trabajadores";
    }


    @GetMapping("/ver_incidencias")
    public String ver_incidencias() {
        return "app_trabajador/ver_incidencias";
    }


    @GetMapping("/ver_partes_trabajo")
    public String ver_partes_trabajo() {
        return "app_trabajador/ver_partes_trabajo";
    }



}
