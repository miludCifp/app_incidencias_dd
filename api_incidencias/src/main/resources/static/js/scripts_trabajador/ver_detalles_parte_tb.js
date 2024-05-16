function verDetallesParteTb(parteTbJson) {
    try {
        // Obtenemos el elemento subtitulo de la pagina Ver partes de trabajo por su id
        var subTituloElemento = document.getElementById("subtitle-ver-partes-tb");

        // Sobreescribemos el texto del elemento
        subTituloElemento.textContent = "Ver detalles";


        // Decodificar la cadena JSON
        const decodedParteJson = decodeURIComponent(parteTbJson);

        // Parsear la cadena JSON a un objeto
        const parteTb = JSON.parse(decodedParteJson);

        console.log("parte ===> ", parteTb);

        // Obtenemos los datos de la incidencia desde el objeto ParteTb
        var idParteTb = parteTb.idOrden;
        var motivoParteTb = parteTb.incidencia.descripcion;
        var diagnosticoParteTb = parteTb.diagnostico;
        var tbRealizadoParteTb = parteTb.trabajoRealizado;
        var observacionesParteTb = parteTb.observaciones;

        // Actualizamos los elementos HTML con los detalles de la incidencia
        document.getElementById("idParteTb").textContent = idParteTb;
        document.getElementById("idParteTb").textContent = idParteTb;
        document.getElementById("motivoParteTb").textContent = motivoParteTb;
        document.getElementById("diagnosticoParteTb").textContent = diagnosticoParteTb;
        document.getElementById("tbRealizadoParteTb").textContent = tbRealizadoParteTb;
        mostrarDatosIncidencia(parteTb.incidencia);
        // Mostrar los datos del tecnico
        mostrarDatosTecnico(parteTb.tecnico);
        // Mostrar los materiales
        mostrarMateriales(parteTb.listaMaterialUtilizado);
        // Mostrar los tiempos empleados
        mostrarTiemposEmpleados(parteTb.listaTiempoEmpleados);

        document.getElementById("observacionesParteTb").textContent = observacionesParteTb;

        // Ocultamos la tabla de listado de partes de trabajo
        document.getElementById("tablaListadoPartesTb").style.display = "none";

        // Mostramos los detalles del parte de trabajo
        document.getElementById("detallesParteTb").style.display = "block";
    } catch (error) {
        console.error("Error al parsear la cadena JSON:", error);
    }
}

// cambia los valores del estado
function cambiarValoresEstado(estado) {
    switch (estado) {
        case 'pendiente':
            return 'Pendiente';
        case 'tramite':
            return 'En trámite';
        case 'proceso_soluccion':
            return 'En proceso de solución';
        case 'espera_recursos':
            return 'En espera de recursos';
        case 'revision':
            return 'En revisión';
        case 'espera_aprobacion':
            return 'En espera de aprobación';
        case 'espera_validacion':
            return 'En espera de validación';
        case 'pendiente_pieza':
            return 'Pendiente de pieza';
        case 'espera_cliente':
            return 'Espera de cliente';
        case 'espera_presupuesto':
            return 'Espera de situación de presupuesto';
        case 'seguimiento':
            return 'Seguimiento';
        case 'terminado':
            return 'Terminado';
        case 'cancelado':
            return 'Cancelado';
        default:
            return '';
    }
}

