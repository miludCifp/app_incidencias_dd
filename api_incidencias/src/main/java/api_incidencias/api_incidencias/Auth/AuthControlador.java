package api_incidencias.api_incidencias.Auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/auth")
public class AuthControlador {
    @Autowired
    private AuthService authServicio;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request){
        return ResponseEntity.ok(authServicio.login(request));
    }


    @PostMapping("/registrar-cliente")
    public ResponseEntity<AuthResponse> registro(@RequestBody RegisterRequest_Cliente request){
        System.out.println("Registramos cliente nuevo");
        return ResponseEntity.ok(authServicio.registrarCliente(request));
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
