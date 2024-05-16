package api_incidencias.api_incidencias.Controladores;

import api_incidencias.api_incidencias.Entidades.Clases.Usuario;
import api_incidencias.api_incidencias.Servicios.Seguridad;
import api_incidencias.api_incidencias.Servicios.ServicioResetContraseña;
import api_incidencias.api_incidencias.Servicios.UsuarioService;
import jakarta.annotation.security.PermitAll;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path = "api/v1/usuarios")
public class UsuarioControlador {
    @Autowired
    private UsuarioService userServicio;
    @Autowired
    private Seguridad seguridad;
    @Autowired
    private ServicioResetContraseña servicioResetContraseña;

    /*
    @GetMapping("/registro")
    public String mostrarFormularioRegistro(Model model) {
        model.addAttribute("usuario", new Usuario());
        return "registro";
    }

    @PostMapping("/registro")
    public String registrarUsuario(@ModelAttribute Usuario usuario) {
        userServicio.addUser(usuario);
        return "redirect:/login";
    }

    @GetMapping("/login")
    public String mostrarFormularioLogin() {
        return "login";

    }*/



    @GetMapping
    public List<Usuario> getUsuarios(){
        return userServicio.getUser();
    }

    @GetMapping("/{idUser}")
    public Optional<Usuario> getUserPorId(@PathVariable("idUser") Long idUser){
        return userServicio.getUser(idUser);
    }

    @GetMapping("/email/{emailUser}")
    public Optional<Usuario> getUserPorEmail(@PathVariable("emailUser") String email){
        return userServicio.getUser(email);
    }

    @GetMapping("/obtener-imagen-user")
    public ResponseEntity<InputStreamResource> obtenerImagen() {
        return userServicio.getImagenUser(seguridad.getIdUsuario());
    }

    @PostMapping("/imagen")
    public ResponseEntity<String> subirImagenPerfil(@RequestParam("file") MultipartFile file) {
        String urlImagen = userServicio.subirImagen(seguridad.getIdUsuario(), file);
        return new ResponseEntity<>(urlImagen, HttpStatus.CREATED);
    }

    /*
    @PostMapping
    public ResponseEntity<Usuario> crearUser(@RequestBody Usuario user){
        Usuario nuevoUsuario = userServicio.addUser(user);
        return new ResponseEntity<>(nuevoUsuario, HttpStatus.CREATED);
    }
    */
    /*
    @PutMapping("/{idUser}")
    public ResponseEntity<Usuario> actualizarUser(@PathVariable Long idUser, @RequestBody Usuario user) {
        Usuario userActualizado = userServicio.updateUser(idUser, user);
        if (userActualizado != null) {
            return new ResponseEntity<>(userActualizado, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @PutMapping("/update-contraseña/{idUser}")
    public ResponseEntity<Usuario> actualizarUserContraseña(@PathVariable Long idUser, @RequestBody Usuario user) {
        Usuario userActualizado = userServicio.updateUserConContraseña(idUser, user);
        if (userActualizado != null) {
            return new ResponseEntity<>(userActualizado, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

    }
    */
    @GetMapping("/codigo-contraseña/{correo}")
    @PermitAll // Permitir acceso sin autenticación
    public String enviarCorreoResetContraseña(@PathVariable("correo") String correo) {
        servicioResetContraseña.enviarCorreoResetContraseña(correo);
        return "Se ha enviado un correo con el código de restablecimiento de contraseña.";
    }


    @PutMapping("/cambiar-contraseña/{codigo}")
    @Secured("IS_AUTHENTICATED_ANONYMOUSLY") // Permitir acceso sin autenticación
    public ResponseEntity<?> resetContraseña(@PathVariable String codigo, @RequestBody String nuevaContraseña) {
        System.out.println("contraseña nueva = "+nuevaContraseña);
        // Verificar si el código proporcionado es válido
        if (servicioResetContraseña.isValidCode(codigo)) {
            // Modificar la contraseña del usuario asociado al código
            if (servicioResetContraseña.modificarContraseña(codigo, nuevaContraseña)) {
                return ResponseEntity.ok("Contraseña modificada correctamente");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al modificar la contraseña");
            }
        } else {
            return ResponseEntity.badRequest().body("Código de restablecimiento de contraseña no válido");
        }
    }

    @DeleteMapping("/{idUser}")
    public ResponseEntity<String> eliminarUser(@PathVariable("idUser") Long idUser){
        return userServicio.deleteUser(idUser);
    }
}