function mostrarDatosIncidencia(objetoIncidencia) {
    // Obtener el elemento tbody donde se mostrarán los datos del tecnico
    var tablaDatosIncidencia = document.getElementById('tablaInfoIncidenciaParteTb');

    // Limpiar el contenido previo de la tabla
    tablaDatosIncidencia.innerHTML = '';

    // Crear una nueva fila
    var fila = document.createElement('tr');

    // Crear celdas para cada propiedad del material
    var celdaIdIncidencia = document.createElement('td');
    celdaIdIncidencia.textContent = objetoIncidencia.idIncidencia;
    fila.appendChild(celdaIdIncidencia);

    var celdaTitulo = document.createElement('td');
    celdaTitulo.textContent = objetoIncidencia.titulo;
    fila.appendChild(celdaTitulo);

    var celdaDescripcion = document.createElement('td');
    celdaDescripcion.textContent = objetoIncidencia.descripcion;
    fila.appendChild(celdaDescripcion);

    var celdaEstado = document.createElement('td');
    celdaEstado.textContent = cambiarValoresEstado(objetoIncidencia.estado);
    fila.appendChild(celdaEstado);

    var celdaPrioridad = document.createElement('td');
    celdaPrioridad.textContent = objetoIncidencia.prioridad.charAt(0).toUpperCase() + objetoIncidencia.prioridad.slice(1);
    fila.appendChild(celdaPrioridad);

    var celdaVerIncidencia = document.createElement('td');

    // Crear el botón
    var botonIncidencia = document.createElement('button');
    botonIncidencia.type = 'button';
    botonIncidencia.className = 'btn btn-sm btn-warning'; // Puedes cambiar la clase para ajustar el estilo del botón
    botonIncidencia.title = 'Ver incidencias'; // Puedes cambiar la clase para ajustar el estilo del botón
    botonIncidencia.id = 'btnVerincidenciasPartesTb';

    // Agregar el icono al botón (usando FontAwesome por ejemplo)
    var iconoIncidencia = document.createElement('i');
    iconoIncidencia.className = 'fas fa-exclamation-circle'; // Icono que representa una incidencia
    botonIncidencia.appendChild(iconoIncidencia);

    // Añadir el botón a la celda
    celdaVerIncidencia.appendChild(botonIncidencia);
    // Añadir la celda a la fila
    fila.appendChild(celdaVerIncidencia);
    // Añadir un event listener al botón
    botonIncidencia.addEventListener('click', function () {
        //alert('Incidencia ID: ');
        window.location.href = 'ver_incidencias';
    });


    // Agregar la fila a la tabla
    tablaDatosIncidencia.appendChild(fila);
}

function mostrarDatosTecnico(objetoTecnico) {
    // Obtener el elemento tbody donde se mostrarán los datos del tecnico
    var tablaDatosTecnico = document.getElementById('tablaInfoTecnicoParteTb');

    // Limpiar el contenido previo de la tabla
    tablaDatosTecnico.innerHTML = '';

    // Crear una nueva fila
    var fila = document.createElement('tr');

    // Crear celdas para cada propiedad del material
    var celdaDocumento = document.createElement('td');
    celdaDocumento.textContent = objetoTecnico.document;
    fila.appendChild(celdaDocumento);

    var celdaNombreApellidos = document.createElement('td');
    celdaNombreApellidos.textContent = objetoTecnico.nombre + ' ' + objetoTecnico.apellido;
    fila.appendChild(celdaNombreApellidos);

    var celdaEmail = document.createElement('td');
    celdaEmail.textContent = objetoTecnico.correoElectronico;
    fila.appendChild(celdaEmail);

    var celdaTlfn = document.createElement('td');
    celdaTlfn.textContent = objetoTecnico.telefono;
    fila.appendChild(celdaTlfn);

    // Agregar la fila a la tabla
    tablaDatosTecnico.appendChild(fila);
}

function mostrarMateriales(materiales) {
    // Obtener el elemento tbody donde se mostrarán los materiales
    var tablaMaterialesParteTb = document.getElementById('tablaMaterialesParteTb');

    // Limpiar el contenido previo de la tabla
    tablaMaterialesParteTb.innerHTML = '';

    // Iterar sobre el array de materiales y agregar cada uno como una fila a la tabla
    materiales.forEach(function (material) {
        // Crear una nueva fila
        var fila = document.createElement('tr');

        // Crear celdas para cada propiedad del material
        var celdaNombre = document.createElement('td');
        celdaNombre.textContent = material.nombre;
        fila.appendChild(celdaNombre);

        var celdaCantidad = document.createElement('td');
        celdaCantidad.textContent = material.cantidad;
        fila.appendChild(celdaCantidad);

        var celdaCosto = document.createElement('td');
        celdaCosto.textContent = material.coste;
        fila.appendChild(celdaCosto);

        // Agregar la fila a la tabla
        tablaMaterialesParteTb.appendChild(fila);
    });
}

