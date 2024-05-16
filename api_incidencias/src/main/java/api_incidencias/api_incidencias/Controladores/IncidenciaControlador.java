package api_incidencias.api_incidencias.Controladores;

import api_incidencias.api_incidencias.Entidades.Clases.Cliente;
import api_incidencias.api_incidencias.Entidades.Clases.Incidencia;
import api_incidencias.api_incidencias.Entidades.Clases.Usuario;
import api_incidencias.api_incidencias.Entidades.DTO.IncidenciaDTO;
import api_incidencias.api_incidencias.Entidades.Enum.Estado;
import api_incidencias.api_incidencias.Servicios.ClienteService;
import api_incidencias.api_incidencias.Servicios.IncidenciaService;
import api_incidencias.api_incidencias.Servicios.Seguridad;
import api_incidencias.api_incidencias.Servicios.UsuarioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
@RestController
@RequestMapping(path = "api/v1/incidencias")
public class IncidenciaControlador {
    @Autowired
    private IncidenciaService incidenciaServicio;
    @Autowired
    private ClienteService clienteServicio;
    @Autowired
    private Seguridad seguridad;

    @GetMapping
    public List<Incidencia> getIncidencias(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // Verificar si la autenticación es válida y si contiene detalles del usuario
        if (authentication != null && authentication.isAuthenticated() && authentication.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String username = userDetails.getUsername();
            System.out.println("USUARIO = "+username);
            // Aquí puedes usar el username para obtener más detalles del usuario si es necesario
        }
        return incidenciaServicio.getIncidencias();
    }

    @GetMapping("/{idIncidencia}")
    public Optional<Incidencia> getIncidenciaPorId(@PathVariable("idIncidencia") String idIncidencia){
        return incidenciaServicio.getIncidencias(idIncidencia);
    }
    @GetMapping("/incidencias-reabiertas/{idIncidencia}")
    public List<Incidencia> getIncidenciasReabiertas(@PathVariable("idIncidencia") String idIncidencia){
        return incidenciaServicio.getIncidenciasReabiertas(idIncidencia);
    }
    @GetMapping("/cliente/{idCliente}")
    public List<Incidencia> getIncidenciaCliente(@PathVariable("idCliente") Long idCliente){
        return incidenciaServicio.getIncidenciasCliente(idCliente);
    }

    @PostMapping
    public ResponseEntity<Incidencia> crearIncidencia(@RequestBody IncidenciaDTO incidenciaDTO){
        Incidencia incidencia = cargarDTO(incidenciaDTO);
        Incidencia incidenciaGuardada = incidenciaServicio.addIncidencia(incidencia);
        return new ResponseEntity<>(incidenciaGuardada, HttpStatus.CREATED);
    }

    /**
     * El json tiene que tener el id de la incidencia principal y los datos de la incidencia reabierta
     * @param incidenciaDTO
     * @return
     */
    @PostMapping("/reabrir-incidencia")
    public ResponseEntity<Incidencia> crearIncidenciaReabierta(@RequestBody IncidenciaDTO incidenciaDTO){
        Incidencia incidencia = cargarDTO(incidenciaDTO);
        Incidencia incidenciaGuardada = incidenciaServicio.addIncidenciaReabierta(incidencia);
        return new ResponseEntity<>(incidenciaGuardada, HttpStatus.CREATED);
    }

    @PutMapping("/{idIncidencia}")
    public ResponseEntity<Incidencia> actualizarIncidencia(@PathVariable String idIncidencia, @RequestBody IncidenciaDTO incidenciaDTO) {

        Incidencia incidencia = cargarDTO(incidenciaDTO);

        Incidencia incidenciaActualizada = incidenciaServicio.updateIncidencia(idIncidencia, incidencia);
        if (incidenciaActualizada != null) {
            return new ResponseEntity<>(incidenciaActualizada, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

    }

    @DeleteMapping("/{idIncidencia}")
    public ResponseEntity<String> eliminarIncidencia(@PathVariable("idIncidencia") String idIncidencia){
        return incidenciaServicio.deleteIncidencia(idIncidencia);
    }


    private Incidencia cargarDTO(IncidenciaDTO incidenciaDTO){
        Incidencia incidencia = new Incidencia();

        incidencia.setIdIncidencia(incidenciaDTO.getIdIncidencia());
        incidencia.setTitulo(incidenciaDTO.getTitulo());
        incidencia.setDescripcion(incidenciaDTO.getDescripcion());
        incidencia.setFechaCreacion(LocalDateTime.now());
        incidencia.setEstado(incidenciaDTO.getEstado());
        incidencia.setPrioridad(incidenciaDTO.getPrioridad());

        Optional<Cliente> optionalCliente = clienteServicio.getCliente(seguridad.getIdUsuario());

        if (optionalCliente.isPresent()){
            incidencia.setUsuarioCliente(optionalCliente.get());
        }
        return incidencia;
    }
}
