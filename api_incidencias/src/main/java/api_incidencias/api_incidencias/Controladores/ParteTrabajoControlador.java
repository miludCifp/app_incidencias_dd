package api_incidencias.api_incidencias.Controladores;

import api_incidencias.api_incidencias.Entidades.Clases.Incidencia;
import api_incidencias.api_incidencias.Entidades.Clases.ParteTrabajo;
import api_incidencias.api_incidencias.Entidades.Clases.Trabajador;
import api_incidencias.api_incidencias.Entidades.Clases.Usuario;
import api_incidencias.api_incidencias.Entidades.DTO.ParteTrabajoDTO;
import api_incidencias.api_incidencias.Pdf.GenerarPDF;
import api_incidencias.api_incidencias.Servicios.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path = "api/v1/parte-trabajo")
public class ParteTrabajoControlador {
    @Autowired
    private ParteTrabajoService parteTrabajoServicio;
    @Autowired
    private IncidenciaService incidenciaServicio;
    @Autowired
    private TrabajadorService trabajadorService;
    @Autowired
    private Seguridad seguridad;

    @GetMapping
    public List<ParteTrabajo> getPartesTrabajo(){
        return parteTrabajoServicio.getPartesTrabajo();
    }

    @GetMapping("/{idOrden}")
    public Optional<ParteTrabajo> getPartesTrabajoPorId(@PathVariable("idOrden") Long idOrden){
        return parteTrabajoServicio.getPartesTrabajoPorId(idOrden);
    }

    @GetMapping("/incidencia/{idIncidencia}")
    public ParteTrabajo getPartesTrabajoIncidencia(@PathVariable("idIncidencia") String idIncidencia){
        return parteTrabajoServicio.getPartesTrabajoPorIncidencia(idIncidencia);
    }

    @GetMapping("/incidencia-no-terminada/{idIncidencia}")
    public List<ParteTrabajo> getPartesTrabajoNoTerminado(@PathVariable("idIncidencia") String idIncidencia){
        return parteTrabajoServicio.getPartesTrabajosNoTerminado(seguridad.getIdUsuario(),idIncidencia);
    }

    @GetMapping(value = "/generar-pdf/{idOrden}", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> enviarpdf(@PathVariable("idOrden") Long idOrden){
        ParteTrabajo parteTrabajo;
        Optional<ParteTrabajo> optional = parteTrabajoServicio.getPartesTrabajoPorId(idOrden);
        if (optional.isPresent()){
            parteTrabajo = optional.get();
            return GenerarPDF.generarPDF(parteTrabajo);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<ParteTrabajo> crearParteTrabajo(@RequestBody ParteTrabajoDTO parteTrabajoDTO){

        ParteTrabajo parteTrabajo = cargarDTO(parteTrabajoDTO);

        ParteTrabajo parteTrabajoGuardado = parteTrabajoServicio.addParteTrabajo(parteTrabajo);
        return new ResponseEntity<>(parteTrabajoGuardado, HttpStatus.CREATED);
    }

    @PutMapping("/{idOrden}")
    public ResponseEntity<ParteTrabajo> actualizarParteTrabajo(@PathVariable Long idOrden, @RequestBody ParteTrabajoDTO parteTrabajoDTO) {

        ParteTrabajo parteTrabajo = cargarDTO(parteTrabajoDTO);

        ParteTrabajo parteTrabajoActualizado = parteTrabajoServicio.updateParteTrabajo(idOrden, parteTrabajo);
        if (parteTrabajoActualizado != null) {
            return new ResponseEntity<>(parteTrabajoActualizado, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

    }

    @DeleteMapping("/{idOrden}")
    public ResponseEntity<String> eliminarParteTrabajo(@PathVariable("idOrden") Long idOrden){
        return parteTrabajoServicio.deleteParteTrabajo(idOrden);
    }


    private ParteTrabajo cargarDTO(ParteTrabajoDTO parteTrabajoDTO){
        ParteTrabajo parteTrabajo = new ParteTrabajo();

        parteTrabajo.setIdOrden(parteTrabajoDTO.getIdOrden());
        Optional<Incidencia> optionalIncidencia = incidenciaServicio.getIncidencias(parteTrabajoDTO.getIdIncidencia());
        if (optionalIncidencia.isPresent()){
            parteTrabajo.setIncidencia(optionalIncidencia.get());
        }
        Optional<Trabajador> optionalUsuario = trabajadorService.getTrabajador(parteTrabajoDTO.getIdTecnico());
        if(optionalUsuario.isPresent()){
            parteTrabajo.setTecnico(optionalUsuario.get());
        }
        parteTrabajo.setTrabajoRealizado(parteTrabajoDTO.getTrabajoRealizado());
        parteTrabajo.setDiagnostico(parteTrabajoDTO.getDiagnostico());
        parteTrabajo.setObservaciones(parteTrabajoDTO.getObservaciones());
        parteTrabajo.setCosteReparacion(parteTrabajoDTO.getCosteReparacion());
        parteTrabajo.setParteTrabajoImg(parteTrabajoDTO.getParteTrabajoImg());
        parteTrabajo.setTerminado(parteTrabajoDTO.isTerminado());
        return parteTrabajo;
    }


}
