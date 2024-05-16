package api_incidencias.api_incidencias.Controladores;

import api_incidencias.api_incidencias.Entidades.Clases.ParteTrabajo;
import api_incidencias.api_incidencias.Entidades.Clases.TiempoEmpleado;
import api_incidencias.api_incidencias.Entidades.DTO.TiempoEmpleadoDTO;
import api_incidencias.api_incidencias.Servicios.ParteTrabajoService;
import api_incidencias.api_incidencias.Servicios.TiempoEmpleadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path = "api/v1/tiempo-empleado")
public class TiempoEmpControlador {
    @Autowired
    private TiempoEmpleadoService tiempoEmpleadoServicio;

    @Autowired
    private ParteTrabajoService parteTbServicio;

    @GetMapping
    public List<TiempoEmpleado> getTiempoEmpleado(){
        return tiempoEmpleadoServicio.getTiempoEmpleado();
    }

    @GetMapping("/{idTiempoEmpleado}")
    public Optional<TiempoEmpleado> getTiempoEmpleadoPorId(@PathVariable("idTiempoEmpleado") Long idTiempoEmpleado){
        return tiempoEmpleadoServicio.getTiempoEmpleadoPorId(idTiempoEmpleado);
    }

    @GetMapping("parte-trabajo/{idOrden}")
    public List<TiempoEmpleado> getTiempoEmpleadoPorIdOrden(@PathVariable("idOrden") Long idOrden){
        return tiempoEmpleadoServicio.getTiempoEmpleadoPorIdOrden(idOrden);
    }
    @GetMapping("parte-trabajo-no-terminado/{idOrden}")
    public List<TiempoEmpleado> getTiempoEmpleadoNoTerminado(@PathVariable("idOrden") Long idOrden){
        return tiempoEmpleadoServicio.getTiempoEmpleadoNoTerminado(idOrden);
    }

    @PostMapping
    public ResponseEntity<TiempoEmpleado> crearTiempoEmpleado(@RequestBody TiempoEmpleadoDTO timepoEmpDTO){

        TiempoEmpleado tiempoEmpleado = cargarDTO(timepoEmpDTO);

        TiempoEmpleado nuevoTiempoEmpleado = tiempoEmpleadoServicio.addTiempoEmpleado(tiempoEmpleado);
        return new ResponseEntity<>(nuevoTiempoEmpleado, HttpStatus.CREATED);
    }

    @PutMapping("/{idTiempoEmpleado}")
    public ResponseEntity<TiempoEmpleado> actualizarTiempoEmpleado(@PathVariable Long idTiempoEmpleado, @RequestBody TiempoEmpleadoDTO timepoEmpDTO) {
        System.out.println("holaa id = "+idTiempoEmpleado);
        TiempoEmpleado tiempoEmpleado = cargarDTO(timepoEmpDTO);

        TiempoEmpleado tiempoEmpActualizado = tiempoEmpleadoServicio.updateTiempoEmpleado(idTiempoEmpleado, tiempoEmpleado);
        if (tiempoEmpActualizado != null) {
            return new ResponseEntity<>(tiempoEmpActualizado, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

    }

    @DeleteMapping("/{idTiempoEmpleado}")
    public ResponseEntity<String> eliminarTiempoEmpleado(@PathVariable("idTiempoEmpleado") Long idTiempoEmpleado){
        return tiempoEmpleadoServicio.deleteTiempoUsado(idTiempoEmpleado);
    }

    private TiempoEmpleado cargarDTO(TiempoEmpleadoDTO tiempoEmpleadoDTO){
        TiempoEmpleado tiempoEmpleado = new TiempoEmpleado();

        tiempoEmpleado.setIdTiempoEmpleado(tiempoEmpleadoDTO.getIdTiempoEmpleado());
        tiempoEmpleado.setFecha(tiempoEmpleadoDTO.getFecha());
        tiempoEmpleado.setHoraEntrada(tiempoEmpleadoDTO.getHoraEntrada());
        tiempoEmpleado.setHoraSalida(tiempoEmpleadoDTO.getHoraSalida());
         tiempoEmpleado.setMotivoPausa(tiempoEmpleadoDTO.getMotivoPausa());
        tiempoEmpleado.setModoResolucion(tiempoEmpleadoDTO.getModoResolucion());

        Optional<ParteTrabajo> optionalparteTb = parteTbServicio.getPartesTrabajoPorId(tiempoEmpleadoDTO.getIdOrdenParteTb());

        if (optionalparteTb.isPresent()){
            tiempoEmpleado.setParteTrabajo(optionalparteTb.get());
        }

        return tiempoEmpleado;
    }
}
