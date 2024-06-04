package api_incidencias.api_incidencias.Auth;

import api_incidencias.api_incidencias.Servicios.AvisosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/auth")
public class AuthControlador {
    @Autowired
    private AuthService authServicio;

    @Autowired
    private AvisosService servicioAvisos;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request){
        return ResponseEntity.ok(authServicio.login(request));
    }

    /*
    @PostMapping("/registrar-cliente")
    public ResponseEntity<AuthResponse> registro(@RequestBody RegisterRequest_Cliente request){
        System.out.println("Registramos cliente nuevo");
        return ResponseEntity.ok(authServicio.registrarCliente(request));
    }
     */
    @PostMapping("/registrar-cliente")
    public ResponseEntity<AuthResponse> registro(@RequestBody RegisterRequest_Cliente request){
        System.out.println("Registramos cliente nuevo");
        try {
            AuthResponse authResponse = authServicio.registrarCliente(request);
            servicioAvisos.avisoNuevoUsuario("cliente", request);
            return ResponseEntity.ok(authResponse);
        } catch (Exception e) {
            System.err.println("Error al registrar el cliente: " + e.getMessage());
            // Manejar la excepción adecuadamente, podría ser registrarla o retornar una respuesta de error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @PostMapping("/registrar-trabajador")
    public ResponseEntity<AuthResponse> registro(@RequestBody RegisterRequest_Trabajador request){
        AuthResponse au = authServicio.registrarTrabajador(request);
        if (au==null){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
        return ResponseEntity.ok(au);
    }


}
