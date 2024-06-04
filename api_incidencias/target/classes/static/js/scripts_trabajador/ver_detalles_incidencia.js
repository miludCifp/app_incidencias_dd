import * as manejadorToken from '../manejador_token.js';

function obtenerToken() {
    return manejadorToken.getToken();
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

function cambiarValoresPrioridad(prioridad){
    switch (prioridad) {
        case 'alta':
            return 'Alta';
        case 'media':
            return 'Media';
        case 'baja':
            return 'Baja';
        default:
            return '';
    }
}

export function mostrarDetallesIncidencia(incidencia, token) {

    // Obtenemos el elemento subtitulo de la pagina Ver incidencias por su id
    var subTituloElemento = document.getElementById("subtitle-ver-incidencias");

    // Sobreescribemos el texto del elemento
    subTituloElemento.textContent = "Ver detalles";

    console.log("objeto incidencia selecionada es ===> ", incidencia);

    // Obtenemos los datos de la incidencia desde el objeto incidencia recibido por parametro
    var idIncidencia = incidencia.idIncidencia;
    var titulo = incidencia.titulo;
    var descripcion = incidencia.descripcion;
    var fechaCreacion = incidencia.fechaCreacion.split('T')[0];
    var prioridad = incidencia.prioridad;
    var estado = incidencia.estado;


    // Actualizamos los elementos HTML con los detalles de la incidencia
    document.getElementById("idIncidencia").textContent = idIncidencia;
    document.getElementById("tituloIncidencia").textContent = titulo;
    document.getElementById("descripcionIncidencia").textContent = descripcion;
    document.getElementById("fechaCreacionIncidencia").textContent = fechaCreacion;
    document.getElementById("prioridadIncidencia").textContent = cambiarValoresPrioridad(prioridad);
    document.getElementById("estadoIncidencia").textContent = cambiarValoresEstado(estado);

    // Ocultamos la tabla de listado de incidencias
    document.getElementById("tablaListadoIncidencias").style.display = "none";

    // Ocultamos el boton Nueva incidencia
    document.getElementById("btnNuevaIncidencia").style.display = "none";

    // Mostramos la sección de detalles de la incidencia
    document.getElementById("detallesIncidencia").style.display = "block";

    //*******************************Creando dinamicamente el boton Reabrir incidencia*****************************

    // Creamos el boton Reabrir incidencia despues de verficar el estado
    if (estado === 'terminado' && !esIncidenciaReabierta(idIncidencia)) {

        // Seleccionar el contenedor donde se va a añadir el botón
        var contenedorBotonesIzquierda = document.getElementById("botonesIzquierda");

        // Crear un nuevo botón
        var btnReabrirIncidencia = document.createElement("button");

        // Configurar el botón
        btnReabrirIncidencia.innerHTML = "Reabrir incidencia";
        btnReabrirIncidencia.className = "btn btn-warning"; // Añadir clases de Bootstrap si es necesario
        btnReabrirIncidencia.onclick = async function () {

            // Acciones que deseas que ocurran cuando se hace clic en el nuevo botón
            //alert("¡Has hecho clic en el nuevo botón!");

            try {
                // Llamar a la función crearIncidenciaReabierta con los datos necesarios

                await crearIncidenciaReabierta(incidencia, token);
                // Realizar otras acciones después de que se reabra la incidencia, si es necesario
            } catch (error) {
                console.error('Error al reabrir la incidencia:', error);
                // Manejar el error de alguna manera
            }
        };

        // Añadir el botón al contenedor
        contenedorBotonesIzquierda.appendChild(btnReabrirIncidencia);

    }


}

async function crearIncidenciaReabierta(incidenciaDTO, token) {

    const swalResult = await Swal.fire({
        title: 'Motivo de la reapertura',
        text: 'Descripción breve del motivo de la reapertura de la incidencia',
        icon: 'info',
        input: 'textarea',
        //inputLabel: 'Motivo de la pausa',
        inputPlaceholder: 'Escribe el motivo aquí...',
        inputAttributes: {
            'aria-label': 'Escribe el motivo aquí'
        },
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
    });
    if (swalResult.isConfirmed) {

        const textoIntroducido = swalResult.value;

        //cambio de valores
        incidenciaDTO.descripcion = textoIntroducido;
        incidenciaDTO.estado = 'pendiente';

        try {
            // const token = obtenerToken(); // Suponiendo que tengas una función para obtener el token
            const respuesta = await fetch('http://185.166.39.117:8080/api/v1/incidencias/reabrir-incidencia', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(incidenciaDTO)
            });

            if (respuesta.ok) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Incidencia reabierta correctamente!',
                    text: 'Puedes consultar la incidencia en boton Ver incidencias',
                    willClose: function () {
                        // Redirigir a la página ver_partes_trabajo.html
                        window.location.href = 'ver_incidencias';
                    }
                });
                //const incidenciaReabierta = await respuesta.json();
                //console.log('Incidencia reabierta:', incidenciaReabierta);
                //return incidenciaReabierta;
            } else {
                console.error('Error al reabrir la incidencia:', respuesta.status);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al reabrir la incidencia. codigo error : '+respuesta.status,
                    text: `Por favor, inténtelo de nuevo más tarde.`,
                });
                //throw new Error('Error al reabrir la incidencia');
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            throw error;
        }
    }

}

