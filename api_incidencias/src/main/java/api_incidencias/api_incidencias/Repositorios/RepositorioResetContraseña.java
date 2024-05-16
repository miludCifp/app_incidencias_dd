package api_incidencias.api_incidencias.Repositorios;

import api_incidencias.api_incidencias.Entidades.Clases.ResetContraseña;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface RepositorioResetContraseña extends JpaRepository<ResetContraseña, Long> {
    List<ResetContraseña> findByExpiracionBefore(Date expiracion);
    Optional<ResetContraseña> findByCodigo(String codigo);
}
