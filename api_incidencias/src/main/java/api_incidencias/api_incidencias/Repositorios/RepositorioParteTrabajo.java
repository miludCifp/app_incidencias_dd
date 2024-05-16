package api_incidencias.api_incidencias.Repositorios;

import api_incidencias.api_incidencias.Entidades.Clases.ParteTrabajo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RepositorioParteTrabajo extends JpaRepository<ParteTrabajo, Long> {
    @Query("SELECT p FROM ParteTrabajo p WHERE p.incidencia.idIncidencia = ?1")
    Optional<ParteTrabajo> findByIdIncidencia(String idIncidencia);

    @Query("SELECT p FROM ParteTrabajo p WHERE p.tecnico.idUsuario = ?1 AND p.incidencia.idIncidencia = ?2 AND p.terminado = false")
    List<ParteTrabajo> findByNoTerminado(Long idUsuario, String idIncidencia);
}
