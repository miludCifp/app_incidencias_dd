import * as manejadorToken from '../manejador_token.js';
import * as verIncidencias from './ver_incidencias.js';

function obtenerToken() {
    return manejadorToken.getToken();
}

function obtenerIDUser(token) {
    return manejadorToken.getIdFromToken(token);
}

let incidenciasObtenidas = null; // Variable para almacenar las incidencias

// Función para hacer la petición GET para Obtener todas las incidencias desde la BD
export async function obtenerIncidencias() {
    const token = await obtenerToken();

    if (!incidenciasObtenidas) {
        try {
            const response = await fetch('http://localhost:8080/api/v1/incidencias/cliente/'+obtenerIDUser(token), {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener las incidencias');
            }

            const data = await response.json();

            console.log("Datos de incidencias recibidos:", data); // Añade este console.log para ver los datos recibidos

            return incidenciasObtenidas = data;  // Guarda las incidencias obtenidas para futuros usos
        } catch (error) {
            console.error(error);
        }
    }
    return incidenciasObtenidas;

}

// Función para filtrar y contar todas las incidencias
async function contarTodasIncidencias(incidencias) {
    const cantidadIncidencias = incidencias.length;

    console.log("Cantidad de incidencias terminadas:", cantidadIncidencias);

    return cantidadIncidencias;
}

// Función para filtrar y contar las incidencias que tengan estado diferente a "Terminado"
async function filtrarYcontarIncidNoResueltas(incidencias) {
    //const incidencias = await obtenerIncidencias(); // Asegura que obtenemos las incidencias antes de filtrar

    // Filtrar y contar las incidencias con estado "Terminado"
    const incidenciasNoTerminadas = incidencias.filter(incidencia => incidencia.estado.toLowerCase() !== 'terminado');
    const cantidadNoTerminadas = incidenciasNoTerminadas.length;

    console.log("Cantidad de incidencias No terminadas:", cantidadNoTerminadas);

    return {
        incidenciasNoTerminadas,
        cantidadNoTerminadas
    };  // Retorna la lista de incidencias y la cantidad de incidencias terminadas
}

// Función para filtrar y contar las incidencias con estado "Terminado"
async function filtrarYcontarIncidResueltas(incidencias) {
    //const incidencias = await obtenerIncidencias(); // Asegura que obtenemos las incidencias antes de filtrar

    // Filtrar y contar las incidencias con estado "Terminado"
    const incidenciasTerminadas = incidencias.filter(incidencia => incidencia.estado.toLowerCase() === 'terminado');
    const cantidadTerminadas = incidenciasTerminadas.length;

    console.log("Cantidad de incidencias terminadas:", cantidadTerminadas);

    return {
        incidenciasTerminadas,
        cantidadTerminadas
    };  // Retorna la lista de incidencias y la cantidad de incidencias terminadas
}


document.addEventListener("DOMContentLoaded", async function () {
    // Obtenemos las incidencias por primera vez
    const incidencias = await obtenerIncidencias();

    // Contamos todas las incidencias
    const todasIncidencias = await contarTodasIncidencias(incidencias);
    //var numTodasIncidencias = todasIncidencias.cantidadIncidencias;
    console.log("Numero de todas las incidencias ----->"+todasIncidencias);

    // Actualiza el html
    document.querySelector("#numTodasIncidencias strong").textContent = todasIncidencias || "?";

    // Contamos las incidencias No Resueltas
    const incidenciasNoResueltas = await filtrarYcontarIncidNoResueltas(incidencias);
    var numNoResueltas = incidenciasNoResueltas.cantidadNoTerminadas;
    console.log("Numero de No Termiandas es ----->"+numNoResueltas);

    // Actualiza el html
    document.querySelector("#numNoResueltas strong").textContent = numNoResueltas || "?";

    // Contamos las incidencias Resueltas
    const incidenciasResueltas = await filtrarYcontarIncidResueltas(incidencias);
    var numResueltas = incidenciasResueltas.cantidadTerminadas;
    console.log("Numero de Termiandas es ----->"+numResueltas);

    // Actualiza el contenido del elemento <strong> dentro del <span> con id "numResueltas"
    document.querySelector("#numResueltas strong").textContent = numResueltas || "?";

    // ***************** Boton Todas las incidencias **************************** //
    const btnTodasIncidencias = document.getElementById('btnTodasIncidencias');
    btnTodasIncidencias.addEventListener('click', async function (event) {
        event.preventDefault();
        // Hacer el filtrado aqui

        console.log("TODAS Las incidencias en el BOTON es --->",incidencias);

        // Guardar las incidencias resueltas en localStorage
        localStorage.setItem('todasIncidencias', JSON.stringify(incidencias));

        // Abrir la nueva página con el parámetro de tipo
        window.location.href = 'ver_incidencias?tipo=todas';
    });

    // ***************** Boton Incidencias No Resueltas **************************** //
    const btnFiltrarNoResueltas = document.getElementById('btnFiltrarNoResueltas');
    btnFiltrarNoResueltas.addEventListener('click', async function (event) {
        event.preventDefault();
        // Hacer el filtrado aqui

        console.log("Se hizo clic en Filtrar Por Incidencias No Resueltas");

        const incidenciasNoTerminadas = incidenciasNoResueltas.incidenciasNoTerminadas;
        console.log("Las incidencias No Terminadas en el BOTON es --->",incidenciasNoTerminadas);

        // Guardar las incidencias resueltas en localStorage
        localStorage.setItem('incidenciasNoResueltas', JSON.stringify(incidenciasNoTerminadas));

        // Abrir la nueva página con el parámetro de tipo
        window.location.href = 'ver_incidencias?tipo=no_resueltas';

    });

    // ***************** Boton Incidencias Resueltas **************************** //
    const btnFiltrarResueltas = document.getElementById('btnFiltrarResueltas');
    btnFiltrarResueltas.addEventListener('click', async function (event) {
        event.preventDefault();

        // Hacer el filtrado aqui
        console.log("Se hizo clic en Filtrar Por Incidencias Resueltas");

        // Guardar las incidencias resueltas en localStorage
        localStorage.setItem('incidenciasResueltas', JSON.stringify(incidenciasResueltas.incidenciasTerminadas));

        // Abrir la nueva página con el parámetro de tipo
        window.location.href = 'ver_incidencias?tipo=resueltas';
    });

});