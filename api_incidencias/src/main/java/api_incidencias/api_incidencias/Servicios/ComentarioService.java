package api_incidencias.api_incidencias.Servicios;

import api_incidencias.api_incidencias.Entidades.Clases.Comentario;
import api_incidencias.api_incidencias.Repositorios.RepositorioComentario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ComentarioService {
    @Autowired
    private RepositorioComentario reposComentario;

    public Comentario addComentario(Comentario comentario){
        return reposComentario.save(comentario);
    }

    public List<Comentario> getComentario(){
        return reposComentario.findAll();
    }

    public Optional<Comentario> getComentarioPorId(Long idComentario){
        return reposComentario.findById(idComentario);
    }
    public List<Comentario> getComentarioPorIncidencia(Long idIncedencia){
        return reposComentario.findByIncidencia(idIncedencia);
    }

    public Comentario updateComentario(Long idComentario, Comentario comentario){

        Optional<Comentario> comentarioExistenteOptional = reposComentario.findById(idComentario);

        if (comentarioExistenteOptional.isPresent()) {
            Comentario comentarioExistente = comentarioExistenteOptional.get();

            if (idComentario.equals(comentario.getID_Comentario())) {
                // Actualizo los atributos del libro existente con los del libro proporcionado
                comentarioExistente.setContenido(comentario.getContenido());
                comentarioExistente.setFechaPublicacion(comentario.getFechaPublicacion());
                // Guarda el usuario actualizado en el repositorio
                return reposComentario.save(comentarioExistente);
            } else {
                throw new IllegalArgumentException("El id proporcionado no coincide con el ID del comentario.");
            }
        } else {
            throw new IllegalArgumentException("El comentario con el ID proporcionado no existe.");
        }
    }

    public ResponseEntity<String> deleteComentario(Long id){
        Optional<Comentario> comentario = reposComentario.findById(id);

        if (comentario.isPresent()) {
            reposComentario.deleteById(id);;

            return ResponseEntity.status(HttpStatus.NO_CONTENT)
                    .body("Comentario eliminado correctamente.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("No se encontró el comentario correspondiente.");
        }
    }

}
