package api_incidencias.api_incidencias.Entidades.DTO;

public class ParteTrabajoDTO {
    private Long idOrden;
    private String trabajoRealizado;
    private String diagnostico;
    private String observaciones;
    private double costeReparacion;
    private String parteTrabajoImg;
    private String idIncidencia;
    private Long idTecnico;
    private boolean terminado;

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

    public String getIdIncidencia() {
        return idIncidencia;
    }

    public void setIdIncidencia(String idIncidencia) {
        this.idIncidencia = idIncidencia;
    }

    public Long getIdTecnico() {
        return idTecnico;
    }

    public void setIdTecnico(Long idTecnico) {
        this.idTecnico = idTecnico;
    }

    public boolean isTerminado() {
        return terminado;
    }

    public void setTerminado(boolean terminado) {
        this.terminado = terminado;
    }
}
