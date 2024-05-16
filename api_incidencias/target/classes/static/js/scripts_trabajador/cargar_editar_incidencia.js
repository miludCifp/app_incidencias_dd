
function cargarEditarIncidencia(incidenciaJSON, token) {

    try {
        // Obtenemos el elemento subtitulo de la pagina Ver incidencias por su id
        var subTituloElemento = document.getElementById("subtitle-ver-incidencias");

        // Sobreescribemos el texto del elemento
        subTituloElemento.textContent = "Editar incidencia";


        // Decodificar la cadena JSON
        const decodedIncidenciaJson = decodeURIComponent(incidenciaJSON);

        // Parsear la cadena JSON a un objeto
        const objetoIncidencia = JSON.parse(decodedIncidenciaJson);

        console.log("el id de la incidencia selecionada es ===> ", objetoIncidencia.idIncidencia);

        console.log("token recibido es ===> ", token);

        // Obtenemos los datos de la incidencia desde el objeto incidencia recibido por parametro
        var idIncidencia = objetoIncidencia.idIncidencia;
        var titulo = objetoIncidencia.titulo;
        var descripcion = objetoIncidencia.descripcion;
        var fechaCreacion = objetoIncidencia.fechaCreacion.split('T')[0];
        var prioridad = objetoIncidencia.prioridad;
        var estado = objetoIncidencia.estado;



        console.log("Prioridad obtenida de la tabla ----->" + prioridad);
        console.log("Estado obtenida de la tabla ----->" + estado);


        // Actualizamos los elementos HTML con los detalles de la incidencia
        document.getElementById("idIncidencia-edit").value = idIncidencia;
        document.getElementById("tituloIncid-edit").value = titulo;
        document.getElementById("descIncid-edit").value = descripcion;
        document.getElementById("fechaIncid-edit").value = fechaCreacion;
        document.getElementById("prioridadIncid-edit").value = prioridad;
        document.getElementById("estadoIncid-edit").value = estado;


        // Ocultamos la tabla de listado de incidencias
        document.getElementById("tablaListadoIncidencias").style.display = "none";

        document.getElementById("btnNuevaIncidencia").style.display = "none";

        // Mostramos el formulario de editar incidencia
        document.getElementById("editarIncidenciaForm").style.display = "block";

        // Editamos la incidencia
        editarIncidencia(objetoIncidencia, token);

    } catch (error) {
        console.error("Error al parsear la cadena JSON:", error);
    }

}


