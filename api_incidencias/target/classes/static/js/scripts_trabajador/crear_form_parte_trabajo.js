
import { comprobarTiempoEmpleadoSinHoraFin, finTrabajo, obtenerParteTrabajo } from './ver_incidencias.js';
import * as manejadorToken from '../manejador_token.js';

// Declaramos la variable global del objeto Parte trabajo y lo enviamos para que este disponible en otros scripts.
let objetoParteTrabajoGlobal;
let listaMaterialesAgregados = [];
let idIncidenciaGlobal;

function obtenerToken() {
    return manejadorToken.getToken();
}

function validarCamposFormParteTb(diagnostico, tbRealizado, observaciones) {

    var msgErrorDiagnostico = document.getElementById("msgErrorDiagnostico");
    var msgErrorTbRealizado = document.getElementById("msgErrorTbRealizado");

    // Ocultamos los mensajes de error si estaban visibles
    msgErrorDiagnostico.style.display = "none";
    msgErrorTbRealizado.style.display = "none";


    if (diagnostico === '') {
        msgErrorDiagnostico.style.display = "block";
        msgErrorDiagnostico.textContent = 'El campo Diagnostico es obligatorio';
        return false;

    } else if (tbRealizado === '') {
        msgErrorTbRealizado.style.display = "block";
        msgErrorTbRealizado.textContent = 'El campo Trabajo realizado es obligatorio';
        return false;
    }

    return true;

}

