package api_incidencias.api_incidencias.Repositorios;

import api_incidencias.api_incidencias.Entidades.Clases.TiempoEmpleado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepositorioTiempoEmpleado extends JpaRepository<TiempoEmpleado, Long> {
    @Query("SELECT t FROM TiempoEmpleado t WHERE t.parteTrabajo.idOrden = ?1")
    List<TiempoEmpleado> findByIdOrden(Long idOrden);

    @Query("SELECT t FROM TiempoEmpleado t WHERE t.parteTrabajo.tecnico.idUsuario = ?1 AND t.parteTrabajo.idOrden = ?2 and t.horaSalida IS NULL")
    List<TiempoEmpleado> findByTiempoNoTerminado(Long idUsuario,Long idOrden);
}
