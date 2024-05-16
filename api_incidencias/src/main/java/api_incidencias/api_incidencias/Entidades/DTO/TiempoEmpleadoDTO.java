package api_incidencias.api_incidencias.Entidades.DTO;

import api_incidencias.api_incidencias.Entidades.Enum.ModoResolucion;

import java.time.LocalDate;
import java.time.LocalTime;

public class TiempoEmpleadoDTO {

    private Long idTiempoEmpleado;
    private LocalDate fecha;
    private Long idOrdenParteTb;
    private LocalTime horaEntrada;
    private LocalTime horaSalida;
    private String motivoPausa;
    private ModoResolucion modoResolucion;

    /************************************ Getters y Setters ********************************************/

    public Long getIdTiempoEmpleado() {
        return idTiempoEmpleado;
    }

    public void setIdTiempoEmpleado(Long idTiempoEmpleado) {
        this.idTiempoEmpleado = idTiempoEmpleado;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public Long getIdOrdenParteTb() {
        return idOrdenParteTb;
    }

    public void setIdOrdenParteTb(Long idOrdenParteTb) {
        this.idOrdenParteTb = idOrdenParteTb;
    }

    public LocalTime getHoraEntrada() {
        return horaEntrada;
    }

    public void setHoraEntrada(LocalTime horaEntrada) {
        this.horaEntrada = horaEntrada;
    }

    public LocalTime getHoraSalida() {
        return horaSalida;
    }

    public void setHoraSalida(LocalTime horaSalida) {
        this.horaSalida = horaSalida;
    }

    public ModoResolucion getModoResolucion() {
        return modoResolucion;
    }

    public void setModoResolucion(ModoResolucion modoResolucion) {
        this.modoResolucion = modoResolucion;
    }

    public String getMotivoPausa() {
        return motivoPausa;
    }

    public void setMotivoPausa(String motivoPausa) {
        this.motivoPausa = motivoPausa;
    }
}
