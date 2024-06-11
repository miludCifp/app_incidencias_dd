import * as manejadorToken from '../manejador_token.js';
import * as pagDetallesIncidencia from "./ver_detalles_incidencia.js";

let serverIP = "http://185.166.39.117:8080";

function obtenerToken() {
    return manejadorToken.getToken();
}

function obtenerIDUser(token) {
    return manejadorToken.getIdFromToken(token);
}

async function obtenerIncidenciasReabiertas(idIncidencia) {
    const token = await obtenerToken();

    try {
        const response = await fetch(serverIP+'/api/v1/incidencias/incidencias-reabiertas/' + idIncidencia, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener las incidencias reabiertas');
        }

        const data = await response.text();

        // Verificar si la respuesta está vacía
        if (data.trim() === '') {
            console.log("La respuesta del servidor está vacía");
            return null;
        }

        // Si la respuesta no está vacía, intenta analizarla como JSON
        const jsonData = JSON.parse(data);
        console.log("Datos de incidencias reabiertas recibidos:", jsonData);

        if (Array.isArray(jsonData) && jsonData.length > 0) {
            return jsonData;
        } else {
            console.log("No hay incidencias reabiertas para la incidencia con ID:", idIncidencia);
            return null;
        }
    } catch (error) {
        console.error(error);
        return null;
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

const mapaIncidencias = {};
const mapaFilaPrincipal = {};

/*
async function cargarIncidenciasEnTabla(incidencias) {
    // Obtener la tabla donde se cargarán los usuarios
    const tabla = document.getElementById('datatablesSimple');

    // obtengo el token 
    const token = await obtenerToken();

    //let incidencias = await pagInicio.obtenerIncidencias();

    let incidenciasReabiertas;

    let hayReabiertas;

    // Verificar si las incidencias son un array o no
    if (!Array.isArray(incidencias)) {
        // Si no es un array, convertirlo en un array de un solo elemento
        incidencias = [incidencias];
    }

    // Verificar si hay usuarios y si la tabla está presente
    if (!incidencias || incidencias.length === 0 || !tabla) {
        console.warn('No se encontraron incidencias o no se encontró la tabla.');
        return;
    }

    // Limpiar el cuerpo de la tabla
    tabla.querySelector('tbody').innerHTML = '';

    let filaPrincipal;

    // Construir las filas de la tabla con un bucle for
    for (let i = 0; i < incidencias.length; i++) {
        const incidencia = incidencias[i];

        incidenciasReabiertas = null;
        // Obtenemos las incidencais reabiertas de la cada incidencia
        incidenciasReabiertas = await obtenerIncidenciasReabiertas(incidencia.idIncidencia);

        // Si hay incidencias reabiertas, agregarlas al mapa
        if (incidenciasReabiertas !== null) {
            // Verificar si ya existe una entrada para esta incidencia en el mapa
            if (mapaIncidencias[incidencia.idIncidencia]) {
                // Si ya existe, agregar las incidencias reabiertas a la lista existente
                mapaIncidencias[incidencia.idIncidencia].push(...incidenciasReabiertas);
            } else {
                // Si no existe, crear una nueva entrada en el mapa con la lista de incidencias reabiertas
                mapaIncidencias[incidencia.idIncidencia] = incidenciasReabiertas;
            }
        }

        //Verificar si hay incidencias reabiertas
        hayReabiertas = incidenciasReabiertas !== null && incidenciasReabiertas.length > 0;

        filaPrincipal = document.createElement("tr");
        filaPrincipal.classList.add("fila");
        //filaPrincipal.setAttribute('id', incidencia.idIncidencia);    
        filaPrincipal.id = incidencia.idIncidencia;
        filaPrincipal.innerHTML = `
        <td style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100px;">${incidencia.idIncidencia}</td>
        <td style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100px;">${incidencia.titulo}</td>
        <td style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px;">${incidencia.fechaCreacion.split('T')[0]}</td>
        <td style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px;">
            <span class="btn btn-sm btn-${incidencia.prioridad === 'alta' ? 'danger' : incidencia.prioridad === 'media' ? 'warning' : 'secondary'}">${incidencia.prioridad.charAt(0).toUpperCase() + incidencia.prioridad.slice(1)}</span>
        </td>
        <td style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px;">
            <span class="btn btn-sm btn-${incidencia.estado === 'terminado' ? 'success' : incidencia.estado === 'tramite' ? 'primary' : 'warning'}">${cambiarValoresEstado(incidencia.estado)}</span>
        </td>
        <td style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 300px;">
            <button onclick="mostrarDetallesIncidencia('${encodeURIComponent(JSON.stringify(incidencia))}', '${token}')" type="button" class="btn btn-sm btn-primary" id="btn_detalles_incidencia_${incidencia.idIncidencia}">Detalles</button>
            <button onclick="cargarEditarIncidencia('${encodeURIComponent(JSON.stringify(incidencia))}', '${token}')" type="button" class="btn btn-sm btn-warning" id="btn_edit_incidencia_${incidencia.idIncidencia}">Editar</button>
            ${hayReabiertas ? `<button type="button" class="btn btn-sm btn-secondary btn-incid-reabiertas" data-id="${incidencia.idIncidencia}" title="Ver incidencias reabiertas"><i class="fas fa-chevron-down"></i></button>` : ''}
        </td>
    `;
        tabla.querySelector('tbody').appendChild(filaPrincipal);

        // Crear subfilas Despues de hacer la comprobacion de si hay incidencias reabiertas
        //generarSubfilas(tabla);
        
       
        // Guardamos las filas principales
        mapaFilaPrincipal[incidencia.idIncidencia] = filaPrincipal;
        
    }

    // Inicializamos la tabla después de cargar las filas de la tabla.
    new simpleDatatables.DataTable(tabla);

    // Si hay incidencias reabiertas, asignar evento click al botón "Reabierta"
    console.log("----> Hay reabiertas " + hayReabiertas);
   // if (hayReabiertas) {
        tabla.querySelectorAll('.btn-incid-reabiertas').forEach(btnIncidReabiertas => {
            btnIncidReabiertas.addEventListener('click', async function () {

                // Obtener el ID de la incidencia desde el atributo data-id
                
                const idIncidenciaPrincipal = this.getAttribute('data-id').toString();
                console.warn("id antes del metodo" + idIncidenciaPrincipal);
                await verOrOcultarSubFilas(this, token, idIncidenciaPrincipal);
               
            });
        });
    //}

}
*/

async function cargarIncidenciasEnTabla(incidencias) {
    // Obtener la tabla donde se cargarán los usuarios
    const tabla = document.getElementById('datatablesSimple');

    // obtengo el token
    const token = await obtenerToken();

    //let incidencias = await pagInicio.obtenerIncidencias();

    let incidenciasReabiertas;

    let hayReabiertas;

    // Verificar si las incidencias son un array o no
    if (!Array.isArray(incidencias)) {
        // Si no es un array, convertirlo en un array de un solo elemento
        incidencias = [incidencias];
    }

    // Verificar si hay usuarios y si la tabla está presente
    if (!incidencias || incidencias.length === 0 || !tabla) {
        console.warn('No se encontraron incidencias o no se encontró la tabla.');
        return;
    }

    // Limpiar el cuerpo de la tabla
    tabla.querySelector('tbody').innerHTML = '';

    let filaPrincipal;

    // Construir las filas de la tabla con un bucle for
    for (let i = 0; i < incidencias.length; i++) {
        const incidencia = incidencias[i];

        incidenciasReabiertas = null;
        // Obtenemos las incidencais reabiertas de la cada incidencia
        incidenciasReabiertas = await obtenerIncidenciasReabiertas(incidencia.idIncidencia);

        // Si hay incidencias reabiertas, agregarlas al mapa
        if (incidenciasReabiertas !== null) {
            // Verificar si ya existe una entrada para esta incidencia en el mapa
            if (mapaIncidencias[incidencia.idIncidencia]) {
                // Si ya existe, agregar las incidencias reabiertas a la lista existente
                mapaIncidencias[incidencia.idIncidencia].push(...incidenciasReabiertas);
            } else {
                // Si no existe, crear una nueva entrada en el mapa con la lista de incidencias reabiertas
                mapaIncidencias[incidencia.idIncidencia] = incidenciasReabiertas;
            }
        }

        //Verificar si hay incidencias reabiertas
        hayReabiertas = incidenciasReabiertas !== null && incidenciasReabiertas.length > 0;

        filaPrincipal = document.createElement("tr");
        filaPrincipal.classList.add("fila");
        //filaPrincipal.setAttribute('id', incidencia.idIncidencia);
        filaPrincipal.id = incidencia.idIncidencia;
        filaPrincipal.innerHTML = `
        <td style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100px;">${incidencia.idIncidencia}</td>
        <td style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100px;">${incidencia.titulo}</td>
        <td style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px;">${incidencia.fechaCreacion.split('T')[0]}</td>
        <td style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px;">
            <span class="btn btn-sm btn-${incidencia.prioridad === 'alta' ? 'danger' : incidencia.prioridad === 'media' ? 'warning' : 'secondary'}">${incidencia.prioridad.charAt(0).toUpperCase() + incidencia.prioridad.slice(1)}</span>
        </td>
        <td style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px;">
            <span class="btn btn-sm btn-${incidencia.estado === 'terminado' ? 'success' : incidencia.estado === 'tramite' ? 'primary' : 'warning'}">${cambiarValoresEstado(incidencia.estado)}</span>
        </td>
        <td style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 300px;">
            <button type="button" class="btn btn-sm btn-primary btn-mostrar-detalles" data-id="${incidencia.idIncidencia}" title="Ver detalles">Detalles</button>
            <button onclick="cargarEditarIncidencia('${encodeURIComponent(JSON.stringify(incidencia))}', '${token}')" type="button" class="btn btn-sm btn-warning" id="btn_edit_incidencia_${incidencia.idIncidencia}">Editar</button>
            ${hayReabiertas ? `<button type="button" class="btn btn-sm btn-secondary btn-incid-reabiertas" data-id="${incidencia.idIncidencia}" title="Ver incidencias reabiertas"><i class="fas fa-chevron-down"></i></button>` : ''}
        </td>
    `;
        tabla.querySelector('tbody').appendChild(filaPrincipal);

        // Guardamos las filas principales
        mapaFilaPrincipal[incidencia.idIncidencia] = filaPrincipal;
    }

    // Inicializamos la tabla después de cargar las filas de la tabla.
    new simpleDatatables.DataTable(tabla);

    //onclick="mostrarDetallesIncidencia('${encodeURIComponent(JSON.stringify(incidencia))}', '${token}')"
    tabla.querySelectorAll('.btn-mostrar-detalles').forEach(btnMostrarDetalles => {
        btnMostrarDetalles.addEventListener('click', async function () {

            // Obtener el ID de la incidencia desde el atributo data-id
            const idIncidencia = this.getAttribute('data-id').toString();
            // Encontrar el objeto de incidencia correspondiente
            const objetoIncidencia = incidencias.find(incidencia => incidencia.idIncidencia.toString() === idIncidencia);

            pagDetallesIncidencia.mostrarDetallesIncidencia(objetoIncidencia, token);

        });
    });


    // Si hay incidencias reabiertas, asignar evento click al botón "Reabierta"
    console.log("----> Hay reabiertas " + hayReabiertas);
    // if (hayReabiertas) {
    tabla.querySelectorAll('.btn-incid-reabiertas').forEach(btnIncidReabiertas => {
        btnIncidReabiertas.addEventListener('click', async function () {

            // Obtener el ID de la incidencia desde el atributo data-id

            const idIncidenciaPrincipal = this.getAttribute('data-id').toString();
            console.warn("id antes del metodo" + idIncidenciaPrincipal);
            await verOrOcultarSubFilas(this, token, idIncidenciaPrincipal);

        });
    });
    //}

}

// Llamar a la función para cargar las incidencias cuando se cargue el DOM
document.addEventListener("DOMContentLoaded", async function () {

    // Función para obtener los parámetros de la URL
    function getQueryParams() {
        const params = {};
        const queryString = window.location.search.substring(1);
        const queries = queryString.split('&');
        for (const query of queries) {
            const [key, value] = query.split('=');
            params[key] = decodeURIComponent(value);
        }
        return params;
    }

    // Recuperar el tipo de incidencias a mostrar desde los parámetros de la URL
    const params = getQueryParams();
    const tipo = params['tipo'];


    if (tipo === 'resueltas') {
        const incidenciasResueltas = JSON.parse(localStorage.getItem('incidenciasResueltas'));
        if (incidenciasResueltas) {
            console.log("Incidencias Resueltas recibidas desde la pag_inicio es --->:", incidenciasResueltas);
            await cargarIncidenciasEnTabla(incidenciasResueltas);
        } else {
            console.error('No se encontraron incidencias resueltas en localStorage');
        }
    } else if (tipo === 'no_resueltas') {
        const incidenciasNoResueltas = JSON.parse(localStorage.getItem('incidenciasNoResueltas'));
        if (incidenciasNoResueltas) {
            console.log("Incidencias No Resueltas recibidas desde la pag_inicio es --->:", incidenciasNoResueltas);
            await cargarIncidenciasEnTabla(incidenciasNoResueltas);
        } else {
            console.error('No se encontraron incidencias no resueltas en localStorage');
        }
    } else if (tipo === 'todas') {
        const todasIncidencias = JSON.parse(localStorage.getItem('todasIncidencias'));
        if (todasIncidencias) {
            console.log("TODAS Incidencias recibidas desde la pag_inicio es --->:", todasIncidencias);
            // Aquí puedes llamar a tu función para cargar las incidencias en la tabla
            await cargarIncidenciasEnTabla(todasIncidencias);
        } else {
            console.error('No se encontraron TODAS incidencias en localStorage');
        }
    } else {
        // ***************** Obtenemos todas las incidencias ****************** //
        const pagInicio = await import('./pag_inicio.js');
        let incidencias = await pagInicio.obtenerIncidencias();
        await cargarIncidenciasEnTabla(incidencias);
    }

});

async function verOrOcultarSubFilas(boton, token, idIncidenciaPrincipal) {
    var incidenciasReabiertas = mapaIncidencias[idIncidenciaPrincipal];
    var filaPrincipal = mapaFilaPrincipal[idIncidenciaPrincipal];

    // Verificar si ya se han generado las subfilas anteriormente
    let subfilas = filaPrincipal.dataset.subfilas;
    const flecha = boton.querySelector('svg');
    const clase = flecha.getAttribute("class").split(" ")[1].split("-")[2];
    console.warn("BOTON", boton);
    console.warn("-------------------CLASE IMG------------------------ ", clase);
    if (clase === "down") {
        console.warn("IF");
        // Cambiar la dirección del ícono de la flecha según el estado de las subfilas
        if (flecha) {
            flecha.classList.remove('fa-chevron-down');
            flecha.classList.add('fa-chevron-up');
        }
        // Si las subfilas no existen en el estado, generarlas y almacenarlas como un atributo de datos
        subfilas = generarSubFilas(incidenciasReabiertas, filaPrincipal, token);
        filaPrincipal.dataset.subfilas = true; // Marcar que las subfilas se han generado
    } else {
        console.warn("ELSE");
        // Cambiar la dirección del ícono de la flecha según el estado de las subfilas
        if (flecha) {
            flecha.classList.remove('fa-chevron-up');
            flecha.classList.add('fa-chevron-down');
        }
        delete filaPrincipal.dataset.subfilas;
        // Si las subfilas ya existen, simplemente mostrar u ocultar según sea necesario


        borrarSubFilas(idIncidenciaPrincipal);
    }
}


async function generarSubFilas(incidenciasReabiertas, filaPrincipal, token) {
    console.log('---> Lista de incidencias Rbt --->', incidenciasReabiertas);

    const subfilas = [];

    // Recorrer las incidencias reabiertas y generar una subfila para cada una
    for (const incidenciaRbt of incidenciasReabiertas) {
        // Agregar una lista de subfilas a la incidencia principal
        incidenciaRbt.subfilas = [];

        /*
        // Verificar si el parte de trabajo ha sido creado o no
        const objetoParteTrabajo = await obtenerParteTrabajo(incidenciaRbt.idIncidencia);
        let esTerminado = false;

        if (objetoParteTrabajo === null) {
            esTerminado = true;
        } else {
            esTerminado = objetoParteTrabajo.terminado;
        }
         */

        // Crear la subfila
        const subFila = document.createElement("tr");
        subFila.style.backgroundColor = "lightyellow"; // Cambia el color de fondo a gris claro
        subFila.classList.add("subfila"); // Agregar clase "subfila" para identificar las subfilas
        subFila.setAttribute('data-fila-principal', incidenciaRbt.idIncidencia.split("R")[0]); // Añadir el id de la fila principal como atributo de datos
        subFila.setAttribute('id', incidenciaRbt.idIncidencia); // Agregar el ID con el valor de idIncidencia
        subFila.innerHTML = `
            <td style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100px;">${incidenciaRbt.idIncidencia}</td>
            <td style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100px;">${incidenciaRbt.titulo}</td>
            <td style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px;">${incidenciaRbt.fechaCreacion.split('T')[0]}</td>
            <td style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px;">
                <span class="btn btn-sm btn-${incidenciaRbt.prioridad === 'alta' ? 'danger' : incidenciaRbt.prioridad === 'media' ? 'warning' : 'secondary'}">${incidenciaRbt.prioridad.charAt(0).toUpperCase() + incidenciaRbt.prioridad.slice(1)}</span>
            </td>
            <td style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px;">
                <span class="btn btn-sm btn-${incidenciaRbt.estado === 'terminado' ? 'success' : incidenciaRbt.estado === 'tramite' ? 'primary' : 'warning'}">${cambiarValoresEstado(incidenciaRbt.estado)}</span>
            </td>
            <td style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 300px;">
                <button type="button" class="btn btn-sm btn-primary btn-mostrar-detalles" data-id="${incidenciaRbt.idIncidencia}" title="Ver detalles">Detalles</button>
                <button onclick="cargarEditarIncidencia('${encodeURIComponent(JSON.stringify(incidenciaRbt))}', '${token}')" type="button" class="btn btn-sm btn-warning" id="btn_edit_incidencia_${incidenciaRbt.idIncidencia}">Editar</button>
            </td>
        `;

        // Agregar la subfila a la lista de subfilas de la incidencia principal
        incidenciaRbt.subfilas.push(subFila);
        subfilas.push(subFila);
        // Agregar evento al botón "Detalles"
        const btnMostrarDetalles = subFila.querySelector('.btn-mostrar-detalles');
        btnMostrarDetalles.addEventListener('click', async function () {
            // Obtener el ID de la incidencia desde el atributo data-id
            const idIncidenciaRbt = this.getAttribute('data-id').toString();
            // Encontrar el objeto de incidencia correspondiente
            const objetoIncidenciaRbt = incidenciasReabiertas.find(incidenciaRbt => incidenciaRbt.idIncidencia.toString() === idIncidenciaRbt);

            pagDetallesIncidencia.mostrarDetallesIncidencia(objetoIncidenciaRbt, token);
        });
    }
    /*
       tabla.querySelectorAll('.btn-mostrar-detalles').forEach(btnMostrarDetalles => {
           btnMostrarDetalles.addEventListener('click', async function () {
    
               // Obtener el ID de la incidencia desde el atributo data-id
               const idIncidenciaRbt = this.getAttribute('data-id').toString();
               // Encontrar el objeto de incidencia correspondiente
               const objetoIncidenciaRbt = incidenciasReabiertas.find(incidenciaRbt => incidenciaRbt.idIncidencia.toString() === idIncidenciaRbt);
    
               pagDetallesIncidencia.mostrarDetallesIncidencia(objetoIncidenciaRbt, token);
    
           });
       });
    */

    console.warn("fila principal", filaPrincipal);
    // Insertar las subfilas justo debajo de la fila principal
    subfilas.forEach(subfila => {
        filaPrincipal.insertAdjacentElement('afterend', subfila);
    });

    return subfilas;
}


async function borrarSubFilas(idFilaPrincipal) {
    // Obtener las subfilas asociadas con el mismo id de la fila principal

    const subfilas = document.querySelectorAll(`[data-fila-principal="${idFilaPrincipal}"]`);

    // Verificar si hay subfilas
    if (subfilas && subfilas.length > 0) {
        // Eliminar cada subfila
        subfilas.forEach(subfila => {
            subfila.remove();
        });

        //console.log('Subfilas eliminadas correctamente.');
    } else {
        //console.log('No se encontraron subfilas asociadas con la fila principal.');
    }
}


function limpiarTabla() {
    var filas = document.querySelectorAll('#tablaListadoIncidencias tbody tr');
    filas.forEach(function (fila) {
        fila.style.display = ''; // Mostrar todas las filas
    });
}

