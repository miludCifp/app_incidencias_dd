package api_incidencias.api_incidencias.Entidades.Clases;

import api_incidencias.api_incidencias.Entidades.Enum.Rol;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

//@Builder
@EqualsAndHashCode(callSuper=false)
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "trabajador")
@PrimaryKeyJoinColumn(name = "ID_Usuario")
public class Trabajador extends Usuario implements UserDetails {
    @Column(name = "Rol")
    @Enumerated(EnumType.STRING)
    private Rol rol;

    @JsonIgnore
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_Usuario") // Esta anotación es opcional si el nombre de la columna en la tabla es el mismo que el atributo
    private Usuario usuario;

    @OneToMany(mappedBy = "tecnico")
    @JsonIgnore
    private List<ParteTrabajo> listaPartesTrabajo;

    /********************************* Getters y Setters ***********************************/
    public Rol getRol() {
        return rol;
    }
    public void setRol(Rol rol) {
        this.rol = rol;
    }
    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    /********************************* Metodos de la interface UserDetails ***********************************/
    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("cliente"));
    }

    @Override
    @JsonIgnore
    public String getPassword() {
        return this.getContrasena();
    }

    @Override
    @JsonIgnore
    public String getUsername() {
        return this.getCorreoElectronico();
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
}