export async function crearFormParteTb(objetoIncidencia, pagActual, token) {
    console.log("El objeto incidencia que ha entrado desde la FILA es ========> ", objetoIncidencia);

    idIncidenciaGlobal = objetoIncidencia.idIncidencia;

    console.log("El ID incidencia que ha entrado desde la FILA es ========> "+  idIncidenciaGlobal);

    // Obtenemos el elemento subtitulo de la pagina Ver partes de trabajo por su id
    var subTituloElemento = document.getElementById("subtitle-ver-incidencias");

    // Sobreescribemos el texto del elemento
    subTituloElemento.textContent = "Crear parte de trabajo";

    document.getElementById("btnNuevaIncidencia").style.display = "none";

    // Ocultamos la pagina actual
    pagActual.style.display = "none";

    // Mostramos el formulario de crear parte de trabajo
    document.getElementById("crearParteTbForm").style.display = "block";


    document.getElementById("idIncidenciaParteTb").value = idIncidenciaGlobal;


    try {
        // Obtengo el objeto parte de trabajo desde el servidor mediante una peticion GET
        objetoParteTrabajoGlobal = await obtenerParteTrabajo(idIncidenciaGlobal);

        if (objetoParteTrabajoGlobal != null) {
            // Obtengo el objeto incidencia para acceder al motivo
            var motivoIncidencia = objetoParteTrabajoGlobal.incidencia.descripcion;

            console.log('Descripción del motivo: ' + motivoIncidencia);

            // Cargo el motivo en el campo motivo 
            document.getElementById("motivo").value = motivoIncidencia;
        } else {
            console.error('El objeto Parte de trabajo está vacío o no tiene el formato esperado.');
        }

    } catch (error) {
        console.error('Error al obtener el objeto Parte de trabajo:', error);
        // Aquí podrías mostrar un mensaje de error al usuario si lo deseas
    }




    //********************** Verificamos los botones Pausar y Continuar ***************/

    (async () => {
        const continuar = await continuarOPausar(objetoParteTrabajoGlobal);
        if (continuar) {
            console.log("----> Respuesta del true ---> ");
            // Borramos Boton Pausar y mostrarmos boton Continuar
            var btnPausar = document.getElementById("btnPausaTrabajo");
            if (btnPausar !== null) {
                btnPausar.remove();
            }

            //************************************  Creamos el ComboBox Modo Resolucion ********************************/

            // Crear el elemento label
            const labelModoResolucion = document.createElement("label");
            labelModoResolucion.id = "labelModResol";
            labelModoResolucion.setAttribute("for", "modoResolucion");
            labelModoResolucion.className = "form-label";
            labelModoResolucion.textContent = "Modo de resolución";

            // Crear el elemento select
            const selectModoResolucion = document.createElement("select");
            selectModoResolucion.id = "selectModoResolucionFormParteTb";

            // Crear la opción "Sin seleccionar"
            const optionSinSeleccionar = document.createElement("option");
            optionSinSeleccionar.value = "sinModoResolucion";
            optionSinSeleccionar.textContent = "Sin seleccionar";

            // Agregar la opción "Sin seleccionar" al select
            selectModoResolucion.appendChild(optionSinSeleccionar);

            // Definir las opciones restantes
            const opcionesModoResolucion = [
                { value: "remota", text: "Remota" },
                { value: "presencial", text: "Presencial" },
                { value: "telefonica", text: "Telefónica" }
            ];

            // Crear y agregar las opciones al select
            opcionesModoResolucion.forEach(opcion => {
                const optionElement = document.createElement("option");
                optionElement.value = opcion.value;
                optionElement.textContent = opcion.text;
                selectModoResolucion.appendChild(optionElement);
            });

            // Obtener el contenedor donde se insertará el label y el select
            const contenedor = document.getElementById("modoResolucionIncidenciaFormParteTb");
            const contenedorLabel = document.getElementById("contenedorLabelModResol");

            // Limpiar cualquier contenido previo del contenedor
            //contenedor.innerHTML = "";

            // Agregamos el label y el select al contenedor correspondiente
            if (contenedor != null) {
                contenedorLabel.appendChild(labelModoResolucion);
                contenedor.appendChild(selectModoResolucion);
            }


            //************************************  Creamos el boton Continuar Trabajo ********************************/
            // Seleccionar el contenedor donde se va a añadir el botón
            var contenedorBtnsFormParteTb = document.getElementById("containerBtnsIzqFormParteTb");

            // Crear un nuevo botón
            var btnContinuarTrabajo = document.createElement("button");

            // Configurar el botón
            btnContinuarTrabajo.innerHTML = "Continuar trabajo";
            btnContinuarTrabajo.className = "btn btn-info"; // Añadir clases de Bootstrap si es necesario
            btnContinuarTrabajo.id = "btnContinuarTrabajo";
            btnContinuarTrabajo.type = "button";

            btnContinuarTrabajo.onclick = async function () {
                continuarTrabajo(objetoParteTrabajoGlobal);
            };


            // Añadir el botón al contenedor
            contenedorBtnsFormParteTb.appendChild(btnContinuarTrabajo);
        } else {
            console.log("Respuesta del false ---> ");
            // Borramos Boton Continuar y mostrarmos boton Pausar
            var btnContinuar = document.getElementById("btnContinuarTrabajo");

            if (btnContinuar !== null) {
                btnContinuar.remove();
            }

            // Borramos el Label y ComboBox
            var labelModoResol = document.getElementById("labelModResol");
            var comboBoxModoResol = document.getElementById("selectModoResolucionFormParteTb");
            if (labelModoResol !=null) {
                labelModoResol.remove();
            }
            if (comboBoxModoResol !=null) {
                comboBoxModoResol.remove();
            }

            //************************************  Creamos el Boton Pausar Trabajo ********************************/
            // Seleccionar el contenedor donde se va a añadir el botón
            var contenedorBtnsFormParteTb = document.getElementById("containerBtnsIzqFormParteTb");

            // Crear un nuevo botón
            var btnPausarTrabajo = document.createElement("button");

            // Configurar el botón
            btnPausarTrabajo.innerHTML = "Pausar trabajo";
            btnPausarTrabajo.className = "btn btn-dark"; // Añadir clases de Bootstrap si es necesario
            btnPausarTrabajo.id = "btnPausaTrabajo";
            btnPausarTrabajo.type = "button";

            btnPausarTrabajo.onclick = async function () {
                pausarTrabajo(idIncidenciaGlobal, objetoParteTrabajoGlobal);
            };


            // Añadir el botón al contenedor
            contenedorBtnsFormParteTb.appendChild(btnPausarTrabajo);
        }
    })();


    // llamo al metodo crearParte trabajo
    await crearParteTrabajo(objetoIncidencia, objetoParteTrabajoGlobal, token);

}


