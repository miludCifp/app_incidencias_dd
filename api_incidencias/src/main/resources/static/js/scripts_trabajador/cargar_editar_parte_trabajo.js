
let esModificadoMaterial = false;

// Esta funcion carga la informacion del parte de trabajo a editar en el formulario de editar
function cargarEditarParteTb(parteTbJson, token) {
    try {
        // Obtenemos el elemento subtitulo de la pagina Ver partes de trabajo por su id
        var subTituloElemento = document.getElementById("subtitle-ver-partes-tb");

        // Sobreescribemos el texto del elemento
        subTituloElemento.textContent = "Editar parte de trabajo";


        // Decodificar la cadena JSON
        const decodedParteJson = decodeURIComponent(parteTbJson);

        // Parsear la cadena JSON a un objeto
        const parteTb = JSON.parse(decodedParteJson);

        console.log("parte => ", parteTb);

        // Obtenemos los datos de la incidencia desde el objeto ParteTb
        var idIncidenciaParteTb = parteTb.incidencia.idIncidencia;
        var idParteTb = parteTb.idOrden;
        var motivoParteTb = parteTb.incidencia.descripcion;
        var diagnosticoParteTb = parteTb.diagnostico;
        var tbRealizadoParteTb = parteTb.trabajoRealizado;
        var observacionesParteTb = parteTb.observaciones;

        // Aqui cargamos los materiales que tenga este parte de trabajo
        cargarMaterialesEnFormulario(parteTb.listaMaterialUtilizado, token);

        // Actualizamos los elementos HTML con los datos del parte de trabajo
        document.getElementById("idIncidenciaParteTb-edit").value = idIncidenciaParteTb;
        document.getElementById("idparteTb-edit").value = idParteTb;
        document.getElementById("motivo-edit").value = motivoParteTb;
        document.getElementById("diagnostico-edit").value = diagnosticoParteTb;
        document.getElementById("trabajoRealizado-edit").value = tbRealizadoParteTb;
        document.getElementById("observaciones-edit").value = observacionesParteTb;

        // Ocultamos la tabla de listado de partes de trabajo
        document.getElementById("tablaListadoPartesTb").style.display = "none";

        // Mostramos el formulario de editar parte de trabajo
        document.getElementById("editarParteTbForm").style.display = "block";

        // LLamamos al metodo pasandole el objeto ParteTb obtenido del bucle for generador de las filas de la tabla.
        editarParteTb(parteTb, token);

    } catch (error) {
        console.error("Error al parsear la cadena JSON:", error);
    }

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

// Esta funcion actualizar el parte de trabajo en la bbdd con los nuevos datos
async function editarParteTb(parteTb, token) {

    // Ahora obtenemos el id de la incidencia del parte de trabajo
    var idIncidencia = parteTb.incidencia.idIncidencia;
    console.log('El idIncidencia sacado del objeto ParteTrabajo es : ----> ' + idIncidencia);


    // Obtengo el el id del usuario tecnico del objeto Parte trabajo
    var idTecnico = parteTb.tecnico.idUsuario;

    // Obtengo el idOrden del objeto Parte de tarbajo que entra por parametro
    var idOrden = parteTb.idOrden;
    console.log('El idOrden sacado sacado del objeto es : ' + idOrden);


    // Damos accion al boton Agregar Material y Llamamos aqui a la funcion mostrarMaterialAgregado
    var btnAgregarMaterial = document.getElementById('btnAgregarMaterial-Edit');
    // Agregamos un event listener para el evento de clic
    btnAgregarMaterial.addEventListener('click', function () {

        console.log('Se hizo clic en el botón Agregar Material');

        // Mostramos el material agregado en la interfaz, dentro de esta funcion se insertan los materiales en la BD
        mostrarMaterialAgregado(parteTb.listaMaterialUtilizado, idOrden, token);

    });


    // Url para una peticion PUT al servidor
    var urlPut = 'http://localhost:8080/api/v1/parte-trabajo/' + idOrden;

    // Escuchar el evento submit del formulario Editar parte de trabajo
    document.getElementById("editarParteTbForm").addEventListener("submit", async function (event) {
        event.preventDefault();

        // Obtenemos los datos de los campos del formulario editarParteTb

        //var txtIdParteTb = document.getElementById("idparteTb-edit").value;
        var txtMotivoNuevo = document.getElementById("motivo-edit").value;
        var txtDiagnosticoNuevo = document.getElementById("diagnostico-edit").value;
        var txtTrabajoRealizadoNuevo = document.getElementById("trabajoRealizado-edit").value;
        var txtObservacionesNuevo = document.getElementById("observaciones-edit").value;


        // Verficar si hay cambios
        if (txtMotivoNuevo == parteTb.incidencia.descripcion &&
            txtDiagnosticoNuevo == parteTb.diagnostico &&
            txtTrabajoRealizadoNuevo == parteTb.trabajoRealizado &&
            txtObservacionesNuevo == parteTb.observaciones &&
            esModificadoMaterial == false) {
            // No hay cambios, mostrar alerta y salir de la función
            //alert("No se han realizado cambios.");
            Swal.fire({
                title: "No se han realizado cambios.",
                icon: "info"
            });
            return;
        }

        /*
        // Hago una peticion PUT para insertar el nuevo motivo de la incidencia relacionado con este parte de trabajo
        const objetoIncidenciaNuevo = {
            idIncidencia: idIncidencia,
            titulo: parteTb.incidencia.titulo,
            descripcion: txtMotivoNuevo,
            estado: parteTb.incidencia.estado,
            prioridad: parteTb.incidencia.prioridad,
        }

        actualizarIncidencia(objetoIncidenciaNuevo, idIncidencia, token);
        */

        if (validarCamposFormParteTb(txtDiagnosticoNuevo, txtTrabajoRealizadoNuevo, txtObservacionesNuevo)) {
            // Construimos el objeto parte de trabajo a mandar al servidor
            const parteTrabajoActualizado = {
                idOrden: idOrden,
                trabajoRealizado: txtTrabajoRealizadoNuevo,
                diagnostico: txtDiagnosticoNuevo,
                observaciones: txtObservacionesNuevo,
                costeReparacion: null,
                parteTrabajoImg: null,
                terminado: true,
                idIncidencia: idIncidencia,
                idTecnico: idTecnico
            };

            // Obtener el token
            //const token = await obtenerToken();

            // Realizamos la solicitud PUT al servidor
            try {
                const response = await fetch(urlPut, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(parteTrabajoActualizado)
                });

                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Parte de trabajo actualizado correctamente!',
                        text: 'Puedes consultar el parte de trabajo en "Ver Partes de trabajo"',
                        onClose: function () {
                            // Redirigir a la página ver_partes_trabajo.html
                            window.location.href = 'ver_partes_trabajo';
                        }
                    });
                    // Aquí podrías recargar la tabla u otras acciones necesarias después de la actualización
                    //location.reload();  // Recargar la página

                } else {
                    throw new Error('Error al actualizar el parte de trabajo');
                }
            } catch (error) {
                console.error('Error al actualizar el parte de trabajo :', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al actualizar el parte de trabajo.',
                    text: `Por favor, inténtelo de nuevo más tarde.`,
                });
            }
        }


    });

}

