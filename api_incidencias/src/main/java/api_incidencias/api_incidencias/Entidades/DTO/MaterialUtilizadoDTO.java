package api_incidencias.api_incidencias.Entidades.DTO;

import api_incidencias.api_incidencias.Entidades.Clases.ParteTrabajo;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

public class MaterialUtilizadoDTO {
    private Long idMaterial;
    private String nombre;
    private int cantidad;
    private double coste;
    private Long idParteTrabajo;

    /************************************ Getters y Setters ********************************************/

    public Long getIdMaterial() {
        return idMaterial;
    }

    public void setIdMaterial(Long idMaterial) {
        this.idMaterial = idMaterial;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public int getCantidad() {
        return cantidad;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }

    public double getCoste() {
        return coste;
    }

    public void setCoste(double coste) {
        this.coste = coste;
    }

    public Long getIdParteTrabajo() {
        return idParteTrabajo;
    }

    public void setIdParteTrabajo(Long idParteTrabajo) {
        this.idParteTrabajo = idParteTrabajo;
    }
}