/*
export async function crearFormParteTb(idIncidencia, objetoParteTb, pagActual, token) {

    idIncidenciaGlobal = idIncidencia;

    console.log("El ID incidencia que ha entrado desde la FILA es ========> ", idIncidencia);

    // Obtenemos el elemento subtitulo de la pagina Ver partes de trabajo por su id
    var subTituloElemento = document.getElementById("subtitle-ver-incidencias");

    // Sobreescribemos el texto del elemento
    subTituloElemento.textContent = "Crear parte de trabajo";

    // Ocultamos la pagina actual
    pagActual.style.display = "none";

    // Mostramos el formulario de crear parte de trabajo
    document.getElementById("crearParteTbForm").style.display = "block";


    // Obtengo el objeto parte de trabajo desde el servidor mediante una peticion GET
    objetoParteTrabajoGlobal = objetoParteTb;

    console.log('Objeto PArte recibido ---->', objetoParteTrabajoGlobal);

    // Obtengo el objeto incidencia para acceder al motivo
    //var motivoIncidencia = objetoParteTrabajoGlobal.incidencia.descripcion;

    var motivoIncidencia = objetoParteTb.incidencia.descripcion;

    console.log('Descripción del motivo: ' + motivoIncidencia);

    // Cargo el motivo en el campo motivo 
    document.getElementById("motivo").value = motivoIncidencia;

    // llamo al metodo crearParte trabajo
    crearParteTrabajo(objetoParteTrabajoGlobal, token);

}
*/

/*
async function crearParteTrabajo(objetoParteTb, token) {

    // El campo Motivo se carga desde el script que crear el formulario 


    // Ahora obtenemos el id de la incidencia del parte de trabajo
    var idIncidencia = objetoParteTb.incidencia.idIncidencia;


    console.log('El idIncidencia sacado del objeto es : ----> ' + idIncidencia);

    // Obtener el token
    console.log('El Token para crear parte de trabajo es : ----> ' + token);

    // Obtengo el el id del usuario tecnico del token
    var idTecnico = manejadorToken.getIdFromToken(token);

    // Recibo el objeto Parte de trabajo desde el script crear_form_parte_trabajo
    var idOrden = objetoParteTrabajoGlobal.idOrden;
    console.log('El idOrden sacado sacado del objeto es : ' + idOrden);


    // Damos accion al boton Agregar Material y Llamamos aqui a la funcion insertarMaterial
    var btnAgregarMaterial = document.getElementById('btnAgregarMaterial');
    // Agregamos un event listener para el evento de clic
    btnAgregarMaterial.addEventListener('click', function () {

        // Cosas del material de trabajo
        var txtNombreMaterial = document.getElementById("material_utilizado").value;
        var txtCantidad = document.getElementById("cantidad_utilizada").value;
        var txtCoste = document.getElementById("costo_material").value;
        // Fin Cosas del material de trabajo

        console.log('Se hizo clic en el botón Agregar Material');

        console.log('txtNombreMaterial -----> ' + txtNombreMaterial);
        console.log('txtCantidad -----> ' + txtCantidad);
        console.log('txtCoste -----> ' + txtCoste);


        // Creamo el objeto Material trabajo
        var unMaterial = {
            nombre: txtNombreMaterial,
            cantidad: txtCantidad,
            coste: txtCoste
        };

        // Lo añadimos al array de los materiales
        listaMaterialesAgregados.push(unMaterial);

        // Mostramos el material agregado en la interfaz 
        mostrarMaterialAgregado(unMaterial);

    });



    // Url para una peticion PUT al servidor
    var urlPut = 'http://localhost:8080/api/v1/parte-trabajo/' + idOrden;

    // Escuchar el evento submit del formulario
    document.getElementById("crearParteTbForm").addEventListener("submit", async function (event) {
        event.preventDefault();

        console.log('La lista de materiales agregados es ---> ' + listaMaterialesAgregados);

        // Recorrer la lista de materiales agregados
        listaMaterialesAgregados.forEach(async function (objetoMaterial) {
            // Llamar a la función insertarMaterial para cada objeto Material
            try {
                await insertarMaterial(objetoMaterial, idOrden, token);
            } catch (error) {
                console.error('Error al insertar el material:', error);
            }
        });



        // Obtenemos los elementos HTML del formulario crear parte trabajo
        //var txtMotivo = document.getElementById("motivo").value;
        var txtDiagnostico = document.getElementById("diagnostico").value;
        var txtTrabajoRealizado = document.getElementById("trabajo_realizado").value;
        var txtObservaciones = document.getElementById("observaciones").value;

        // Construimos el objeto parte de trabajo a mandar al servidor
        const nuevoParteTrabajo = {
            idOrden: idOrden,
            trabajoRealizado: txtTrabajoRealizado,
            diagnostico: txtDiagnostico,
            observaciones: txtObservaciones,
            costeReparacion: null,
            parteTrabajoImg: null,
            terminado: true,
            idIncidencia: idIncidencia,
            idTecnico: idTecnico // Usar idTecnico obtenido del token
        };

        // Realizamos la solicitud PUT al servidor
        try {
            const response = await fetch(urlPut, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(nuevoParteTrabajo)
            });

            if (response.ok) {

                finTrabajo(idIncidencia);

                Swal.fire({
                    icon: 'success',
                    title: '¡Parte de trabajo creado correctamente!',
                    text: 'Puedes consultar el parte de trabajo en "Ver Partes de trabajo"',
                    onClose: function () {
                        // Redirigir a la página ver_partes_trabajo.html
                        window.location.href = 'ver_partes_trabajo.html';
                    }
                });
                // Aquí podrías recargar la tabla u otras acciones necesarias después de la actualización
                //location.reload();  // Recargar la página

                // Desactivamos el boton Crear parte de trabajo
                var btnCrearParteTrabajo = document.getElementById('btn_parte_tb_' + objetoParteTb.incidencia.idIncidencia);
                btnCrearParteTrabajo.disabled = true;


            } else {
                throw new Error('Error al crear el parte de trabajo');
            }
        } catch (error) {
            console.error('Error al crear el parte de trabajo :', error);
            Swal.fire({
                icon: 'error',
                title: 'Error al crear el parte de trabajo.',
                text: `Por favor, inténtelo de nuevo más tarde.`,
            });
        }
    });


}
*/