// Función para cargar los materiales en el formulario de editar parte de trabajo
function cargarMaterialesEnFormulario(listaMaterialUtilizado, token) {
    listaMaterialUtilizado.forEach(function (material) {
        var nombreMaterial = material.nombre;
        var cantidadMaterial = material.cantidad;
        var costoMaterial = material.coste;

        var nuevaFilaMaterial = document.createElement('div');
        nuevaFilaMaterial.classList.add('material-row');

        nuevaFilaMaterial.innerHTML = 'Nombre: ' + nombreMaterial + ' - Cantidad: ' + cantidadMaterial + ' - Costo: ' + costoMaterial;

        var eliminarBtn = document.createElement('button');
        eliminarBtn.innerHTML = 'Eliminar';
        eliminarBtn.classList.add('btn', 'btn-sm', 'btn-danger', 'eliminar-material-btn');
        eliminarBtn.addEventListener('click', function () {

            var indice = listaMaterialUtilizado.indexOf(material);
            if (indice !== -1) {
                //listaMaterialUtilizado.splice(indice, 1);
                //nuevaFilaMaterial.remove();

                // Obtiene el objeto de material correspondiente
                var materialABorrar = listaMaterialUtilizado[indice];
                // Ahora puedes acceder al ID del material
                var idMaterialABorrar = materialABorrar.idMaterial;
                console.log("El id del material q se va a borra es ----> " + idMaterialABorrar);

                // Ahora elimino el material de la base de datos
                eliminarMaterial(idMaterialABorrar, token);

                // Lo elimino de la interfaz
                nuevaFilaMaterial.remove();

            }

        });

        nuevaFilaMaterial.appendChild(eliminarBtn);
        document.getElementById('lista_materiales').appendChild(nuevaFilaMaterial);
    });
}

