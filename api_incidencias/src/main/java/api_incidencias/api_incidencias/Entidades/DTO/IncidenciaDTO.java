package api_incidencias.api_incidencias.Entidades.DTO;

import api_incidencias.api_incidencias.Entidades.Enum.Estado;
import api_incidencias.api_incidencias.Entidades.Enum.Prioridad;

import java.time.LocalDateTime;

public class IncidenciaDTO {
    private String idIncidencia;
    private String titulo;
    private String descripcion;
    // private LocalDateTime fechaCreacion;
    private Estado estado;
    private Prioridad prioridad;
    //private Long idUsuarioCliente;


    /************************************ Getters y Setters ********************************************/

    public String getIdIncidencia() {
        return idIncidencia;
    }

    public void setIdIncidencia(String idIncidencia) {
        this.idIncidencia = idIncidencia;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Prioridad getPrioridad() {
        return prioridad;
    }

    public void setPrioridad(Prioridad prioridad) {
        this.prioridad = prioridad;
    }

    public Estado getEstado() {
        return estado;
    }

    public void setEstado(Estado estado) {
        this.estado = estado;
    }
}
