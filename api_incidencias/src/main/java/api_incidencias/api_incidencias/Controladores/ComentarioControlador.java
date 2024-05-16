package api_incidencias.api_incidencias.Controladores;

import api_incidencias.api_incidencias.Entidades.Clases.Comentario;
import api_incidencias.api_incidencias.Entidades.Clases.Incidencia;
import api_incidencias.api_incidencias.Entidades.Clases.Usuario;
import api_incidencias.api_incidencias.Entidades.DTO.ComentarioDTO;
import api_incidencias.api_incidencias.Servicios.ComentarioService;
import api_incidencias.api_incidencias.Servicios.IncidenciaService;
import api_incidencias.api_incidencias.Servicios.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(path = "api/v1/comentarios")
public class ComentarioControlador {
    @Autowired
    private ComentarioService comentServicio;

    @Autowired
    private IncidenciaService incidenciaServicio;

    @Autowired
    private UsuarioService usuarioServicio;

    @GetMapping
    public List<Comentario> obtenerComentarios(){
        return comentServicio.getComentario();
    }

    @GetMapping("/{idComentario}")
    public Optional<Comentario> getComentarioPorId(@PathVariable("idComentario") Long idComentario){
        return comentServicio.getComentarioPorId(idComentario);
    }

    @GetMapping("/{idIncidencia}")
    public List<Comentario> getComentariosPorIncidencia(@PathVariable("idIncidencia") Long idIncidencia){
        return comentServicio.getComentarioPorIncidencia(idIncidencia);
    }

    @PostMapping
    public ResponseEntity<Comentario> crearComentario(@RequestBody ComentarioDTO comentarioDTO){
        Comentario comentario = cargarDTO(comentarioDTO);
        Comentario nuevoComent = comentServicio.addComentario(comentario);
        return new ResponseEntity<>(nuevoComent, HttpStatus.CREATED);
    }

    @PutMapping("/{idComentario}")
    public ResponseEntity<Comentario> actualizarComentario(@PathVariable Long idComentario, @RequestBody ComentarioDTO comentarioDTO) {
        Comentario comentario = cargarDTO(comentarioDTO);
        Comentario comentActualizado = comentServicio.updateComentario(idComentario, comentario);
        if (comentActualizado != null) {
            return new ResponseEntity<>(comentActualizado, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

    }

    @DeleteMapping("/{idComentario}")
    public ResponseEntity<String> eliminarIncidencia(@PathVariable("idComentario") Long idComentario){
        return comentServicio.deleteComentario(idComentario);
    }

    private Comentario cargarDTO(ComentarioDTO comentarioDTO){
        Comentario comentario = new Comentario();
        comentario.setID_Comentario(comentarioDTO.getID_Comentario());

        Optional<Incidencia> optionalIncidencia = incidenciaServicio.getIncidencias(comentarioDTO.getIdIncidencia());
        if (optionalIncidencia.isPresent()){
            comentario.setIncidencia(optionalIncidencia.get());
        }
        Optional<Usuario> optionalUsuario = usuarioServicio.getUser(comentarioDTO.getIdUsuario());
        if (optionalUsuario.isPresent()){
            comentario.setUsuario(optionalUsuario.get());
        }

        comentario.setContenido(comentarioDTO.getContenido());
        comentario.setFechaPublicacion(comentarioDTO.getFechaPublicacion());

        return comentario;
    }
}
