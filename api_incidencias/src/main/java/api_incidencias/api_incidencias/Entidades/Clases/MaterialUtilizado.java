package api_incidencias.api_incidencias.Entidades.Clases;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "MaterialUtilizado")
public class MaterialUtilizado {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_material")
    private Long idMaterial;
    @Column(name = "nombre")
    private String nombre;
    @Column(name = "cantidad")
    private int cantidad;
    @Column(name = "coste")
    private double coste;
    @ManyToOne
    @JoinColumn(name = "id_orden")
    @JsonBackReference
    private ParteTrabajo parteTrabajo;

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

    public ParteTrabajo getParteTrabajo() {
        return parteTrabajo;
    }

    public void setParteTrabajo(ParteTrabajo parteTrabajo) {
        this.parteTrabajo = parteTrabajo;
    }
}
