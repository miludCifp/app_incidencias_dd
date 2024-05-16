package api_incidencias.api_incidencias.Correo;
import java.io.Serializable;

public class Correo implements Serializable {
    private String emailDestino;
    private String asunto;
    private String contenido;

    public Correo() {
    }

    public Correo(String emailDestino, String asunto, String contenido) {
        this.emailDestino = emailDestino;
        this.asunto = asunto;
        this.contenido = contenido;
    }

    public String getEmailDestino() {
        return emailDestino;
    }

    public void setEmailDestino(String emailDestino) {
        this.emailDestino = emailDestino;
    }

    public String getAsunto() {
        return asunto;
    }

    public void setAsunto(String asunto) {
        this.asunto = asunto;
    }

    public String getContenido() {
        return contenido;
    }

    public void setContenido(String contenido) {
        this.contenido = contenido;
    }
}

