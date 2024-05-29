import * as manejadorToken from '../manejador_token.js';
import * as formParteTb from './crear_form_parte_trabajo.js';
import * as pagDetallesIncidencia from './ver_detalles_incidencia.js';

function obtenerToken() {
    return manejadorToken.getToken();
}

async function obtenerIncidenciasReabiertas(idIncidencia) {
    const token = await obtenerToken();

    try {
        const response = await fetch('http://185.166.39.117:8080/api/v1/incidencias/incidencias-reabiertas/' + idIncidencia, {
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

export async function obtenerParteTrabajo(idIncidencia) {
    const token = obtenerToken(); // Obtener el token JWT

    const apiUrl = `http://185.166.39.117:8080/api/v1/parte-trabajo/incidencia/${idIncidencia}`; // Ruta para obtener el detalle de parteTrabajo

    const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    console.log('Formato de respuesta de Obtener partes --->', response);

    if (response.ok) {
        // Verificar si la respuesta está vacía
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const parteTrabajo = await response.json();
            console.log('Respuesta de obtenerParteTrabajo:', parteTrabajo);

            if (parteTrabajo || Object.keys(parteTrabajo).length !== 0) {
                return parteTrabajo;
            } else {
                return null; // Devolver null si el cuerpo está vacío
            }
        } else {
            //throw new Error('La respuesta no está en formato JSON.');
            return null;
        }
    } else {
        console.error('Error en la petición obtenerParteTrabajo:', response.status);
        throw new Error('Error al obtener los detalles de parteTrabajo. Por favor, inténtalo de nuevo más tarde.');
    }
}

const mapaIncidencias = {};
const mapaFilaPrincipal = {};

async function cargarIncidenciasEnTabla(incidencias) {
    // Obtener la tabla donde se cargarán los usuarios
    const tabla = document.getElementById('datatablesSimple');

    // obtengo el token 
    const token = await obtenerToken();

    //let incidencias = await obtenerIncidencias();

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

    // Declara la variable para obtener el parte de trabajo relacionado con cada incidencia
    let objetoParteTrabajo;

    let filaPrincipal;

    // Construir las filas de la tabla con un bucle for
    for (let i = 0; i < incidencias.length; i++) {
        const incidencia = incidencias[i];

        // Verificar si el parte de trabajo ha sido creado o no     
        objetoParteTrabajo = await obtenerParteTrabajo(incidencia.idIncidencia);
        let esTerminado = false;

        if (objetoParteTrabajo === null) {
            esTerminado = true;
        } else {
            esTerminado = objetoParteTrabajo.terminado;
        }

        incidenciasReabiertas = null;
        // Obtenemos las incidencais reabiertas de la cada incidencia
        incidenciasReabiertas = await obtenerIncidenciasReabiertas(incidencia.idIncidencia);

        // Verificar si ya existe una entrada para esta incidencia en el mapa
        if (mapaIncidencias[incidencia.idIncidencia]) {
            // Si ya existe, agregar las incidencias reabiertas a la lista existente
            mapaIncidencias[incidencia.idIncidencia].push(...incidenciasReabiertas);
        } else {
            // Si no existe, crear una nueva entrada en el mapa con la lista de incidencias reabiertas
            mapaIncidencias[incidencia.idIncidencia] = incidenciasReabiertas;
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
            <button type="button" class="btn btn-sm btn-danger btn-eliminar" data-id="${incidencia.idIncidencia}">Eliminar</button>
            <button type="button" class="btn btn-sm btn-info btn-parte-tb" data-id="${incidencia.idIncidencia}" title="Crear parte de trabajo" ${esTerminado ? 'disabled' : ''}>Trabajar</button>
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

    tabla.querySelectorAll('.btn-mostrar-detalles').forEach(btnMostrarDetalles => {
        btnMostrarDetalles.addEventListener('click', async function () {

            // Obtener el ID de la incidencia desde el atributo data-id
            const idIncidencia = this.getAttribute('data-id').toString();
            // Encontrar el objeto de incidencia correspondiente
            const objetoIncidencia = incidencias.find(incidencia => incidencia.idIncidencia.toString() === idIncidencia);

            pagDetallesIncidencia.mostrarDetallesIncidencia(objetoIncidencia, token);

        });
    });

    //onclick="eliminarIncidencia(this,'${encodeURIComponent(JSON.stringify(incidencia))}', '${token}')"
    tabla.querySelectorAll('.btn-eliminar').forEach(btnEliminar => {
        btnEliminar.addEventListener('click', async function () {

            // Obtener el ID de la incidencia desde el atributo data-id
            const idIncidencia = this.getAttribute('data-id').toString();
            // Encontrar el objeto de incidencia correspondiente
            const objetoIncidencia = incidencias.find(incidencia => incidencia.idIncidencia.toString() === idIncidencia);

            pagDetallesIncidencia.eliminarIncidencia(this, objetoIncidencia, token);

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

    /*document.addEventListener('click', async function(event) {
        if (event.target.classList.contains('btn-incid-reabiertas')) {
    
            const boton = event.target;
            const idIncidenciaPrincipal = boton.getAttribute('data-id').toString();
            await verOrOcultarSubFilas(boton, filaPrincipal, token, idIncidenciaPrincipal);
        }
    });*/


    // Asignar evento click a los botones "Crear parte de trabajo"
    tabla.querySelectorAll('.btn-parte-tb').forEach(botonCrearParteTb => {
        botonCrearParteTb.addEventListener('click', function () {

            // Obtener el ID del usuario desde el atributo data-id
            const idIncidencia = this.getAttribute('data-id').toString();


            // Encontrar el objeto de incidencia correspondiente
            const objetoIncidencia = incidencias.find(incidencia => incidencia.idIncidencia.toString() === idIncidencia);


            //var parteTbJSON = objetoParteTrabajo;

            // Obtenemos la pagina actual
            var pagActual = document.getElementById("tablaListadoIncidencias");

            // Llamar a la función crearFormParteTb
            //formParteTb.crearFormParteTb(objetoIncidencia, parteTbJSON, pagActual, token);

            formParteTb.crearFormParteTb(objetoIncidencia, pagActual, token);

        });
    });
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
            cargarIncidenciasEnTabla(incidenciasResueltas);
        } else {
            console.error('No se encontraron incidencias resueltas en localStorage');
        }
    } else if (tipo === 'no_resueltas') {
        const incidenciasNoResueltas = JSON.parse(localStorage.getItem('incidenciasNoResueltas'));
        if (incidenciasNoResueltas) {
            console.log("Incidencias No Resueltas recibidas desde la pag_inicio es --->:", incidenciasNoResueltas);
            cargarIncidenciasEnTabla(incidenciasNoResueltas);
        } else {
            console.error('No se encontraron incidencias no resueltas en localStorage');
        }
    } else if (tipo === 'todas') {
        const todasIncidencias = JSON.parse(localStorage.getItem('todasIncidencias'));
        if (todasIncidencias) {
            console.log("TODAS Incidencias recibidas desde la pag_inicio es --->:", todasIncidencias);
            // Aquí puedes llamar a tu función para cargar las incidencias en la tabla
            cargarIncidenciasEnTabla(todasIncidencias);
        } else {
            console.error('No se encontraron TODAS incidencias en localStorage');
        }
    } else {
        // ***************** Obtenemos todas las incidencias ****************** //
        const pagInicio = await import('./pag_inicio.js');
        let incidencias = await pagInicio.obtenerIncidencias();
        cargarIncidenciasEnTabla(incidencias);
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

        // Verificar si el parte de trabajo ha sido creado o no     
        const objetoParteTrabajo = await obtenerParteTrabajo(incidenciaRbt.idIncidencia);
        let esTerminado = false;

        if (objetoParteTrabajo === null) {
            esTerminado = true;
        } else {
            esTerminado = objetoParteTrabajo.terminado;
        }

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
                <button type="button" class="btn btn-sm btn-danger btn-delete-incidencia" data-id="${incidenciaRbt.idIncidencia}">Eliminar</button>
                <button type="button" class="btn btn-sm btn-info btn-parte-tb" data-id="${incidenciaRbt.idIncidencia}" title="Crear parte de trabajo" ${esTerminado ? 'disabled' : ''}>Trabajar</button>
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

        // Agregar evento al botón "Eliminar"
        const btnEliminarIncidencia = subFila.querySelector('.btn-delete-incidencia');
        btnEliminarIncidencia.addEventListener('click', function () {
            // Obtener el ID de la incidencia desde el atributo data-id
            const idIncidenciaRbt = this.getAttribute('data-id').toString();
            // Encontrar el objeto de incidencia correspondiente
            const objetoIncidenciaRbt = incidenciasReabiertas.find(incidenciaRbt => incidenciaRbt.idIncidencia.toString() === idIncidenciaRbt);
            pagDetallesIncidencia.eliminarIncidencia(this, objetoIncidenciaRbt, token);
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







/************************** Cambios Kevin ***********************************/



export async function comprobarTiempoEmpleadoSinHoraFin(idOrden) {
    const response = await fetch(`http://185.166.39.117:8080/api/v1/tiempo-empleado/parte-trabajo-no-terminado/${idOrden}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + obtenerToken()
        }
    });

    if (response.status === 200) {
        const tiempoEmpleado = await response.json();
        if (tiempoEmpleado && Object.keys(tiempoEmpleado).length !== 0) {
            return tiempoEmpleado; // Devuelve el objeto TiempoEmpleado si lo hay
        } else {
            return true; // Devuelve un objeto vacío si no hay TiempoEmpleado sin horaFin
        }
    } else {
        throw new Error('Error al comprobar el TiempoEmpleado sin horaFin');
    }
}

export async function comprobarTrabajoNoTerminado(idIncidencia) {
    const token = obtenerToken(); // Obtener el token JWT
    //const idTecnico = manejadorToken.getIdFromToken(token); // Pasar el token a la función

    const response = await fetch(`http://185.166.39.117:8080/api/v1/parte-trabajo/incidencia-no-terminada/${idIncidencia}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token // Usar el token obtenido
        }
    });

    const parteTrabajo = await response.json();
    console.log("peticion en comprobarTrabajoNoTerminado(): ", parteTrabajo);

    if (parteTrabajo === null || parteTrabajo.length === 0) {
        console.log("no hay trabajo empezado");
        return true; // No hay trabajo no terminado
    }

    // Si parteTrabajo es un objeto y tiene la propiedad "terminado" y es 1 (true)
    if (typeof parteTrabajo === 'object' && parteTrabajo.hasOwnProperty('terminado') && parteTrabajo.terminado === 1) {
        console.log("El trabajo está terminado");
        return true;
    }

    // Guardar parteTrabajo para usarlo en el resto del código
    return parteTrabajo;
}

export async function empezarTrabajo() {
    // Conrolamos el boton Empezar trabajo por el modo de resolucion
    const selectModoResolucion = document.getElementById('selectModoResolucion');
    const modoResolucionSeleccionado = selectModoResolucion.options[selectModoResolucion.selectedIndex].value;


    if (modoResolucionSeleccionado === 'sinModoResolucion') {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Debe seleccionar un modo de resolución antes de empezar el trabajo`,
        });
    } else {
        const apiUrlEmpezarTrabajo = 'http://185.166.39.117:8080/api/v1/parte-trabajo'; // Ruta para empezar el trabajo
        const apiUrlRegistrarTiempo = 'http://185.166.39.117:8080/api/v1/tiempo-empleado'; // Ruta para registrar el tiempo empleado
        const token = obtenerToken(); // Reemplaza con tu token JWT
        const idTecnico = manejadorToken.getIdFromToken(token); // Llamar a getIdFromToken sin argumento
        const idIncidencia = document.getElementById('idIncidencia').innerText;

        // Verificar si el parteTrabajo ya está creado
        const parteTrabajoNoTermninado = await comprobarTrabajoNoTerminado(idIncidencia);
        console.log("terminado: ", parteTrabajoNoTermninado);

        let response;
        var parteCreado = false;

        if (parteTrabajoNoTermninado == true) {
            // Datos para la primera petición
            const dataEmpezarTrabajo = {
                trabajoRealizado: null,
                diagnostico: null,
                observaciones: null,
                costeReparacion: null,
                parteTrabajoImg: null,
                terminado: false,
                idIncidencia: idIncidencia,
                idTecnico: idTecnico // Usar idTecnico obtenido del token
            };

            // Primera petición para empezar el trabajo
            response = await fetch(apiUrlEmpezarTrabajo, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dataEmpezarTrabajo)
            });

            if (!response.ok) {
                console.error(`Error en la petición empezarTrabajo: ${response.status}`);
                //return;
            }
            parteCreado = true;
            const datosParteTrabajo = await response.json();
            console.log('Respuesta de empezarTrabajo:', datosParteTrabajo);
        }

        // Segunda petición para registrar el tiempo empleado        
        const parteTrabajo = await obtenerParteTrabajo(idIncidencia);
        console.log("El objeto parte fuera del if es ", parteTrabajo);
        const idOrden = parteTrabajo.idOrden; // Corregido aquí

        const hayTiempoSinHora = await comprobarTiempoEmpleadoSinHoraFin(idOrden);
        console.log("hayTiempoSinHoraaaaaaa: ", hayTiempoSinHora);
        console.log("EstaParteCreado: ", parteCreado);

        const ahora = new Date();
        const horaEntrada = `${ahora.getHours().toString().padStart(2, '0')}:${ahora.getMinutes().toString().padStart(2, '0')}:${ahora.getSeconds().toString().padStart(2, '0')}`;


        // Datos para la segunda petición
        const dataRegistrarTiempo = {
            fecha: new Date().toISOString().split('T')[0],
            idOrdenParteTb: idOrden, // Corregido aquí
            horaEntrada: horaEntrada,
            horaSalida: null,
            motivoPausa: null,
            modoResolucion: document.getElementById('selectModoResolucion').value
        };

        if (hayTiempoSinHora == true || parteCreado) { // Corregido aquí

            const responseRegistrarTiempo = await fetch(apiUrlRegistrarTiempo, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dataRegistrarTiempo)
            });

            if (responseRegistrarTiempo.ok) {
                const responseDataRegistrarTiempo = await responseRegistrarTiempo.json();
                Swal.fire({
                    icon: 'success',
                    title: '¡Hora registrada!',
                    text: 'Ya puedes comenzar el trabajo',
                    willClose: async function () {


                        const btnEmpezar = document.getElementById('btnEmpezarTrabajo');
                        // Desactivamos el boton Empezar trabajo
                        btnEmpezar.disabled = true;

                        console.log('objeto parteTrabajo dentro de WilClose es ', parteTrabajo);

                        // Tercera perticion para cambiar el estado al Empezar trabajo
                        await cambiarEstadoEmpezarTb(parteTrabajo.incidencia, token);

                        // Recargar la página actual
                        //location.reload();

                        // redirigir al form Crear parte de trabajo

                        // Obtenemos la pagina actual
                        var pagActual = document.getElementById("detallesIncidencia");

                        // Llamar a la función crearFormParteTb
                        formParteTb.crearFormParteTb(parteTrabajo.incidencia, pagActual, token);

                    }
                });
            } else {
                console.error('Error en la petición registrarTiempo:', responseRegistrarTiempo.status);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `Ya tienes el trabajo iniciado`,
                });
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Ya has empezado el trabajo`,
            });
        }


    }



}

async function cambiarEstadoEmpezarTb(objetoIncidencia, token) {

    console.log('Este es el objeto incidencia ', objetoIncidencia);

    objetoIncidencia.estado = 'tramite';

    var urlPut = 'http://185.166.39.117:8080/api/v1/incidencias/' + objetoIncidencia.idIncidencia;

    // Realizar la solicitud PUT al servidor
    try {
        const response = await fetch(urlPut, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(objetoIncidencia)
        });

        if (response.ok) {
            console.log('estado cambiado a En tramite');
            // Aquí podrías recargar la tabla u otras acciones necesarias después de la actualización
            //location.reload();  // Recargar la página
        } else {
            throw new Error('Error al actualizar la incidencia');
        }
    } catch (error) {
        console.error('Error al actualizar la incidencia:', error);
    }
}


export async function finTrabajo(objetoIncidencia) {
    console.log("Estan finalizando el trabajo");
    try {

        //const idIncidenciaElement = document.getElementById('idIncidencia');
        //const idIncidencia = idIncidenciaElement ? idIncidenciaElement.innerText : null;

        if (!objetoIncidencia.idIncidencia) {
            console.error('El ID de la incidencia es undefined o null');
            return;
        }

        const parteTrabajo = await obtenerParteTrabajo(objetoIncidencia.idIncidencia);
        const idOrden = parteTrabajo.idOrden;

        console.log("idIncidencia = " + objetoIncidencia.idIncidencia);
        console.log("parteTrabajo = ", parteTrabajo);
        console.log("idOrden = " + idOrden);

        const tiempoEmpleado = await comprobarTiempoEmpleadoSinHoraFin(idOrden); // Asegúrate de que datosParteTrabajo esté definida
        const idTiempoEmpleado = tiempoEmpleado[0].idTiempoEmpleado;

        console.log("tiempoEmpleado = ", tiempoEmpleado[0]);
        console.log("idTiempoEmpleado = " + idTiempoEmpleado);

        if (typeof tiempoEmpleado === 'object' && tiempoEmpleado !== null) {

            console.log("estoy dentro");
            const ahora = new Date();
            const horaSalida = `${ahora.getHours().toString().padStart(2, '0')}:${ahora.getMinutes().toString().padStart(2, '0')}:${ahora.getSeconds().toString().padStart(2, '0')}`;

            let tiempoEmpleadoNuevo = {
                idTiempoEmpleado: tiempoEmpleado[0].idTiempoEmpleado,
                fecha: tiempoEmpleado[0].fecha,
                idOrdenParteTb: idOrden, //tiempoEmpleado[0].parteTrabajo.idOrden,
                horaEntrada: tiempoEmpleado[0].horaEntrada,
                horaSalida: horaSalida,
                motivoPausa: tiempoEmpleado[0].motivoPausa,
                modoResolucion: tiempoEmpleado[0].modoResolucion
            };
            // tiempoEmpleado.horaSalida = new Date().toLocaleTimeString('es-ES', { hour12: false }); // Formato HH:MM:SS


            const respuesta = await fetch(`http://185.166.39.117:8080/api/v1/tiempo-empleado/${idTiempoEmpleado}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${obtenerToken()}`
                },

                body: JSON.stringify(tiempoEmpleadoNuevo)
            });

            if (respuesta.ok) {
                const responseDataRegistrarTiempo = await respuesta.json();
                // console.log('Respuesta de finTrabajo:', responseDataRegistrarTiempo);
                Swal.fire({
                    icon: 'success',
                    title: '¡Hora registrada!',
                    text: 'Trabajo terminado con exito',
                });

            } else {
                console.error('Error en la petición finTrabajo:', respuesta.status);
            }

            // Peticion para cambiar el estado de la incidencia a TERMINADO
            console.error('El ID incidencia para cambiar el estado es --->:', objetoIncidencia.idIncidencia);
            //Cambiamos el estado
            objetoIncidencia.estado = 'terminado';

            const respuestaIncidencia = await fetch(`http://185.166.39.117:8080/api/v1/incidencias/${objetoIncidencia.idIncidencia}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${obtenerToken()}`
                },

                body: JSON.stringify(objetoIncidencia)
            });

            if (respuestaIncidencia.ok) {
                const responseDataIncidencia = await respuesta.json();
                console.log('------> Respuesta de Estado Cambiado finTrabajo:', responseDataIncidencia);

            } else {
                console.error('Error en la petición al cambiar el estado incidencia Fin Trabajo:', respuestaIncidencia.status);
            }
        } else {
            console.log('No hay tiempoEmpleado sin horaFin');
        }
    } catch (error) {
        //console.error('Error general:', error);
        /*
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `No has empezado el trabajo`,
        });
        */
    }
}


document.addEventListener('DOMContentLoaded', () => {
    const btnEmpezar = document.getElementById('btnEmpezarTrabajo');

    console.log("El boton Empezar Trabajo es ====> " + btnEmpezar);

    btnEmpezar.addEventListener('click', empezarTrabajo);


});


function limpiarTabla() {
    var filas = document.querySelectorAll('#tablaListadoIncidencias tbody tr');
    filas.forEach(function (fila) {
        fila.style.display = ''; // Mostrar todas las filas
    });
}