async function crearParteTrabajo(objetoIncidencia, objetoParteTb, token) {
    // Ahora obtenemos el id de la incidencia del parte de trabajo
    //var idIncidencia = objetoParteTb.incidencia.idIncidencia;
    var idIncidencia = objetoIncidencia.idIncidencia;


    console.log('El idIncidencia sacado del objeto es : ----> ' + idIncidencia);

    // Obtener el token
    console.log('El Token para crear parte de trabajo es : ----> ' + token);

    // Obtengo el el id del usuario tecnico del token
    var idTecnico = manejadorToken.getIdFromToken(token);

    // Recibo el objeto Parte de trabajo desde el script crear_form_parte_trabajo
    var idOrden = objetoParteTrabajoGlobal.idOrden;
    console.log('El idOrden sacado sacado del objeto es : ' + idOrden);


    // Damos accion al boton Agregar Material y Llamamos aqui a la funcion insertarMaterial
    var btnAgregarMaterial = document.getElementById('btnAgregarMaterial');
    // Agregamos un event listener para el evento de clic
    btnAgregarMaterial.addEventListener('click', function () {

        // Cosas del material de trabajo
        var txtNombreMaterial = document.getElementById("material_utilizado").value;
        var txtCantidad = document.getElementById("cantidad_utilizada").value;
        var txtCoste = document.getElementById("costo_material").value;
        // Fin Cosas del material de trabajo

        console.log('Se hizo clic en el botón Agregar Material');

        console.log('txtNombreMaterial -----> ' + txtNombreMaterial);
        console.log('txtCantidad -----> ' + txtCantidad);
        console.log('txtCoste -----> ' + txtCoste);


        // Creamo el objeto Material trabajo
        var unMaterial = {
            nombre: txtNombreMaterial,
            cantidad: txtCantidad,
            coste: txtCoste
        };

        // Lo añadimos al array de los materiales
        listaMaterialesAgregados.push(unMaterial);

        // Mostramos el material agregado en la interfaz 
        mostrarMaterialAgregado(unMaterial);

    });



    // Url para una peticion PUT al servidor
    var urlPut = 'http://localhost:8080/api/v1/parte-trabajo/' + idOrden;


    var btnFinalizarTrabajo = document.getElementById("btnFinalizarTrabajo");
    btnFinalizarTrabajo.addEventListener('click', async function () {
        console.log('Se hizo clic en el botón Finalizar ');
        // Aquí puedes agregar el código que deseas que se ejecute cuando se hace clic en el botón

        console.log('La lista de materiales agregados es ---> ' + listaMaterialesAgregados);

        // Recorrer la lista de materiales agregados
        listaMaterialesAgregados.forEach(async function (objetoMaterial) {
            // Llamar a la función insertarMaterial para cada objeto Material
            try {
                await insertarMaterial(objetoMaterial, idOrden, token);
            } catch (error) {
                console.error('Error al insertar el material:', error);
            }
        });



        // Obtenemos los elementos HTML del formulario crear parte trabajo
        //var txtMotivo = document.getElementById("motivo").value;
        var txtDiagnostico = document.getElementById("diagnostico").value;
        var txtTrabajoRealizado = document.getElementById("trabajo_realizado").value;
        var txtObservaciones = document.getElementById("observaciones").value;

        if (validarCamposFormParteTb(txtDiagnostico, txtTrabajoRealizado, txtObservaciones)) {
            // Construimos el objeto parte de trabajo a mandar al servidor
            const nuevoParteTrabajo = {
                idOrden: idOrden,
                trabajoRealizado: txtTrabajoRealizado,
                diagnostico: txtDiagnostico,
                observaciones: txtObservaciones,
                costeReparacion: null,
                parteTrabajoImg: null,
                terminado: true,
                idIncidencia: idIncidencia,
                idTecnico: idTecnico // Usar idTecnico obtenido del token
            };

            // Realizamos la solicitud PUT al servidor
            try {
                const response = await fetch(urlPut, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(nuevoParteTrabajo)
                });

                if (response.ok) {
                    await finTrabajo(objetoIncidencia);
                    

                    Swal.fire({
                        icon: 'success',
                        title: '¡Parte de trabajo creado correctamente!',
                        text: 'Puedes consultar el parte de trabajo en "Ver Partes de trabajo"',
                        willClose: function () {
                            
                            // Redirigir a la página ver_partes_trabajo.html
                            window.location.href = 'ver_partes_trabajo';
                        }
                    });

                    
                    // Aquí podrías recargar la tabla u otras acciones necesarias después de la actualización
                    //location.reload();  // Recargar la página

                    // Desactivamos el boton Crear parte de trabajo
                    //var btnCrearParteTrabajo = document.getElementById('btn_parte_tb_' + objetoParteTb.incidencia.idIncidencia);
                    //btnCrearParteTrabajo.disabled = true;


                } else {
                    throw new Error('Error al crear el parte de trabajo');
                }
            } catch (error) {
                console.error('Error al crear el parte de trabajo :', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al crear el parte de trabajo.',
                    text: `Por favor, inténtelo de nuevo más tarde.`,
                });
            }
        }


    });



}

