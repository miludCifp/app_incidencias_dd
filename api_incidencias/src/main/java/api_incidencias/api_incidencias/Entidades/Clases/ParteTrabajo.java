package api_incidencias.api_incidencias.Entidades.Clases;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "ParteTrabajo")
public class ParteTrabajo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_orden")
    private Long idOrden;
    @Column(name = "trabajo_realizado")
    private String trabajoRealizado;
    @Column(name = "diagnostico")
    private String diagnostico;
    @Column(name = "observaciones")
    private String observaciones;
    @Column(name = "coste_reparacion")
    private double costeReparacion;
    @Column(name = "parte_trabajo_img")
    private String parteTrabajoImg;
    @OneToOne
    @JoinColumn(name = "id_incidencia")
    //@JsonBackReference
    private Incidencia incidencia;
    @ManyToOne
    @JoinColumn(name = "id_tecnico")
    private Trabajador tecnico;

    @Column(name = "terminado")
    private boolean terminado;

    @OneToMany(mappedBy = "parteTrabajo")
    @JsonManagedReference
    //@JsonIgnore
    private List<TiempoEmpleado> listaTiempoEmpleados;

    @OneToMany(mappedBy = "parteTrabajo")
    @JsonManagedReference
    //@JsonIgnore
    private List<MaterialUtilizado> listaMaterialUtilizado;

    /************************************ Getters y Setters ********************************************/

    public Long getIdOrden() {
        return idOrden;
    }

    public void setIdOrden(Long idOrden) {
        this.idOrden = idOrden;
    }

    public String getTrabajoRealizado() {
        return trabajoRealizado;
    }

    public void setTrabajoRealizado(String trabajoRealizado) {
        this.trabajoRealizado = trabajoRealizado;
    }

    public String getDiagnostico() {
        return diagnostico;
    }

    public void setDiagnostico(String diagnostico) {
        this.diagnostico = diagnostico;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    public double getCosteReparacion() {
        return costeReparacion;
    }

    public void setCosteReparacion(double costeReparacion) {
        this.costeReparacion = costeReparacion;
    }

    public String getParteTrabajoImg() {
        return parteTrabajoImg;
    }

    public void setParteTrabajoImg(String parteTrabajoImg) {
        this.parteTrabajoImg = parteTrabajoImg;
    }

    public Incidencia getIncidencia() {
        return incidencia;
    }

    public void setIncidencia(Incidencia incidencia) {
        this.incidencia = incidencia;
    }

    public List<TiempoEmpleado> getListaTiempoEmpleados() {
        return listaTiempoEmpleados;
    }

    public void setListaTiempoEmpleados(List<TiempoEmpleado> listaTiempoEmpleados) {
        this.listaTiempoEmpleados = listaTiempoEmpleados;
    }

    public List<MaterialUtilizado> getListaMaterialUtilizado() {
        return listaMaterialUtilizado;
    }

    public void setListaMaterialUtilizado(List<MaterialUtilizado> listaMaterialUtilizado) {
        this.listaMaterialUtilizado = listaMaterialUtilizado;
    }

    public Trabajador getTecnico() {
        return tecnico;
    }

    public void setTecnico(Trabajador tecnico) {
        this.tecnico = tecnico;
    }

    public boolean isTerminado() {
        return terminado;
    }

    public void setTerminado(boolean terminado) {
        this.terminado = terminado;
    }
}
