package api_incidencias.api_incidencias.Repositorios;

import api_incidencias.api_incidencias.Entidades.Clases.Cliente;
import api_incidencias.api_incidencias.Entidades.Clases.Trabajador;
import api_incidencias.api_incidencias.Entidades.Clases.Usuario;
import api_incidencias.api_incidencias.Entidades.Enum.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface RepositorioTrabajador extends JpaRepository<Trabajador, Long> {
    @Query("SELECT u FROM Trabajador u WHERE u.correoElectronico = ?1")
    Optional<Trabajador> findByEmail(String email);

    @Query("SELECT COUNT(u) FROM Trabajador u WHERE u.rol = :rol")
    int countByRol(@Param("rol") Rol rol);
}
