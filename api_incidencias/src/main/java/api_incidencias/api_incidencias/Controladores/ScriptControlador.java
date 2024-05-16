package api_incidencias.api_incidencias.Controladores;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.http.MediaType;
@Controller
//@RequestMapping("/app/scripts")
public class ScriptControlador {

    /*
    @GetMapping("/{path}/{scriptName}")
    public ResponseEntity<Resource> getScript(@PathVariable String path, @PathVariable String scriptName) {
        String folderPath = "static/js/";
        Resource resource;

        // Intenta cargar el script desde la subcarpeta
        String subfolderPath = folderPath + path + "/";
        Resource subfolderResource = new ClassPathResource(subfolderPath + scriptName);
        if (subfolderResource.exists()) {
            resource = subfolderResource;
        } else {
            // Si no se encuentra en la subcarpeta, intenta cargarlo directamente desde /js
            resource = new ClassPathResource(folderPath + scriptName);
        }

        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.valueOf("application/javascript"))
                .body(resource);
    }
     */
    /*
    @GetMapping("/{scriptName}")
    public ResponseEntity<Resource> getScript(@PathVariable String scriptName) {
        String folderPath = "static/js/";
        System.out.println("Script nombre que ha entrado "+folderPath + scriptName);
        Resource resource = new ClassPathResource(folderPath + scriptName);

        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.valueOf("application/javascript"))
                .body(resource);
    }

     */

    @GetMapping("/js/{scriptName:.+}")
    public ResponseEntity<Resource> getScript(@PathVariable String scriptName) {
        String folderPath = "static/js/";
        System.out.println("----------> Nombre Script que ha entrado "+ scriptName);
        Resource resource = new ClassPathResource(folderPath + scriptName);

        if (!resource.exists()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.valueOf("application/javascript"))
                .body(resource);
    }
}
