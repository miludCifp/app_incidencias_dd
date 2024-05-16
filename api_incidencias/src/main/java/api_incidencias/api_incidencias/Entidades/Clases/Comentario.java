package api_incidencias.api_incidencias.Entidades.Clases;

import jakarta.persistence.*;

import java.time.LocalDateTime;
@Entity
@Table(name = "Comentarios")
public class Comentario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Comentario")
    private Long ID_Comentario;

    @ManyToOne
    @JoinColumn(name = "ID_Incidencia")
    private Incidencia incidencia;

    @ManyToOne
    @JoinColumn(name = "ID_Usuario")
    private Usuario usuario;
    @Column(name = "Contenido")
    private String Contenido;
    @Column(name = "Fecha_Publicacion")
    private LocalDateTime FechaPublicacion;

    /************************************ Getters y Setters ********************************************/

    public Long getID_Comentario() {
        return ID_Comentario;
    }

    public void setID_Comentario(Long ID_Comentario) {
        this.ID_Comentario = ID_Comentario;
    }

    public Incidencia getIncidencia() {
        return incidencia;
    }

    public void setIncidencia(Incidencia incidencia) {
        this.incidencia = incidencia;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
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
