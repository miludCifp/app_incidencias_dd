package api_incidencias.api_incidencias.Entidades.Clases;

import api_incidencias.api_incidencias.Entidades.Enum.ModoResolucion;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "Tiempo_Empleado")
public class TiempoEmpleado {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tiempo_empleado")
    private Long idTiempoEmpleado;
    @Column(name = "fecha")
    private LocalDate fecha;
    @ManyToOne
    @JoinColumn(name = "id_parte_trabajo")
    @JsonBackReference
    private ParteTrabajo parteTrabajo;
    @Column(name = "hora_entrada")
    private LocalTime horaEntrada;
    @Column(name = "hora_salida")
    private LocalTime horaSalida;
    @Column(name = "motivo_pausa")
    private String motivoPausa;
    @Enumerated(EnumType.STRING)
    @Column(name = "modo_resolucion")
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

    public ParteTrabajo getParteTrabajo() {
        return parteTrabajo;
    }

    public void setParteTrabajo(ParteTrabajo parteTrabajo) {
        this.parteTrabajo = parteTrabajo;
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
