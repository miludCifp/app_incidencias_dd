package api_incidencias.api_incidencias.Servicios;

import api_incidencias.api_incidencias.Entidades.Clases.ResetContraseña;
import api_incidencias.api_incidencias.Entidades.Clases.Usuario;
import api_incidencias.api_incidencias.Jwt.JwtService;
import api_incidencias.api_incidencias.Repositorios.RepositorioResetContraseña;
import api_incidencias.api_incidencias.Repositorios.RepositorioUsuario;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.LocalDateTime;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class ServicioResetContraseña {

    @Autowired
    private JavaMailSender javaMailSender;
    @Autowired
    private RepositorioUsuario repositorioUsuario;
    @Autowired
    private RepositorioResetContraseña codeRepository;
    @Autowired
    private PasswordEncoder passwdEncoder;

    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int CODE_LENGTH = 6;
    private static final int EXPIRATION_TIME_MINUTES = 60; // Tiempo de expiración en minutos
    private final Random random = new SecureRandom();

    public void enviarCorreoResetContraseña(String correo) {
        Optional<Usuario> usuarioOptional = repositorioUsuario.findByEmail(correo);
        Usuario usuario = null;
        if (usuarioOptional.isPresent()){
            usuario = usuarioOptional.get();
        }

        if (usuario == null) {
            System.out.println("No se encontró un usuario con este correo electrónico");
        }


        // Enviar correo electrónico al usuario con el token

        //String enlaceReset = "https://tudominio.com/reset-contraseña?token=" + token;
        //enviarCorreo(correo, "Restablecer contraseña", "Haga clic en el siguiente enlace para restablecer su contraseña: " + enlaceReset);
        String codigo = generateCode();
        saveCode(codigo,usuario.getIdUsuario());
        enviarCorreo(correo, "Restablecer contraseña", "Introduce el siguiente codigo: " + codigo);
    }

    private void enviarCorreo(String para, String asunto, String cuerpo) {
        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setTo(para);
        mensaje.setSubject(asunto);
        mensaje.setText(cuerpo);
        javaMailSender.send(mensaje);
    }

    public boolean modificarContraseña(String codigo, String nuevaContraseña) {
        Optional<ResetContraseña> resetCodeOptional = codeRepository.findByCodigo(codigo);
        if (resetCodeOptional.isPresent()) {
            ResetContraseña resetCode = resetCodeOptional.get();
            Long userId = resetCode.getIdUsuario();
            Optional<Usuario> usuarioOptional = repositorioUsuario.findById(userId);
            if (usuarioOptional.isPresent()) {
                Usuario usuario = usuarioOptional.get();
                // Modificar la contraseña del usuario
                usuario.setContrasena(passwdEncoder.encode(nuevaContraseña));
                // Guardar el usuario actualizado
                repositorioUsuario.save(usuario);
                // Eliminar el código de restablecimiento de contraseña
                codeRepository.delete(resetCode);
                return true;
            }
        }
        return false;
    }

    public boolean isValidCode(String codigo) {
        Optional<ResetContraseña> resetCodeOptional = codeRepository.findByCodigo(codigo);
        if (resetCodeOptional.isPresent()) {
            ResetContraseña resetCode = resetCodeOptional.get();
            // Verificar si el código no ha expirado
            Date now = new Date();
            if (resetCode.getExpiracion().after(now)) {
                return true;
            }
        }
        return false;
    }

    public String generateCode() {
        StringBuilder codeBuilder = new StringBuilder();
        for (int i = 0; i < CODE_LENGTH; i++) {
            codeBuilder.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
        }
        return codeBuilder.toString();
    }

    // Método para calcular el tiempo de expiración
    private Date calculateExpirationTime() {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.MINUTE, EXPIRATION_TIME_MINUTES);
        return calendar.getTime();
    }

    // Método programado para eliminar códigos expirados
    @Scheduled(fixedRate = 60000) // Se ejecuta cada minuto
    public void removeExpiredCodes() {
        List<ResetContraseña> expiredCodes = codeRepository.findByExpiracionBefore(new Date());
        codeRepository.deleteAll(expiredCodes);
    }

    public void saveCode(String code, Long userId) {
        ResetContraseña resetCode = new ResetContraseña();
        resetCode.setCodigo(code);
        resetCode.setIdUsuario(userId);
        resetCode.setExpiracion(calculateExpirationTime());
        codeRepository.save(resetCode);
    }
}

