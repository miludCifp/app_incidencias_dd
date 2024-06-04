package api_incidencias.api_incidencias.SecurityConfig;

import api_incidencias.api_incidencias.Entidades.Clases.Trabajador;
import api_incidencias.api_incidencias.Entidades.Enum.Genero;
import api_incidencias.api_incidencias.Entidades.Enum.Rol;
import api_incidencias.api_incidencias.Servicios.TrabajadorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;


import java.time.LocalDate;

@Component
public class AdminInitializer implements ApplicationListener<ContextRefreshedEvent> {

    private final TrabajadorService trabajadorService;


    public AdminInitializer(TrabajadorService trabajadorService) {
        this.trabajadorService = trabajadorService;
    }

    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        if (!trabajadorService.existsByRol(Rol.administrador)) {
            Trabajador admin = new Trabajador();
            admin.setRol(Rol.administrador);
            admin.setNombre("Administrador");
            admin.setFechaRegistro(LocalDate.now());
            admin.setCorreoElectronico("direccion@dondigital.es");
            admin.setContrasena("admin");
            admin.setGenero(Genero.hombre);
            admin.setImagenPerfil("userLogoHTrabajador.png");
            // Guardar el usuario administrador
            trabajadorService.addTrabajador(admin);
        }
    }
}


