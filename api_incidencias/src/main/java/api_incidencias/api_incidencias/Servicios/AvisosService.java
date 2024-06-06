package api_incidencias.api_incidencias.Servicios;

import api_incidencias.api_incidencias.Auth.RegisterRequest_Cliente;
import api_incidencias.api_incidencias.Entidades.Clases.Incidencia;


import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;


@Service
public class AvisosService {
    @Autowired
    private JavaMailSender javaMailSender;

    public void avisoNuevaIncidencia(Incidencia incidencia) {
        MimeMessage mensaje = javaMailSender.createMimeMessage();

        MimeMessageHelper helper = null;
        try {
            helper = new MimeMessageHelper(mensaje, true, "UTF-8");
            helper.setTo("soporte@dondigital.es");
            helper.setSubject("Nueva incidencia");

            String cuerpoEmail = "<html>" +
                    "<body>" +
                    "El cliente " + incidencia.getUsuarioCliente().getNombre().toUpperCase() + " ha registrado una nueva incidencia.<br/>" +
                    "<b>INFORMACIÓN DE LA INCIDENCIA :</b><br/>" +
                    "- Titulo : " + incidencia.getTitulo() + "<br/>" +
                    "- Descripción : " + incidencia.getDescripcion() + "<br/>" +
                    "- Estado : " + incidencia.getEstado() + "<br/>" +
                    "- Prioridad : " + incidencia.getPrioridad() + "<br/>" +
                    "</body>" +
                    "</html>";

            helper.setText(cuerpoEmail, true); // El segundo parámetro indica que es contenido HTML
        } catch (jakarta.mail.MessagingException e) {
            throw new RuntimeException(e);
        }

        javaMailSender.send(mensaje);
    }

    public void avisoNuevoUsuario(String rolUser, RegisterRequest_Cliente request) {
        MimeMessage mensaje = javaMailSender.createMimeMessage();

        MimeMessageHelper helper = null;
        try {
            helper = new MimeMessageHelper(mensaje, true, "UTF-8");
            helper.setTo("soporte@dondigital.es");
            helper.setSubject("Nuevo cliente");
            String cuerpoEmail = "<html>" +
                    "<body>" +
                    "Un nuevo " + rolUser + " acaba de registrarse en el sistema.<br/>" +
                    "<b>INFORMACIÓN DEL " + rolUser.toUpperCase() + " :</b><br/>" +
                    "- Nombre : " + request.getNombre() + "<br/>" +
                    "- Apellidos : " + request.getApellido() + "<br/>" +
                    "- Email : " + request.getCorreoElectronico() + "<br/>" +
                    "- Teléfono : " + request.getTelefono() + "<br/>" +
                    "</body>" +
                    "</html>";

            helper.setText(cuerpoEmail, true); // El segundo parámetro indica que es contenido HTML

        } catch (jakarta.mail.MessagingException e) {
            throw new RuntimeException(e);
        }

        javaMailSender.send(mensaje);
    }

}
