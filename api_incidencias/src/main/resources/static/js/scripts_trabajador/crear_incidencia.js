import * as manejadorToken from '/js/manejador_token.js';



async function crearIncidencia() {

    const titulo = document.querySelector('#titulo').value;
    //const fechaCreacion = document.querySelector('#fecha_creacion').value;
    const descripcion = document.querySelector('#descripcion').value;
    //const estado = document.querySelector('#estado').value;
    const prioridad = document.querySelector('#prioridad').value;

    if (descripcion === '') {
        Swal.fire({
            title: 'Por favor, introduce una breve descripcion de la incidencia',
            icon: 'warning'
          })
    } else {
        const datos = {
            titulo: titulo,
            //fechaCreacion: fechaCreacion,
            descripcion: descripcion,
            estado: 'pendiente',
            prioridad: prioridad.toLowerCase()
        };

        try {
            const token = manejadorToken.getToken();

            const respuesta = await fetch('http://localhost:8080/api/v1/incidencias', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(datos)
            });

            if (!respuesta.ok) {
                throw new Error(`HTTP error! Status: ${respuesta.status}`);
            }

            const data = await respuesta.json();
            console.log('Respuesta del servidor:', data);

            Swal.fire({
                icon: 'success',
                title: '¡Incidencia creada correctamente!',
                text: 'Puedes consultar la incidencia en boton Ver incidencias',
                willClose: function () {
                    // Redirigir a la página ver_partes_trabajo.html
                    window.location.href = 'ver_incidencias';
                }
            });

        } catch (error) {
            //console.error('Error:', error);

            // Mostrar alerta de error
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Hubo un error al enviar los datos`,
            });
        }
    }

}

document.addEventListener('DOMContentLoaded', () => {
    const botonCrearIncidencia = document.querySelector('.btn-primary');

    botonCrearIncidencia.addEventListener('click', async function (event) {
        event.preventDefault();
        await crearIncidencia();
    });
});