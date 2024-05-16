package api_incidencias.api_incidencias.Repositorios;

import api_incidencias.api_incidencias.Entidades.Clases.Cliente;
import api_incidencias.api_incidencias.Entidades.Clases.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository

public interface RepositorioCliente extends JpaRepository<Cliente, Long> {
    @Query("SELECT u FROM Cliente u WHERE u.correoElectronico = ?1")
    Optional<Cliente> findByEmail(String email);
}
