package api_incidencias.api_incidencias.Repositorios;

import api_incidencias.api_incidencias.Entidades.Clases.MaterialUtilizado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepositorioMaterialUtilizado extends JpaRepository<MaterialUtilizado, Long> {
    @Query("SELECT m FROM MaterialUtilizado m WHERE m.parteTrabajo.idOrden = ?1")
    List<MaterialUtilizado> findByIdOrden(Long idOrden);
}