// Esta funcion actualiza la incidencia en la base de datos pasando por el servidor
async function editarIncidencia(objetoIncidencia, token) {

    // Obtenemos los datos de la incidencia desde la fila
    var idIncidencia = objetoIncidencia.idIncidencia;

    console.log('id de la fila a editar es : ' + idIncidencia);

    // Hacemos una solicitud GET para obtener los datos originales de la incidencia
    try {
        const response = await fetch('http://localhost:8080/api/v1/incidencias/' + idIncidencia, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Error al obtener los datos de la incidencia');
        }
        const incidenciaOriginal = await response.json();

        // Obtener los datos de la incidencia original
        var idIncidenciaOriginal = incidenciaOriginal.idIncidencia;
        var titulo = incidenciaOriginal.titulo;
        var descripcion = incidenciaOriginal.descripcion;
        var fechaCreacion = incidenciaOriginal.fechaCreacion.split('T')[0];
        var prioridad = incidenciaOriginal.prioridad;
        var estado = incidenciaOriginal.estado;

        /*
        // Actualizar los campos del formulario
        document.getElementById("tituloIncid-edit").value = titulo;
        document.getElementById("descIncid-edit").value = descripcion;
        document.getElementById("fechaIncid-edit").value = fechaCreacion;
        document.getElementById("prioridadIncid-edit").value = prioridad;
        document.getElementById("estadoIncid-edit").value = estado;
        */

        // Si hay cambios, hacemos una solicitud PUT al servidor pasándole el id obtenido por la solicitud GET
        var urlPut = 'http://localhost:8080/api/v1/incidencias/' + idIncidenciaOriginal;

        // Escuchar el evento submit del formulario
        document.getElementById("editarIncidenciaForm").addEventListener("submit", async function (event) {
            event.preventDefault();

            // Obtener los nuevos valores del formulario
            var nuevoTitulo = document.getElementById("tituloIncid-edit").value;
            var nuevaDescripcion = document.getElementById("descIncid-edit").value;
            var nuevaFechaCreacion = document.getElementById("fechaIncid-edit").value;
            var nuevaPrioridad = document.getElementById("prioridadIncid-edit").value.toLowerCase();
            var nuevoEstado = document.getElementById("estadoIncid-edit").value.toLowerCase();



            // Imprimir todas las variables para depuración
            console.log("Valores originales:");
            console.log("Titulo:", titulo);
            console.log("Descripción:", descripcion);
            console.log("Fecha de creación:", fechaCreacion);
            console.log("Prioridad:", prioridad);
            console.log("Estado:", estado);
            console.log("Valores nuevos:");
            console.log("Nuevo Titulo:", nuevoTitulo);
            console.log("Nueva Descripción:", nuevaDescripcion);
            console.log("Nueva Fecha de creación:", nuevaFechaCreacion);
            console.log("Nueva Prioridad:", nuevaPrioridad);
            console.log("Nuevo Estado:", nuevoEstado);


            // Verificar si ha habido cambios
            if (nuevoTitulo == titulo &&
                nuevaDescripcion == descripcion &&
                nuevaFechaCreacion == fechaCreacion &&
                nuevaPrioridad == prioridad &&
                nuevoEstado == estado) {
                // No hay cambios, mostrar alerta y salir de la función
                //alert("No se han realizado cambios.");
                Swal.fire({
                    title: "No se han realizado cambios.",
                    icon: "info"
                });
                return;
            }

            // Construir el objeto de incidencia a actualizar

            console.log('------> ' + idIncidenciaOriginal);

            var incidenciaActualizada = {
                idIncidencia: idIncidenciaOriginal,
                titulo: nuevoTitulo,
                descripcion: nuevaDescripcion,
                estado: nuevoEstado,
                prioridad: nuevaPrioridad.toLowerCase()
            };

            // Realizar la solicitud PUT al servidor
            try {
                const response = await fetch(urlPut, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(incidenciaActualizada)
                });

                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: '¡La incidencia ha sido actualizada correctamente!',
                        text: 'Puedes consultar la incidencia en el botón "Ver incidencias"',
                        willClose: function() {
                            // Redirigir a la página ver incidencias
                            window.location.href = 'ver_incidencias';
                        }
                    });
                    // Aquí podrías recargar la tabla u otras acciones necesarias después de la actualización
                    //location.reload();  // Recargar la página
                } else {
                    throw new Error('Error al actualizar la incidencia');
                    //console.log("No se pudo actualizar la incidencia debido a un fallo en la peticion");
                }
            } catch (error) {
                console.error('Error al actualizar la incidencia:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al actualizar la incidencia.',
                    text: `Por favor, inténtelo de nuevo más tarde.`,
                });
            }
        });

    } catch (error) {
        console.error('Error al obtener los datos de la incidencia:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error al obtener los datos de la incidencia.',
            text: `Por favor, inténtelo de nuevo más tarde.`,
        });
    }
}


function volverListaIncidenciasEditIncid() {
    // Ocultamos el formulario de editar incidencia
    document.getElementById("editarIncidenciaForm").style.display = "none";

    document.getElementById("btnNuevaIncidencia").style.display = "block";

    // Volvemos a mostrar el listado de incidencias
    document.getElementById("tablaListadoIncidencias").style.display = "block";

    // Obtenemos el elemento subtitulo de la pagina Ver incidencias por su id
    var subTituloElemento = document.getElementById("subtitle-ver-incidencias");

    // Sobreescribemos el texto del elemento
    subTituloElemento.textContent = "Ver incidencias";

    location.reload();
}