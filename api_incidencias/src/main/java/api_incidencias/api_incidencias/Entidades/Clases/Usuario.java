package api_incidencias.api_incidencias.Entidades.Clases;

import api_incidencias.api_incidencias.Entidades.Enum.Genero;
import api_incidencias.api_incidencias.Entidades.Enum.TipoDocumento;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;


import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import java.time.LocalDate;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "Usuarios")
@Inheritance(strategy = InheritanceType.JOINED)
public class Usuario implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_Usuario")
    private Long idUsuario;

    @Column(name = "Documento", unique = true)
    private String documento;

    @Enumerated(EnumType.STRING)
    @Column(name = "Genero")
    private Genero genero;
    @Column(name = "Nombre")
    private String nombre;
    @Column(name = "Apellido")
    private String apellido;
    @Column(name = "Correo_Electronico",unique = true)
    private String correoElectronico;
  
    @Column(name = "Contrasena")
    private String contrasena;

    @Column(name = "Fecha_Registro")
    @JsonIgnore
    private LocalDate fechaRegistro;

    @Column(name = "Ruta_Imagen")
    private String imagenPerfil;

    @Column(name = "Telefono")
    private String telefono;

    @Enumerated(EnumType.STRING)
    @Column(name = "TipoDocumento")
    private TipoDocumento tipoDocumento;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "ID_Usuario_Modificacion")
    private Usuario usuarioModificacion;

    @Column(name = "Fecha_Modificacion")
    @JsonIgnore
    private LocalDateTime fechaModificacion;

    //@OneToMany(mappedBy = "usuarioCliente")
    //@JsonIgnore
    //private List<Incidencia> listaIncidenciasUsuario;

    /********************************* Metodos de la interface UserDetails ***********************************/
    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (this instanceof  Trabajador){
            return List.of(new SimpleGrantedAuthority(((Trabajador) this).getRol().name()));
        }
        return List.of(new SimpleGrantedAuthority("cliente"));
    }

    @Override
    @JsonIgnore
    public String getPassword() {
        return contrasena;
    }

    @Override
    @JsonIgnore
    public String getUsername() {
        return correoElectronico;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    @JsonIgnore
    public boolean isEnabled() {
        return true;
    }

    /************************************ Getters y Setters ********************************************/

     public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getDocumento() {
        return documento;
    }

    public void setDocumento(String documento) {
        this.documento = documento;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getCorreoElectronico() {
        return correoElectronico;
    }

    public void setCorreoElectronico(String correoElectronico) {
        this.correoElectronico = correoElectronico;
    }

    public String getContrasena() {
        return contrasena;
    }

    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }

    public LocalDate getFechaRegistro() {
        return fechaRegistro;
    }

    public void setFechaRegistro(LocalDate fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }

    public String getImagenPerfil() {
        return imagenPerfil;
    }

    public void setImagenPerfil(String rutaImagen) {
        this.imagenPerfil = rutaImagen;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public Usuario getUsuarioModificacion() {
        return usuarioModificacion;
    }

    public void setUsuarioModificacion(Usuario usuarioModificacion) {
        this.usuarioModificacion = usuarioModificacion;
    }

    public LocalDateTime getFechaModificacion() {
        return fechaModificacion;
    }

    public void setFechaModificacion(LocalDateTime fechaModificacion) {
        this.fechaModificacion = fechaModificacion;
    }

    public TipoDocumento getTipoDocumento() {
        return tipoDocumento;
    }

    public void setTipoDocumento(TipoDocumento tipoDocumento) {
        this.tipoDocumento = tipoDocumento;
    }

    public Genero getGenero() {
        return genero;
    }

    public void setGenero(Genero genero) {
        this.genero = genero;
    }
    /*
    public List<Incidencia> getListaIncidenciasUsuario() {
        return listaIncidenciasUsuario;
    }

    public void setListaIncidenciasUsuario(List<Incidencia> listaIncidenciasUsuario) {
        this.listaIncidenciasUsuario = listaIncidenciasUsuario;
    }


 */

}
