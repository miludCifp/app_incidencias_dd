package api_incidencias.api_incidencias.Servicios;

import api_incidencias.api_incidencias.Entidades.Clases.MaterialUtilizado;
import api_incidencias.api_incidencias.Repositorios.RepositorioMaterialUtilizado;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
public class MaterialUtilizadoService {
    @Autowired
    private RepositorioMaterialUtilizado repositorioMaterialUtilizado;
    @Autowired
    private Seguridad seguridad;

    /**
     * solo trabajador
     * @param materialUtilizado
     * @return
     */
    public MaterialUtilizado addMaterialUtilizado(MaterialUtilizado materialUtilizado){
        if (seguridad.isTrabajador())
        return repositorioMaterialUtilizado.save(materialUtilizado);
        return null;
    }

    /**
     * solo trabajador
     * @return
     */
    public List<MaterialUtilizado> getMaterialUtilizados(){
        if (seguridad.isTrabajador())
        return repositorioMaterialUtilizado.findAll();
        return null;
    }

    /**
     * solo trabajador
     * @param id
     * @return
     */
    public Optional<MaterialUtilizado> getMaterialUtilizados(Long id){
        if (seguridad.isTrabajador())
        return repositorioMaterialUtilizado.findById(id);
        return null;
    }
    public List<MaterialUtilizado> getMaterialUtilizadosOrden(Long idOrden){
        return repositorioMaterialUtilizado.findByIdOrden(idOrden);
    }

    /**
     * solo admin
     * @param idMaterialutilizado
     * @param materialUtilizado
     * @return
     */
    public MaterialUtilizado updateMaterialUtilizado(Long idMaterialutilizado, MaterialUtilizado materialUtilizado){
        if (seguridad.isAdmin()) {

            Optional<MaterialUtilizado> optional = repositorioMaterialUtilizado.findById(idMaterialutilizado);

            if (optional.isPresent()) {
                MaterialUtilizado materialUtilizadoExistente = optional.get();

                if (idMaterialutilizado.equals(materialUtilizado.getIdMaterial())) {

                    materialUtilizadoExistente.setNombre(materialUtilizado.getNombre());
                    materialUtilizadoExistente.setCantidad(materialUtilizado.getCantidad());
                    materialUtilizadoExistente.setCoste(materialUtilizado.getCoste());
                    materialUtilizadoExistente.setParteTrabajo(materialUtilizado.getParteTrabajo());

                    return repositorioMaterialUtilizado.save(materialUtilizadoExistente);
                } else {
                    throw new IllegalArgumentException("El id proporcionado no coincide con el ID del material.");
                }
            } else {
                throw new IllegalArgumentException("El material con el ID proporcionado no existe.");
            }
        }
        throw new IllegalArgumentException("No eres admin");
    }

    /**
     * solo admin
     * @param id
     * @return
     */
    public ResponseEntity<String> deleteMaterialUtilizado(Long id){
        if (seguridad.isAdmin()) {
            Optional<MaterialUtilizado> materialUtilizado = repositorioMaterialUtilizado.findById(id);

            if (materialUtilizado.isPresent()) {
                repositorioMaterialUtilizado.deleteById(id);
                ;

                return ResponseEntity.status(HttpStatus.NO_CONTENT)
                        .body("Material eliminado correctamente.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No se encontró el material correspondiente.");
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("No tienes permisos.");
    }
}
