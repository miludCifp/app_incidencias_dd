package api_incidencias.api_incidencias.Entidades.Clases;

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
@Table(name = "cliente")
@PrimaryKeyJoinColumn(name = "ID_Usuario")
public class Cliente extends Usuario implements UserDetails {
    @Column(name = "Calle")
    private String calle;
    @Column(name = "Ciudad")
    private String ciudad;
    @Column(name = "Provincia")
    private String provincia;
    @Column(name = "Codigo_Postal")
    private String codigoPostal;
    @Column(name = "Pais")
    private String pais;

    @JsonIgnore
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_Usuario") // Esta anotación es opcional si el nombre de la columna en la tabla es el mismo que el atributo
    private Usuario usuario;

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

    /********************************* Getters y Setters ***********************************/

    public String getCalle() {
        return calle;
    }

    public void setCalle(String calle) {
        this.calle = calle;
    }

    public String getCiudad() {
        return ciudad;
    }

    public void setCiudad(String ciudad) {
        this.ciudad = ciudad;
    }

    public String getProvincia() {
        return provincia;
    }

    public void setProvincia(String provincia) {
        this.provincia = provincia;
    }

    public String getCodigoPostal() {
        return codigoPostal;
    }

    public void setCodigoPostal(String codigoPostal) {
        this.codigoPostal = codigoPostal;
    }

    public String getPais() {
        return pais;
    }

    public void setPais(String pais) {
        this.pais = pais;
    }
}
