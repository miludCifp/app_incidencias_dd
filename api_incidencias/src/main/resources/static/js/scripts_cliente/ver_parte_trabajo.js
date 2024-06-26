import * as manejadorToken from '../manejador_token.js';
import * as pagDetallesParteTb from "./ver_detalles_parte_tb.js";

let serverIP = "http://185.166.39.117:8080";

function obtenerToken() {
    return manejadorToken.getToken();
}

function getIdFromToken(token) {
    const payload = JSON.parse(atob(token.split('.')[1]));  // Decodificar la parte del payload del token
    return payload.id;  // Obtener el id del payload
}

// Función para hacer la petición GET
async function obtenerPartesTrabajo() {
    const token = await obtenerToken();
    const idUser = await getIdFromToken(token);

    try {
        const response = await fetch(serverIP+'/api/v1/parte-trabajo/cliente/'+idUser, {
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
        const diagnostico = parte.diagnostico !== undefined && parte.diagnostico !== null ? parte.diagnostico : '-';
        const trabajoRealizado = parte.trabajoRealizado !== undefined && parte.trabajoRealizado !== null ? parte.trabajoRealizado : '-';
        const observaciones = parte.observaciones !== undefined && parte.observaciones !== null ? parte.observaciones : '-';

        const row = `
            <tr>
                <td style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100px;">${parte.idOrden}</td>
                <td style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100px;">${parte.incidencia.idIncidencia}</td>
                <td style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px;">${descripcion}</td>
                <td style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 300px;">${diagnostico}</td>
                <td style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px;">${trabajoRealizado}</td>
                <td style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px;">${observaciones}</td>
                <td style="white-space: nowrap;">
                    <button type="button" class="btn btn-sm btn-primary btn-detalles-partetb" data-id="${parte.idOrden}" title="Ver detalles">Detalles</button>
                    <button onclick="generarPDFParteTb('${encodeURIComponent(JSON.stringify(parte))}','${token}')" type="button" class="btn btn-sm btn-info" id="btn_pdf_parte_tb">Generar PDF</button>
                </td>
            </tr>`;

        // Añadir la fila al cuerpo de la tabla
        tabla.querySelector('tbody').insertAdjacentHTML('beforeend', row);
    }

    // Inicializamos la tabla después de cargar las filas de la tabla.
    new simpleDatatables.DataTable(tabla);

    //onclick="verDetallesParteTb('${encodeURIComponent(JSON.stringify(parte))}')"
    tabla.querySelectorAll('.btn-detalles-partetb').forEach(btnMostrarDetalles => {
        btnMostrarDetalles.addEventListener('click', async function () {

            // Obtener el ID de la incidencia desde el atributo data-id
            const idOrden = this.getAttribute('data-id').toString();
            // Encontrar el objeto de ParteTb correspondiente
            const objetoParteTb = parteTrabajos.find(parteTb => parteTb.idOrden.toString() === idOrden);

            pagDetallesParteTb.verDetallesParteTb(objetoParteTb);

        });
    });
}


// Llamar a la función para cargar los partes de trabajo cuando se cargue el DOM
document.addEventListener('DOMContentLoaded', cargarPartesTrabajoEnTabla);




