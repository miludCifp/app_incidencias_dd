package api_incidencias.api_incidencias.Entidades.DTO;

import java.time.LocalDateTime;

public class ComentarioDTO {

    private Long ID_Comentario;
    private String idIncidencia;
    private Long idUsuario;
    private String Contenido;
    private LocalDateTime FechaPublicacion;

    /************************************ Getters y Setters ********************************************/
    public Long getID_Comentario() {
        return ID_Comentario;
    }

    public void setID_Comentario(Long ID_Comentario) {
        this.ID_Comentario = ID_Comentario;
    }

    public String getIdIncidencia() {
        return idIncidencia;
    }

    public void setIdIncidencia(String idIncidencia) {
        this.idIncidencia = idIncidencia;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getContenido() {
        return Contenido;
    }

    public void setContenido(String contenido) {
        Contenido = contenido;
    }

    public LocalDateTime getFechaPublicacion() {
        return FechaPublicacion;
    }

    public void setFechaPublicacion(LocalDateTime fechaPublicacion) {
        FechaPublicacion = fechaPublicacion;
    }
}