// Este metodo muesta los metriales que se agregan debajo del campo corespondiente
function mostrarMaterialAgregado(materialAgregado) {
    var material = document.getElementById('material_utilizado').value;
    var cantidad = document.getElementById('cantidad_utilizada').value;
    var costo = document.getElementById('costo_material').value;

    if (material.trim() !== '' && !isNaN(cantidad) && !isNaN(costo) && cantidad > 0 && costo > 0) { // Verificar si se ingresaron valores válidos

        // Limpiar el mensaje de error si estaba visible
        document.getElementById('error-message').textContent = '';

        var nuevaFilaMaterial = document.createElement('div');
        nuevaFilaMaterial.classList.add('material-row'); // Agregar clase para el estilo

        nuevaFilaMaterial.innerHTML = 'Nombre : ' + material + ' - Cantidad: ' + cantidad + ' - Costo: ' + costo;

        // Crear botón para eliminar el material
        var eliminarBtn = document.createElement('button');
        eliminarBtn.innerHTML = 'Eliminar';
        eliminarBtn.classList.add('btn', 'btn-sm', 'btn-danger', 'eliminar-material-btn');
        eliminarBtn.addEventListener('click', function () {

            // Encontrar el índice del material en la lista
            var indice = listaMaterialesAgregados.indexOf(materialAgregado);

            // Verificar si se encontró el material en la lista
            if (indice !== -1) {
                // Eliminar el material de la lista
                listaMaterialesAgregados.splice(indice, 1);

                // Eliminamos la fila de la interfaz al hacer clic en el botón
                nuevaFilaMaterial.remove();
            }


        });

        nuevaFilaMaterial.appendChild(eliminarBtn); // Agregar botón de eliminar a la fila de material

        document.getElementById('lista_materiales').appendChild(nuevaFilaMaterial);

        // Limpiar los campos del formulario después de agregar el material
        document.getElementById('material_utilizado').value = '';
        document.getElementById('cantidad_utilizada').value = '';
        document.getElementById('costo_material').value = '';
    } else {
        // Mostrar mensaje de error
        document.getElementById('error-message').textContent = 'Por favor, complete todos los campos.';

    }
}