// Este metodo muestra el material que se agrega al darle al boton Agregar
function mostrarMaterialAgregado(listaMaterialUtilizado, idOrden, token) {
    var txtNombreMaterial = document.getElementById('material_utilizado_edit').value;
    var txtCantidad = document.getElementById('cantidad_utilizada_edit').value;
    var txtCosto = document.getElementById('costo_material_edit').value;

    if (txtNombreMaterial.trim() !== '' && !isNaN(txtCantidad) && !isNaN(txtCosto) && txtCantidad > 0 && txtCosto > 0) { // Verificar si se ingresaron valores válidos

        // Limpiar el mensaje de error si estaba visible
        document.getElementById('error-message').textContent = '';

        var nuevaFilaMaterial = document.createElement('div');
        nuevaFilaMaterial.classList.add('material-row'); // Agregar clase para el estilo

        nuevaFilaMaterial.innerHTML = 'Nombre : ' + txtNombreMaterial + ' - Cantidad: ' + txtCantidad + ' - Costo: ' + txtCosto;

        // Crear botón para eliminar el material
        var eliminarBtn = document.createElement('button');
        eliminarBtn.innerHTML = 'Eliminar';
        eliminarBtn.classList.add('btn', 'btn-sm', 'btn-danger', 'eliminar-material-btn');
        eliminarBtn.addEventListener('click', function () {

            var indice = listaMaterialUtilizado.indexOf(material);
            if (indice !== -1) {
                //listaMaterialUtilizado.splice(indice, 1);
                //nuevaFilaMaterial.remove();

                // Obtiene el objeto de material correspondiente
                var materialABorrar = listaMaterialUtilizado[indice];
                // Ahora puedes acceder al ID del material
                var idMaterialABorrar = materialABorrar.idMaterial;
                console.log("El id del material q se va a borra es ----> " + idMaterialABorrar);

                // Ahora elimino el material de la base de datos
                eliminarMaterial(idMaterialABorrar, token);

                // Lo elimino de la interfaz
                nuevaFilaMaterial.remove();

            }

        });

        nuevaFilaMaterial.appendChild(eliminarBtn); // Agregar botón de eliminar a la fila de material

        document.getElementById('lista_materiales').appendChild(nuevaFilaMaterial);

        // Creamos el objeto Material trabajo nuevo
        var unMaterialNuevo = {
            nombre: txtNombreMaterial,
            cantidad: txtCantidad,
            coste: txtCosto
        };

        // insertamos en la BD el material
        insertarNuevoMaterial(unMaterialNuevo, idOrden, token);

        // Limpiar los campos del formulario después de agregar el material
        document.getElementById('material_utilizado_edit').value = '';
        document.getElementById('cantidad_utilizada_edit').value = '';
        document.getElementById('costo_material_edit').value = '';

    } else {
        // Mostrar mensaje de error
        document.getElementById('error-message').textContent = 'Por favor, complete todos los campos.';

    }
}

// Esta funcion inserta el meterial del parte de trabajo en la bbdd mediante una petición POST
async function insertarNuevoMaterial(objetoMaterialAgregado, idOrden, token) {

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
        Swal.fire({
            icon: 'success',
            title: '¡Material de trabajo añadido correctamente!',
            text: 'Puedes ver los materiales añadidos en la lista de abajo"',
        });

        // Esto significa que los materiales han sido modificados
        esModificadoMaterial = true;

    } catch (error) {
        //console.error('Error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Hubo un error al enviar los datos del material`,
        });
    }
}

// Funcion que elimina el material del parte de trabajo de la bbdd
async function eliminarMaterial(idMaterial, token) {
    // URL para la solicitud DELETE
    var urlDelete = 'http://localhost:8080/api/v1/material-utilizado/' + idMaterial;

    // Confirmar si el usuario realmente quiere eliminar la incidencia
    Swal.fire({
        title: '¿Está seguro de que desea eliminar este material?',
        text: 'El material se eliminará definitivamente',
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
                    Swal.fire({
                        icon: 'success',
                        title: '¡Material eliminado correctamente!',
                    });

                    // Esto significa que los materiales han sido modificados
                    esModificadoMaterial = true;

                } else {
                    // Manejar errores de la respuesta
                    const errorMessage = await response.text();
                    throw new Error(`Error al eliminar el material: ${errorMessage}`);
                }
            } catch (error) {
                console.error('Error al eliminar el material:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al eliminar el material.',
                    text: `Por favor, inténtelo de nuevo más tarde.`,
                });
            }
        }
    });
}

// Esta funcion actualiza el motivo de la incidencia relacionada con el parte de trabajo
async function actualizarIncidencia(objetoNuevaIncidencia, idIncidencia, token) {

    var urlPut = 'http://localhost:8080/api/v1/incidencias/' + idIncidencia;
    // Realizamos la solicitud PUT al servidor
    try {
        const response = await fetch(urlPut, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(parteTrabajoActualizado)
        });

        if (response.ok) {
            console.log("Incidencia actualizada con exito");

        } else {
            throw new Error('Error al actualizar la incidencia del parte de trabajo');
        }
    } catch (error) {
        console.error('Error al actualizar la incidencia del parte de trabajo :', error);
    }
}


function volverListaPartesTb() {
    // Ocultamos el formulario de editar parte de trabajo
    document.getElementById("editarParteTbForm").style.display = "none";

    // Volvemos a mostrar el listado de incidencias
    document.getElementById("tablaListadoPartesTb").style.display = "block";

    // Obtenemos el elemento subtitulo de la pagina Ver partes de trabajo por su id
    var subTituloElemento = document.getElementById("subtitle-ver-partes-tb");

    // Sobreescribemos el texto del elemento
    subTituloElemento.textContent = "Consultar partes de trabajo";

    location.reload();
}