function mostrarTiemposEmpleados(tiemposEmpleados) {
    // Obtener el elemento tbody donde se mostrarán los materiales
    var tablaTiemposEmpleados = document.getElementById('tablaTiemposParteTb');

    // Limpiar el contenido previo de la tabla
    tablaTiemposEmpleados.innerHTML = '';

    // Iterar sobre el array de materiales y agregar cada uno como una fila a la tabla
    tiemposEmpleados.forEach(function (tiempo) {
        // Crear una nueva fila
        var fila = document.createElement('tr');

        // Crear celdas para cada propiedad del material
        var celdaFecha = document.createElement('td');
        celdaFecha.textContent = tiempo.fecha;
        fila.appendChild(celdaFecha);

        var celdaHoraEntrada = document.createElement('td');
        celdaHoraEntrada.textContent = tiempo.horaEntrada;
        fila.appendChild(celdaHoraEntrada);

        var celdaHoraSalida = document.createElement('td');
        celdaHoraSalida.textContent = tiempo.horaSalida;
        fila.appendChild(celdaHoraSalida);

        var celdaModoResolucion = document.createElement('td');
        celdaModoResolucion.textContent = tiempo.modoResolucion;
        fila.appendChild(celdaModoResolucion);

        // Agregar la fila a la tabla
        tablaTiemposEmpleados.appendChild(fila);
    });
}

async function eliminarParteTb(boton, parteTbJson, token) {

    try {
        // Decodificar la cadena JSON
        const decodedParteJson = decodeURIComponent(parteTbJson);

        // Parsear la cadena JSON a un objeto
        const parteTb = JSON.parse(decodedParteJson);

        console.log("parte => ", parteTb);

        var idOrden = parteTb.idOrden;

        var idIncidencia = parteTb.incidencia.idIncidencia;

        console.log("idOrden de la fila seleccionada es  => ", idOrden);
        // URL para la solicitud DELETE
        var urlDelete = 'http://localhost:8080/api/v1/parte-trabajo/' + idOrden;

        // Confirmar si el usuario realmente quiere eliminar la incidencia
        Swal.fire({
            title: '¿Está seguro de que desea eliminar el parte de trabajo ' + idIncidencia + ' ?',
            text: 'El parte de trabajo se eliminará definitivamente',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, Eliminar',
            cancelButtonText: 'No, Cancelar'
        }).then(async (result) => {
            // Si el usuario confirma
            if (result.isConfirmed) {
                // Realizar la solicitud DELETE
                try {
                    const response = await fetch(urlDelete, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    // Verificar el estado de la respuesta
                    if (response.ok) {
                        // Obtener la fila de la tabla donde se encuentra el botón

                        console.log("Parte de trabajo eliminado con exito");

                        var fila = boton.closest("tr");
                        // Eliminar la fila de la tabla
                        fila.remove();

                        Swal.fire({
                            icon: 'success',
                            title: '¡El parte de trabajo ha sido eliminado correctamente!',
                            text: 'El listado de los partes de trabajo se actualizará automaticamente',
                        });
                    } else {
                        // Manejar errores de la respuesta
                        const errorMessage = await response.text();
                        //throw new Error(`Error al eliminar el parte de trabajo: ${errorMessage}`);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error al eliminar el parte de trabajo',
                            text: 'Mensaje de error : ' + errorMessage,
                        });

                    }
                } catch (error) {
                    console.error('Error al eliminar el parte de trabajo:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error al eliminar el parte de trabajo.',
                        text: `Por favor, inténtelo de nuevo más tarde.`,
                    });
                }
            }
        });

    } catch (error) {
        console.error("Error al parsear la cadena JSON:", error);
    }

}

function volverListadoPartesTb() {
    // Ocultamos los detalles del parte de trabajo
    document.getElementById("detallesParteTb").style.display = "none";

    // Volvemos a mostrar el listado de partes de trabajo
    document.getElementById("tablaListadoPartesTb").style.display = "block";

    // Obtenemos el elemento subtitulo de la pagina Ver partes de trabajo por su id
    var subTituloElemento = document.getElementById("subtitle-ver-partes-tb");

    // Sobreescribemos el texto del elemento
    subTituloElemento.textContent = "Consultar partes de trabajo";

    location.reload();
}