// Esta funcion inserta el meterial del parte de trabajo en la base de datos mediante una petición POST
async function insertarMaterial(objetoMaterialAgregado, idOrden, token) {

    const objetoMaterial = {
        nombre: objetoMaterialAgregado.nombre,
        cantidad: objetoMaterialAgregado.cantidad,
        coste: objetoMaterialAgregado.coste,
        idParteTrabajo: idOrden
    };

    try {

        const respuesta = await fetch('http://localhost:8080/api/v1/material-utilizado', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(objetoMaterial)
        });

        if (!respuesta.ok) {
            throw new Error(`HTTP error! Status: ${respuesta.status}`);
        }

        const data = await respuesta.json();
        console.log('Respuesta del servidor:', data);

        console.error('Materiales agregados correctamente');

    } catch (error) {
        //console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Hubo un error al enviar los datos de los materiales`,
        });
    }
}

function volverListaIncidenciasParteTb() {
    // Ocultamos el formulario de crear parte de trabajo
    document.getElementById("crearParteTbForm").style.display = "none";

    document.getElementById("btnNuevaIncidencia").style.display = "block";

    // Volvemos a mostrar el listado de incidencias
    document.getElementById("tablaListadoIncidencias").style.display = "block";

    // Obtenemos el elemento subtitulo de la pagina Ver incidencias por su id
    var subTituloElemento = document.getElementById("subtitle-ver-incidencias");

    // Sobreescribemos el texto del elemento
    subTituloElemento.textContent = "Ver incidencias";

    location.reload();
}

export async function continuarOPausar(parteTrabajo) {
    // Segunda petición para registrar el tiempo empleado        
    //const parteTrabajo = await obtenerParteTrabajo(idIncidencia);

    console.log("Objeto parte dentro del PAUSAR O Continuar es ",parteTrabajo);

    const idOrden = parteTrabajo.idOrden; // Corregido aquí

    const hayTiempoSinHora = await comprobarTiempoEmpleadoSinHoraFin(idOrden);
    //console.log('------> hay tiempo sin hora es ----> ', hayTiempoSinHora);

    // si es true debe aparecer continuar trabajo, si es false debe aparecer pausar trabajo
    //return hayTiempoSinHora === true;
    /*
    if(hayTiempoSinHora == true){
        return true;
    }else{
        return false;
    }
    */
    if (typeof hayTiempoSinHora === 'boolean') {
        //console.log('------> Estoy en true ----> ');
        console.log('------> Estoy en continuarOPausar En la parte TRUE ----> ');
        return true;
    } else {
        console.log('------> Estoy en continuarOPausar En la parte FALSE ----> ');
        return false;
    }


}

