package api_incidencias.api_incidencias.Controladores;

import api_incidencias.api_incidencias.Entidades.Clases.Incidencia;
import api_incidencias.api_incidencias.Entidades.Clases.MaterialUtilizado;
import api_incidencias.api_incidencias.Entidades.Clases.ParteTrabajo;
import api_incidencias.api_incidencias.Entidades.DTO.MaterialUtilizadoDTO;
import api_incidencias.api_incidencias.Entidades.DTO.ParteTrabajoDTO;
import api_incidencias.api_incidencias.Servicios.MaterialUtilizadoService;
import api_incidencias.api_incidencias.Servicios.ParteTrabajoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path = "api/v1/material-utilizado")
public class MaterialUtilizadoControlador {
    @Autowired
    private ParteTrabajoService parteTrabajoServicio;
    @Autowired
    private MaterialUtilizadoService materialUtilizadoService;

    @GetMapping
    public List<MaterialUtilizado> getMaterialUtilizados(){
        return materialUtilizadoService.getMaterialUtilizados();
    }

    @GetMapping("/{idMaterial}")
    public Optional<MaterialUtilizado> getMaterialUtilizadosPorId(@PathVariable("idMaterial") Long idMaterial){
        return materialUtilizadoService.getMaterialUtilizados(idMaterial);
    }

    @GetMapping("parte-trabajo/{idOrden}")
    public List<MaterialUtilizado> getMaterialUtilizadosPorParteTrabajo(@PathVariable("idOrden") Long idOrden){
        return materialUtilizadoService.getMaterialUtilizadosOrden(idOrden);
    }

    @PostMapping
    public ResponseEntity<MaterialUtilizado> crearMaterialUtilizado(@RequestBody MaterialUtilizadoDTO materialUtilizadoDTO){

        MaterialUtilizado materialUtilizado = cargarDTO(materialUtilizadoDTO);

        MaterialUtilizado materialUtilizadoGuardado = materialUtilizadoService.addMaterialUtilizado(materialUtilizado);
        return new ResponseEntity<>(materialUtilizadoGuardado, HttpStatus.CREATED);
    }

    @PutMapping("/{idMaterial}")
    public ResponseEntity<MaterialUtilizado> actualizarMaterialUtilizado(@PathVariable Long idMaterial, @RequestBody MaterialUtilizadoDTO materialUtilizadoDTO) {

        MaterialUtilizado materialUtilizado = cargarDTO(materialUtilizadoDTO);

        MaterialUtilizado materialUtilizadoActualizado = materialUtilizadoService.updateMaterialUtilizado(idMaterial, materialUtilizado);
        if (materialUtilizadoActualizado != null) {
            return new ResponseEntity<>(materialUtilizadoActualizado, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

    }

    @DeleteMapping("/{idMaterial}")
    public ResponseEntity<String> eliminarMaterial(@PathVariable("idMaterial") Long idMaterial){
        return materialUtilizadoService.deleteMaterialUtilizado(idMaterial);
    }

    private MaterialUtilizado cargarDTO(MaterialUtilizadoDTO materialUtilizadoDTO){
        MaterialUtilizado materialUtilizado = new MaterialUtilizado();

        materialUtilizado.setIdMaterial(materialUtilizadoDTO.getIdMaterial());
        Optional<ParteTrabajo> optionalParteTrabajo = parteTrabajoServicio.getPartesTrabajoPorId(materialUtilizadoDTO.getIdParteTrabajo());
        if (optionalParteTrabajo.isPresent()){
            materialUtilizado.setParteTrabajo(optionalParteTrabajo.get());
        }

        materialUtilizado.setNombre(materialUtilizadoDTO.getNombre());
        materialUtilizado.setCantidad(materialUtilizadoDTO.getCantidad());
        materialUtilizado.setCoste(materialUtilizadoDTO.getCoste());


        return materialUtilizado;
    }
}
