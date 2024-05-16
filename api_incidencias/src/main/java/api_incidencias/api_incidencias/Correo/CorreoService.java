package api_incidencias.api_incidencias.Correo;

import org.springframework.stereotype.Service;

import java.util.Properties;
import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;


@Service
public class CorreoService {
    private final String CORREO = "tu_correo@gmail.com"; // Aquí debes ingresar tu dirección de correo electrónico
    private final String CONTRASEÑA = "tu_contraseña"; // Aquí debes ingresar tu contraseña

    public void enviarCorreo(Correo correo) {
        String servidorSMTP = "smtp.gmail.com";
        int puertoSMTP = 587;

        Properties props = new Properties();
        props.put("mail.smtp.host", servidorSMTP);
        props.put("mail.smtp.port", puertoSMTP);
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");

        // Desactivo la validación de certificados SSL
        props.put("mail.smtp.ssl.trust", "*");

        Session session = Session.getInstance(props, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(CORREO, CONTRASEÑA);
            }
        });

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(CORREO));
            message.setRecipient(Message.RecipientType.TO, new InternetAddress(correo.getEmailDestino()));
            message.setSubject(correo.getAsunto());
            message.setText(correo.getContenido());

            Transport.send(message);

            System.out.println("Correo enviado");

        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
}

