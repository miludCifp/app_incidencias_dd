package api_incidencias.api_incidencias.Servicios;

import api_incidencias.api_incidencias.Entidades.Clases.Incidencia;
import api_incidencias.api_incidencias.Entidades.Clases.ParteTrabajo;
import api_incidencias.api_incidencias.Entidades.Enum.Estado;
import api_incidencias.api_incidencias.Repositorios.RepositorioIncidencia;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class IncidenciaService {

    @Autowired
    private RepositorioIncidencia reposIncidencia;
    @Autowired
    private ParteTrabajoService parteTrabajoService;
    @Autowired
    private Seguridad seguridad;

    /************************************ generar id ********************************************/
    private synchronized String generarIdIncidencia(){
        String id = "PTDD" + String.valueOf(LocalDate.now().getYear()).substring(2) + "-";
        Integer ultimoNumero = reposIncidencia.findLastIncidenciaId();
        if (ultimoNumero == null) {
            ultimoNumero = 0;
        }
        return id + (ultimoNumero + 1);
    }
    private synchronized String generarIdIncidenciaReabierta(String idIncidencia){
        String id = "PTDD"+String.valueOf(LocalDate.now().getYear()).substring(2)+"-"+idIncidencia.split("-")[1]+"R"+"-";
        Long ultimoIdReabierta = reposIncidencia.findLastReopenedIncidenciaId(id);
        System.out.println("id ultimo incidencia reabierta = "+ultimoIdReabierta);
        if (ultimoIdReabierta == null) {
            ultimoIdReabierta = 1L;
        }else {
            ultimoIdReabierta += 1;
        }
        return id+ultimoIdReabierta;
    }

    public Incidencia addIncidencia(Incidencia incidencia){
        incidencia.setIdIncidencia(generarIdIncidencia());
        return reposIncidencia.save(incidencia);
    }

    public Incidencia addIncidenciaReabierta(Incidencia incidencia){
        incidencia.setIdIncidencia(generarIdIncidenciaReabierta(incidencia.getIdIncidencia()));
        return reposIncidencia.save(incidencia);
    }
    /**
     * Solo pueden acceder a todas las incidencias los trabajadores
     * @return
     */
    public List<Incidencia> getIncidencias() {
        if (seguridad.isTrabajador())
            return reposIncidencia.findAllIncidencias();
        return null;
    }
    public List<Incidencia> getIncidenciasReabiertas(String idIncidencia) {
        if (seguridad.isTrabajador())
            return reposIncidencia.findIncidenciasReabiertas(idIncidencia);
        return null;
    }
    public List<Incidencia> getIncidenciasCliente(Long idCliente){
        return reposIncidencia.findByCliente(idCliente);
    }

    public Optional<Incidencia> getIncidencias(String id){
        return reposIncidencia.findById(id);
    }


    /**
     * Solo se puede editar si la incidencia esta abierta y es el mismo o tranajador
     * @param idIncidencia
     * @param incidencia
     * @return
     */
    public Incidencia updateIncidencia(String idIncidencia, Incidencia incidencia) {
        if (seguridad.isTrabajador() || seguridad.isElMismo(incidencia.getUsuarioCliente().getCorreoElectronico())) {
            Optional<Incidencia> incidenciaExistenteOptional = reposIncidencia.findById(idIncidencia);

            System.out.println(" Estoy dentro del update incidencia " + seguridad.getRol());

            System.out.println("El estado que ha entrado es : " + incidencia.getEstado().name());


            if (incidenciaExistenteOptional.isPresent()) {
                Incidencia incidenciaExistente = incidenciaExistenteOptional.get();

                Optional<Incidencia> incidenciaOriginal = getIncidencias(idIncidencia);

                Estado estadoOriginal = incidenciaOriginal.get().getEstado();

                //Si la incidencia es aceptada o finalizada no se podra modificar


                // Actualizo los atributos del libro existente con los del libro proporcionado
                incidenciaExistente.setTitulo(incidencia.getTitulo());
                incidenciaExistente.setDescripcion(incidencia.getDescripcion());
                incidenciaExistente.setFechaCreacion(incidencia.getFechaCreacion());
                incidenciaExistente.setEstado(incidencia.getEstado());
                incidenciaExistente.setPrioridad(incidencia.getPrioridad());
                incidenciaExistente.setUsuarioCliente(incidencia.getUsuarioCliente());
                // Guarda el usuario actualizado en el repositorio
                return reposIncidencia.save(incidenciaExistente);

            } else {
                throw new IllegalArgumentException("La incidencia con el ID proporcionado no existe.");
            }
        }
        return  null;
    }


    /**
     * Solo puede borrar el admin
     * @param id
     * @return
     */
    public ResponseEntity<String> deleteIncidencia(String id){
        if (seguridad.isAdmin()) {
            Optional<Incidencia> incidencia = reposIncidencia.findById(id);
            if (incidencia.isPresent()) {
                ParteTrabajo parte = incidencia.get().getParteTrabajo();
                if (parte != null){
                    parteTrabajoService.deleteParteTrabajo(parte.getIdOrden());
                }
                reposIncidencia.deleteById(id);

                return ResponseEntity.status(HttpStatus.NO_CONTENT)
                        .body("Incidencia eliminado correctamente.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("No se encontró la incidencia correspondiente.");
            }
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("No tienes permisos.");
    }

}
