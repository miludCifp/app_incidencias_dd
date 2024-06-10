package api_incidencias.api_incidencias.Controladores;

import api_incidencias.api_incidencias.Servicios.ParteTrabajoService;
import api_incidencias.api_incidencias.Servicios.Seguridad;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("app_tecnico")
public class TecnicoFrontControlador {
    @Autowired
    private Seguridad seguridad;

    @GetMapping("/ajustes_perfil_user")
    public String ajustes_perfil_user() {
        if (seguridad.isTrabajador())
        return "app_tecnico/ajustes_perfil_user";
        return null;
    }
    @GetMapping("/inicio")
    public String inicio() {
        if (seguridad.isTrabajador())
        return "app_tecnico/inicio";
        return null;
    }
    @GetMapping("/add_incidencias")
    public String add_incidencias() {
        if (seguridad.isTrabajador())
        return "app_tecnico/add_incidencias";
        return null;
    }

    @GetMapping("/ver_incidencias")
    public String ver_incidencias() {
        if (seguridad.isTrabajador())
        return "app_tecnico/ver_incidencias";
        return null;
    }

    @GetMapping("/ver_partes_trabajo")
    public String ver_partes_trabajo() {
        if (seguridad.isTrabajador())
        return "app_tecnico/ver_partes_trabajo";
        return null;
    }
}
