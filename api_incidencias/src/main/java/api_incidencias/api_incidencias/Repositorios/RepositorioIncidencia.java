package api_incidencias.api_incidencias.Repositorios;

import api_incidencias.api_incidencias.Entidades.Clases.Incidencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepositorioIncidencia extends JpaRepository<Incidencia, String> {
    @Query("SELECT i FROM Incidencia i WHERE i.usuarioCliente.idUsuario = ?1")
    List<Incidencia> findByCliente(Long idCliente);

    //Sin contar las incidencias reabiertas
    @Query("SELECT i FROM Incidencia i WHERE i.id LIKE 'PTDD%' AND NOT i.id LIKE '%R%'")
    List<Incidencia> findAllIncidencias();

    // obtiene el numero de la ultima incidencia sin contrar incidenciasReabiertas. devuelve solo el numero
    @Query("SELECT MAX(CAST(SUBSTRING_INDEX(i.id, '-', -1) AS int)) FROM Incidencia i WHERE i.id LIKE 'PTDD%' AND i.id NOT LIKE 'PTDD%R%'")
    Integer findLastIncidenciaId();


    // Para obtener la última incidencia reabierta de una incidencia original específica
    // su uso =  lastReopenedId = incidenciaRepository.findLastReopenedIncidenciaId("PTDD24-1");
    @Query("SELECT MAX(CAST(SUBSTRING(i.id, LENGTH(:prefix) + 1) AS int)) FROM Incidencia i WHERE i.id LIKE CONCAT(:prefix, '%') AND i.id NOT LIKE CONCAT(:prefix, '%R%')")
    Long findLastReopenedIncidenciaId(@Param("prefix") String prefix);

    // buscar incidenciasReabiertas con id de incidencia principal
    @Query("SELECT i FROM Incidencia i WHERE i.id LIKE CONCAT(:prefix, 'R%')")
    List<Incidencia> findIncidenciasReabiertas(@Param("prefix") String prefix);






}
