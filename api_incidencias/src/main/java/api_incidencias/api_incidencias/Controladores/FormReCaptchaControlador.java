package api_incidencias.api_incidencias.Controladores;

import api_incidencias.api_incidencias.Servicios.RecaptchaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class FormReCaptchaControlador {

    @Autowired
    private RecaptchaService recaptchaService;

    @PostMapping("/submitForm")
    public String submitForm(@RequestParam("g-recaptcha-response") String recaptchaResponse,
                             @RequestParam("name") String name,
                             @RequestParam("email") String email,
                             Model model) {

        boolean isRecaptchaValid = recaptchaService.verifyRecaptcha(recaptchaResponse);

        if (!isRecaptchaValid) {
            model.addAttribute("error", "reCAPTCHA verification failed. Please try again.");
            return "formPage"; // Cambia esto al nombre de tu plantilla
        }

        // Procesa el formulario
        // ...

        return "successPage"; // Cambia esto al nombre de tu plantilla de éxito
    }
}
