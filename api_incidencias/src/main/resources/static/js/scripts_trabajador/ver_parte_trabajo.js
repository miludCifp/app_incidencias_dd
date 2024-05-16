import * as manejadorToken from '/js/manejador_token.js';

function obtenerToken() {
    return manejadorToken.getToken();
}

// Función para hacer la petición GET
async function obtenerPartesTrabajo() {
    const token = await obtenerToken();

    try {
        const response = await fetch('http://localhost:8080/api/v1/parte-trabajo', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener los partes');
        }

        const data = await response.json();

        console.log("Datos de los partes recibidos:", data); // Añade este console.log para ver los datos recibidos

        return data;  // Retorna la lista de incidencias
    } catch (error) {
        console.error(error);
    }
}


async function cargarPartesTrabajoEnTabla() {
    // Obtener la tabla donde se cargarán los usuarios
    const tabla = document.getElementById('datatablesSimple');

    // obtengo el token 
    const token = await obtenerToken();

    let parteTrabajos = await obtenerPartesTrabajo();

    // Verificar si los parteTrabajos son un array o no
    if (!Array.isArray(parteTrabajos)) {
        // Si no es un array, convertirlo en un array de un solo elemento
        parteTrabajos = [parteTrabajos];
    }

    // Comprobar si hay parteTrabajos y si el tbody está presente
    if (!parteTrabajos || parteTrabajos.length === 0 || !tabla) {
        console.warn('No se encontraron parteTrabajos o no se encontró la tabla.');
        return;
    }

    // Limpiar el cuerpo de la tabla
    tabla.querySelector('tbody').innerHTML = '';

    // Construir las filas de la tabla con un bucle for
    for (let i = 0; i < parteTrabajos.length; i++) {
        const parte = parteTrabajos[i];

        
        const descripcion = parte.incidencia.descripcion !== undefined && parte.incidencia.descripcion !== null ? parte.incidencia.descripcion : '-';
        const diagnostico = parte.incidencia.diagnostico !== undefined && parte.incidencia.diagnostico !== null ? parte.incidencia.diagnostico : '-';
        const trabajoRealizado = parte.incidencia.trabajoRealizado !== undefined && parte.incidencia.trabajoRealizado !== null ? parte.incidencia.trabajoRealizado : '-';
        const observaciones = parte.incidencia.observaciones !== undefined && parte.incidencia.observaciones !== null ? parte.incidencia.observaciones : '-';

        const row = `
            <tr>
                <td style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100px;">${parte.idOrden}</td>
                <td style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100px;">${parte.incidencia.idIncidencia}</td>
                <td style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px;">${descripcion}</td>
                <td style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 300px;">${diagnostico}</td>
                <td style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px;">${trabajoRealizado}</td>
                <td style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px;">${observaciones}</td>
                <td style="white-space: nowrap;">
                    <button onclick="verDetallesParteTb('${encodeURIComponent(JSON.stringify(parte))}')" type="button" class="btn btn-sm btn-primary" id="btn_detalles_parte_tb">Detalles</button>
                    <button onclick="generarPDFParteTb('${encodeURIComponent(JSON.stringify(parte))}','${token}')" type="button" class="btn btn-sm btn-info" id="btn_pdf_parte_tb">Generar PDF</button>
                    <button onclick="cargarEditarParteTb('${encodeURIComponent(JSON.stringify(parte))}', '${token}')" type="button" class="btn btn-sm btn-warning" id="btn_edit_parte_tb">Editar</button>
                    <button onclick="eliminarParteTb(this,'${encodeURIComponent(JSON.stringify(parte))}', '${token}')" type="button" class="btn btn-sm btn-danger" id="btn_delete_parte_tb">Eliminar</button>
                </td>
            </tr>`;

        // Añadir la fila al cuerpo de la tabla
        tabla.querySelector('tbody').insertAdjacentHTML('beforeend', row);
    }

    // Inicializamos la tabla después de cargar las filas de la tabla.
    new simpleDatatables.DataTable(tabla);
}


// Llamar a la función para cargar los partes de trabajo cuando se cargue el DOM
document.addEventListener('DOMContentLoaded', cargarPartesTrabajoEnTabla);