function esIncidenciaReabierta(idIncidencia) {
    return idIncidencia.includes('R');
}


// Esta función elimina las incidencias de la base de datos actualizando la tabla
export async function eliminarIncidencia(boton, incidencia, token) {
    console.log("el id de la incidencia selecionada es ===> ", incidencia.idIncidencia);

    var idIncidencia = incidencia.idIncidencia;

    // URL para la solicitud DELETE
    var urlDelete = 'http://185.166.39.117:8080/api/v1/incidencias/' + idIncidencia;

    // Confirmar si el usuario realmente quiere eliminar la incidencia
    Swal.fire({
        title: '¿Está seguro de que desea eliminar la incidencia numero ' + idIncidencia + ' ?',
        text: 'La incidencia se eliminará definitivamente',
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
                    var fila = boton.closest("tr");
                    // Eliminar la fila de la tabla
                    fila.remove();

                    Swal.fire({
                        icon: 'success',
                        title: '¡La incidencia ha sido eliminada correctamente!',
                        text: 'El listado de las incidencias se actualizará automaticamente',
                        willClose: async function () {
                            location.reload();
                        }
                    });
                } else {
                    // Manejar errores de la respuesta
                    const errorMessage = await response.text();
                    throw new Error(`Error al eliminar la incidencia: ${errorMessage}`);
                }
            } catch (error) {
                console.error('Error al eliminar la incidencia:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al eliminar la incidencia.',
                    text: `Por favor, inténtelo de nuevo más tarde.`,
                });
            }
        }
    });


}

function volverListadoIncidencias() {
    // Obtenemos el elemento subtitulo de la pagina Ver incidencias por su id
    var subTituloElemento = document.getElementById("subtitle-ver-incidencias");

    // Sobreescribemos el texto del elemento
    subTituloElemento.textContent = "Ver incidencias";

    // Ocultamos los detalles de incidencia
    document.getElementById("detallesIncidencia").style.display = "none";

    // Mostramos el boton Nueva incidencia
    document.getElementById("btnNuevaIncidencia").style.display = "block";

    // Volvemos a mostrar el listado de incidencias
    document.getElementById("tablaListadoIncidencias").style.display = "block";

    //recargar pagina
    location.reload();
}

document.addEventListener('DOMContentLoaded',  function () {
    const btnVolver = document.getElementById('btnVolverDetalles');
    console.log("El boton Volver Detalles Incidencia es ====> " + btnVolver);
    btnVolver.addEventListener('click', volverListadoIncidencias);


});

document.addEventListener('DOMContentLoaded', async function () {
    const token = await obtenerToken();

    const objetoIncidenciaParteTb = JSON.parse(localStorage.getItem('objetoIncidenciaParteTb'));
    if (objetoIncidenciaParteTb) {
        localStorage.removeItem('objetoIncidenciaParteTb');
        mostrarDetallesIncidencia(objetoIncidenciaParteTb,token);
    }
});