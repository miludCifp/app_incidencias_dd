package api_incidencias.api_incidencias.Controladores;

import api_incidencias.api_incidencias.Entidades.Clases.Cliente;
import api_incidencias.api_incidencias.Entidades.Clases.Usuario;
import api_incidencias.api_incidencias.Servicios.ClienteService;
import api_incidencias.api_incidencias.Servicios.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path = "api/v1/clientes")
public class ClienteControlador {
    @Autowired
    private ClienteService clienteServicio;
    @GetMapping
    public List<Cliente> getClientes(){
        return clienteServicio.getCliente();
    }

    @GetMapping("/{idUser}")
    public Optional<Cliente> getClientePorId(@PathVariable("idUser") Long idUser){
        return clienteServicio.getCliente(idUser);
    }

    @GetMapping("/email/{emailUser}")
    public Optional<Cliente> getClientePorEmail(@PathVariable("emailUser") String email){
        return clienteServicio.getCliente(email);
    }

    /*@PostMapping
    public ResponseEntity<Cliente> crearCliente(@RequestBody Cliente cliente){
        Cliente nuevoCliente = clienteServicio.addCliente(cliente);
        return new ResponseEntity<>(nuevoCliente, HttpStatus.CREATED);
    }*/

    @PutMapping("/{idUser}")
    public ResponseEntity<Cliente> actualizarCliente(@PathVariable Long idUser, @RequestBody Cliente cliente) {
        Cliente clienteActualizado = clienteServicio.updateCliente(idUser, cliente);
        if (clienteActualizado != null) {
            return new ResponseEntity<>(clienteActualizado, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @PutMapping("/update-con-contraseña/{idUser}")
    public ResponseEntity<Cliente> actualizarClienteContraseña(@PathVariable Long idUser, @RequestBody Cliente cliente) {
        Cliente clienteActualizado = clienteServicio.updateClienteContraseña(idUser, cliente);
        if (clienteActualizado != null) {
            return new ResponseEntity<>(clienteActualizado, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @DeleteMapping("/{idUser}")
    public ResponseEntity<String> eliminarCliente(@PathVariable("idUser") Long idUser){
        return clienteServicio.deleteCliente(idUser);
    }
}