export async function pausarTrabajo(idIncidencia, parteTrabajo) {
    try {
        //const idIncidenciaElement = document.getElementById('idIncidencia');
        //const idIncidencia = idIncidenciaElement ? idIncidenciaElement.innerText : null;

        if (!idIncidencia) {
            console.error('El ID de la incidencia es undefined o null');
            return;
        }

        //const parteTrabajo = await obtenerParteTrabajo(idIncidencia);
        const idOrden = parteTrabajo.idOrden;

        console.log("idIncidencia = " + idIncidencia);
        console.log("parteTrabajo = ", parteTrabajo);
        console.log("idOrden = " + idOrden);

        const tiempoEmpleado = await comprobarTiempoEmpleadoSinHoraFin(idOrden); // Asegúrate de que datosParteTrabajo esté definida
        const idTiempoEmpleado = tiempoEmpleado[0].idTiempoEmpleado;

        console.log("tiempoEmpleado = ", tiempoEmpleado[0]);
        console.log("idTiempoEmpleado = " + idTiempoEmpleado);

        if (typeof tiempoEmpleado === 'object' && tiempoEmpleado !== null) {

            // Recoger motivo de pausa
            const swalResult = await Swal.fire({
                title: 'Motivo de pausa',
                text: 'Descripción breve del motivo de la pausa del trabajo',
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
                console.log('El usuario ha confirmado');
                const textoIntroducido = swalResult.value;
                // Aquí puedes hacer lo que necesites con el texto introducido
                const ahora = new Date();
                const horaSalida = `${ahora.getHours().toString().padStart(2, '0')}:${ahora.getMinutes().toString().padStart(2, '0')}:${ahora.getSeconds().toString().padStart(2, '0')}`;

                let tiempoEmpleadoNuevo = {
                    idTiempoEmpleado: tiempoEmpleado[0].idTiempoEmpleado,
                    fecha: tiempoEmpleado[0].fecha,
                    idOrdenParteTb: idOrden, //tiempoEmpleado[0].parteTrabajo.idOrden,
                    horaEntrada: tiempoEmpleado[0].horaEntrada,
                    horaSalida: horaSalida,
                    motivoPausa: textoIntroducido,
                    modoResolucion: tiempoEmpleado[0].modoResolucion
                };
                // tiempoEmpleado.horaSalida = new Date().toLocaleTimeString('es-ES', { hour12: false }); // Formato HH:MM:SS


                const respuesta = await fetch(`http://localhost:8080/api/v1/tiempo-empleado/${idTiempoEmpleado}`, {
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
                        text: 'Trabajo pausado con exito',
                        willClose: function () {
                            // Ocultar el boton Pausar trabajo

                            // Mostrar el boton continuar trabajo


                            /*
                            const btnContinuarTrabajo = document.getElementById('btnContinuarTrabajo');
                            const btnPausaTrabajo = document.getElementById('btnPausaTrabajo');

                            console.log('los botones dentro del OnClose es --->',btnContinuarTrabajo, btnPausaTrabajo);

                            if((btnContinuarTrabajo || btnPausaTrabajo) !==null ){
                                btnPausaTrabajo.innerHTML = btnContinuarTrabajo.innerHTML;
                            }
                            */
                            
                            //location.reload();
                            //const pagActual = document.getElementById("tablaListadoIncidencias");
                            const pagActual = document.getElementById("crearParteTbForm");
                            crearFormParteTb(idIncidenciaGlobal, pagActual, obtenerToken());


                        }
                    });

                } else {
                    console.error('Error en la petición finTrabajo:', respuesta.status);
                }

            } else if (swalResult.dismiss === Swal.DismissReason.cancel) {
                console.log('El usuario ha cancelado');
                // Aquí puedes manejar la acción de cancelar
            }


        } else {
            console.log('No hay tiempoEmpleado sin horaFin');
        }
    } catch (error) {
        console.error('Error general:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `No has empezado el trabajo`,
        });
    }
}


export async function continuarTrabajo(parteTrabajo) {
    const selectModoResolucion = document.getElementById('selectModoResolucionFormParteTb');
    const modoResolucionSeleccionado = selectModoResolucion.options[selectModoResolucion.selectedIndex].value;

    if (modoResolucionSeleccionado === 'sinModoResolucion') {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Debe seleccionar un modo de resolución antes de continuar el trabajo`,
        });
    } else {
        const idOrden = parteTrabajo.idOrden; // Corregido aquí

        const hayTiempoSinHora = await comprobarTiempoEmpleadoSinHoraFin(idOrden);

        const ahora = new Date();
        const horaEntrada = `${ahora.getHours().toString().padStart(2, '0')}:${ahora.getMinutes().toString().padStart(2, '0')}:${ahora.getSeconds().toString().padStart(2, '0')}`;

        // Datos para la segunda petición
        const dataRegistrarTiempo = {
            fecha: new Date().toISOString().split('T')[0],
            idOrdenParteTb: idOrden, // Corregido aquí
            horaEntrada: horaEntrada,
            horaSalida: null,
            motivoPausa: null,
            modoResolucion: modoResolucionSeleccionado
        };

        const token = obtenerToken();

        if (hayTiempoSinHora == true || parteCreado) { // Corregido aquí
            const apiUrlRegistrarTiempo = 'http://localhost:8080/api/v1/tiempo-empleado'; // Ruta para registrar el tiempo empleado
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
                    willClose: function () {

                        // Actualizamos el boton
                        //location.reload();
                        //const pagActual = document.getElementById("tablaListadoIncidencias");
                        const pagActual = document.getElementById("crearParteTbForm");
                        crearFormParteTb(idIncidenciaGlobal, pagActual, obtenerToken());
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
        }
    }

}


document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOMContentLoaded 1 ejecutado');


    const btnAgregarMaterial = document.getElementById('btnVolverCrearParteTb');
    btnAgregarMaterial.addEventListener('click', function () {

        volverListaIncidenciasParteTb();
    });

});





