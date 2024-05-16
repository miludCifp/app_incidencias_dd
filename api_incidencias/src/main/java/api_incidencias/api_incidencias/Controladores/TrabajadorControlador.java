package api_incidencias.api_incidencias.Controladores;

import api_incidencias.api_incidencias.Entidades.Clases.Cliente;
import api_incidencias.api_incidencias.Entidades.Clases.Trabajador;
import api_incidencias.api_incidencias.Servicios.ClienteService;
import api_incidencias.api_incidencias.Servicios.TrabajadorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path = "api/v1/trabajadores")
public class TrabajadorControlador {
    @Autowired
    private TrabajadorService trabajadorService;
    @GetMapping
    public List<Trabajador> getTrabajador(){
        return trabajadorService.getTrabajador();
    }

    @GetMapping("/{idUser}")
    public Optional<Trabajador> getTrabajadorPorId(@PathVariable("idUser") Long idUser){
        return trabajadorService.getTrabajador(idUser);
    }

    @GetMapping("/email/{emailUser}")
    public Optional<Trabajador> getTrabajadorPorEmail(@PathVariable("emailUser") String email){
        return trabajadorService.getTrabajador(email);
    }

    /*@PostMapping
    public ResponseEntity<Trabajador> crearTrabajador(@RequestBody Trabajador trabajador){
        Trabajador trabajadorNuevo = trabajadorService.addTrabajador(trabajador);
        return new ResponseEntity<>(trabajadorNuevo, HttpStatus.CREATED);
    }*/

    @PutMapping("/{idUser}")
    public ResponseEntity<Trabajador> actualizarTrabajador(@PathVariable Long idUser, @RequestBody Trabajador trabajador) {
        Trabajador trabajadorActualizado = trabajadorService.updateTrabajador(idUser, trabajador);
        if (trabajadorActualizado != null) {
            return new ResponseEntity<>(trabajadorActualizado, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @PutMapping("/update-con-contraseña/{idUser}")
    public ResponseEntity<Trabajador> actualizarTrabajadorContraseña(@PathVariable Long idUser, @RequestBody Trabajador trabajador) {
        Trabajador trabajadorActualizado = trabajadorService.updateTrabajadorContraseña(idUser, trabajador);
        if (trabajadorActualizado != null) {
            return new ResponseEntity<>(trabajadorActualizado, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

    }

    @DeleteMapping("/{idUser}")
    public ResponseEntity<String> eliminarTrabajador(@PathVariable("idUser") Long idUser){
        return trabajadorService.deleteTrabajador(idUser);
    }
}
