import * as manejadorToken from '../manejador_token.js';

// Función para obtener el token
function obtenerToken() {
    return manejadorToken.getToken();
}
/*
                    idUseEdit
                    comboGeneroEdit
                    comboTipoDocEdit
                    comboTipoDocEdit
                    inputDocEdit
                    nombreUserEdit
                    apellidosUserEdit
                    telfUserEdit
                    emailUserEdit
                    -----------------------
                    errorMsgDoc
                    errorMsgTlfn
                    errorMsgEmail
*/

// Función para hacer peticion GET al servidor, utiliz el token
async function obtenerUsuarios() {
    // Obtener el token
    const token = await obtenerToken();

    // URL para la solicitud GET
    const urlGet = 'http://localhost:8080/api/v1/clientes';

    try {
        const response = await fetch(urlGet, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener los usuarios');
        }

        const data = await response.json();

        console.log("Usuarios recibidos:", data); // Puedes eliminar este console.log una vez confirmes que recibes los datos correctamente

        return data;  // Retorna la lista de usuarios
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        alert("Error al obtener los usuarios. Por favor, inténtelo de nuevo más tarde.");
    }
}

// Función para cargar los usuarios en la tabla Gestion de usuarios
async function cargarUsersEnTabla() {
    // Obtener la tabla donde se cargarán los usuarios
    const tabla = document.getElementById('datatablesSimple');


    // Obtener los usuarios del servidor
    const usuarios = await obtenerUsuarios();

    // Verificar si hay usuarios y si la tabla está presente
    if (!usuarios || usuarios.length === 0 || !tabla) {
        console.warn('No se encontraron usuarios o no se encontró la tabla.');
        return;
    }

    // Limpiar el cuerpo de la tabla
    tabla.querySelector('tbody').innerHTML = '';

    // Construir las filas de la tabla con un bucle for
    usuarios.forEach(usuario => {

        const row = `
            <tr>
                <td style="width: 50px; min-width: 50px; max-width: 50px;">${usuario.idUsuario}</td>
                <td>${usuario.documento}</td>
                <td>${usuario.nombre}</td>
                <td>${usuario.apellido}</td>
                <td>${usuario.correoElectronico}</td>
                <td>${usuario.telefono}</td>
                <td style="width: 200px; min-width: 200px; max-width: 200px;">
                    <button type="button" class="btn btn-sm btn-danger btn-dar-de-baja" data-id="${usuario.idUsuario}">Dar de baja</button>
                    <button type="button" class="btn btn-sm btn-warning btn-edit-user" data-id="${usuario.idUsuario}">Editar</button>
                </td>
            </tr>
        `;

        // Añadir la fila al cuerpo de la tabla
        tabla.querySelector('tbody').insertAdjacentHTML('beforeend', row);

    });

    // Inicializamos la tabla después de cargar las filas de la tabla.
    new simpleDatatables.DataTable(tabla);

    // Asignar evento click a los botones "Dar de baja"
    tabla.querySelectorAll('.btn-dar-de-baja').forEach(botonEliminar => {
        botonEliminar.addEventListener('click', function () {

            // Obtener el ID del usuario desde el atributo data-id
            const idUsuario = this.getAttribute('data-id').toString();
            // Encontrar el objeto de usuario correspondiente
            const usuario = usuarios.find(user => user.idUsuario.toString() === idUsuario);
            // Llamar a la función eliminarTrabajador pasando el botón y el objeto de usuario
            eliminarCliente(this, usuario);

        });
    });

    // Asignar evento click a los botones "Editar usuario"
    tabla.querySelectorAll('.btn-edit-user').forEach(botonEliminar => {
        botonEliminar.addEventListener('click', function () {

            // Obtener el ID del usuario desde el atributo data-id
            const idUsuario = this.getAttribute('data-id').toString();
            // Encontrar el objeto de usuario correspondiente
            const usuario = usuarios.find(user => user.idUsuario.toString() === idUsuario);
            // Llamar a la función eliminarTrabajador pasando el botón y el objeto de usuario
            cargarEditarUsuario(usuario);

        });
    });

}

// Llamar a la función para cargar los usuarios cuando se cargue el DOM
document.addEventListener('DOMContentLoaded', cargarUsersEnTabla);

function cargarEditarUsuario(objetoUsuario) {

    // Obtenemos el elemento subtitulo de la pagina Ver incidencias por su id
    var subTituloElemento = document.getElementById("subtitle-gestion-user");

    // Sobreescribemos el texto del elemento
    subTituloElemento.textContent = "Editar usuario";

    // Obntemos los datos del usuario del objeto Usuario
    var idUser = objetoUsuario.idUsuario;
    var tipoDocUser = objetoUsuario.tipoDocumento;
    var docUser = objetoUsuario.documento;
    var generoUser = objetoUsuario.genero;
    var nombreUser = objetoUsuario.nombre;
    var apellidosUser = objetoUsuario.apellido;
    var emailUser = objetoUsuario.correoElectronico;
    var telfUser = objetoUsuario.telefono;
    var calleUser = objetoUsuario.calle;
    var ciudadUser = objetoUsuario.ciudad;
    var provinciaUser = objetoUsuario.provincia;
    var codPostalUser = objetoUsuario.codigoPostal;
    var paisUser = objetoUsuario.pais;


    // Actualizamos los elementos HTML con los detalles de la incidencia
    document.getElementById("idUseEdit").value = idUser;
    document.getElementById("comboGeneroEdit").value = generoUser;
    document.getElementById("comboTipoDocEdit").value = tipoDocUser;
    document.getElementById("inputDocEdit").value = docUser;
    document.getElementById("nombreUserEdit").value = nombreUser;
    document.getElementById("apellidosUserEdit").value = apellidosUser;
    document.getElementById("telfUserEdit").value = telfUser;
    document.getElementById("emailUserEdit").value = emailUser;
    document.getElementById("inputCalleEdit").value = calleUser;
    document.getElementById("inputCiudadEdit").value = ciudadUser;
    document.getElementById("inputProvinciaEdit").value = provinciaUser;
    document.getElementById("inputCpEdit").value = codPostalUser;
    document.getElementById("comboPaisEdit").value = paisUser;

    // Ocultamos la tabla de listado de usuarios
    document.getElementById("tablaListaUsers").style.display = "none";

    // Mostramos el formulario de editar usuario
    document.getElementById("editarClientesForm").style.display = "block";

    // llamamos aqui a la funcion que edita el usuario y lo actualiza en la BD
    editarUserCliente(objetoUsuario);


}

function validarCamposUserCliente(tipoDoc, doc, tlfn, email, newPasswd, calle, ciudad, provincia, cp, pais) {


    var msgErrInputDoc = document.getElementById("errorMsgDoc");
    var msgErrTlfn = document.getElementById("errorMsgTlfn");
    var msgErrEmail = document.getElementById("errorMsgEmail");
    var msgErrCalle = document.getElementById("errorMsgCalle");
    var msgErrCiudad = document.getElementById("errorMsgCiudad");
    var msgErrProvincia = document.getElementById("errorMsgProvincia");
    var msgErrCp = document.getElementById("errorMsgCp");
    var msgErrPais = document.getElementById("errorMsgPais");

    // Ocultamos los mensajes de error si estaban visibles
    msgErrInputDoc.style.display = "none";
    msgErrTlfn.style.display = "none";
    msgErrEmail.style.display = "none";
    msgErrCalle.style.display = "none";
    msgErrCiudad.style.display = "none";
    msgErrProvincia.style.display = "none";
    msgErrCp.style.display = "none";
    msgErrPais.style.display = "none";


    const dniValido = /^\d{8}[A-Z]$/;
    const cifValido = /^[a-zA-Z]\d{8}$/;
    const nieValido = /^[A-Z]\d{7}[A-Z]$/;
    const contrasenaValida = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_+=]).{8,}$/;
    var criteriosContrasena = "La contraseña debe cumplir con los siguientes criterios de seguridad:\n\
    - Al menos 8 caracteres.\n\
    - Al menos una letra mayúscula.\n\
    - Al menos una letra minúscula.\n\
    - Al menos un dígito numérico.\n\
    - Al menos un carácter especial (por ejemplo, !@#$%^&*()-_+=).";

    // Esta expresion regular permite solo caracteres alfanumericos
    const regexAlfaNum = /^[a-zA-Z0-9]+$/;
    // Esta expresion regular permite solo numeros
    const regexNum = /^\d+$/;
    // Expresión regular para validar el formato del correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Comprobaciones de los campos
    if (doc === '') {
        msgErrInputDoc.style.display = "block";
        msgErrInputDoc.textContent = 'El documento es obligatorio';
        return false;
    } else if (tipoDoc === 'DNI' && !(dniValido.test(doc))) {
        msgErrInputDoc.style.display = "block";
        msgErrInputDoc.textContent = 'DNI no valido. Formato admitido: 12345678A';
        return false;
    } else if (tipoDoc === 'NIE' && !(nieValido.test(doc))) {
        msgErrInputDoc.style.display = "block";
        msgErrInputDoc.textContent = 'NIE no valido. Formato admitido: A1234567A';
        return false;
    } else if (tipoDoc === 'CIF' && !(cifValido.test(doc))) {
        msgErrInputDoc.style.display = "block";
        msgErrInputDoc.textContent = 'CIF no valido. Formato admitido: A12345678';
        return false;
    }

    if (tlfn === '') {
        msgErrTlfn.style.display = "block";
        msgErrTlfn.textContent = 'El telefono es obligatorio';
        return false;
    } else if (tlfn.length !== 9) {
        msgErrTlfn.style.display = "block";
        msgErrTlfn.textContent = 'El telefono debe tener 9 numeros';
        return false;
    }

    if (email === '') {
        msgErrEmail.style.display = "block";
        msgErrEmail.textContent = 'El correo es obligatorio';
        return false;
    } else if (!emailRegex.test(email)) {
        msgErrEmail.style.display = "block";
        msgErrEmail.textContent = 'El email introducido no es valido';
        return false;
    }

    if (calle === '') {
        msgErrCalle.style.display = "block";
        msgErrCalle.textContent = 'La calle es obligatoria';
        return false;
    }

    if (ciudad === '') {
        msgErrCiudad.style.display = "block";
        msgErrCiudad.textContent = 'La ciudad es obligatoria';
        return false;
    } else if (regexNum.test(ciudad)) {
        msgErrCiudad.style.display = "block";
        msgErrCiudad.textContent = 'El campo ciudad no admite numeros';
        return false;
    }

    if (provincia === '') {
        msgErrProvincia.style.display = "block";
        msgErrProvincia.textContent = 'La provincia es obligatoria';
        return false;
    } else if (regexNum.test(provincia)) {
        msgErrProvincia.style.display = "block";
        msgErrProvincia.textContent = 'El campo provincia no admite numeros';
        return false;
    }

    if (cp === '') {
        msgErrCp.style.display = "block";
        msgErrCp.textContent = 'El codigo postal es obligatorio';
        return false;
    } else if (!regexNum.test(cp)) {
        msgErrCp.style.display = "block";
        msgErrCp.textContent = 'El campo codigo postal es numerico';
        return false;
    }

    if (pais === 'sinPais') {
        msgErrPais.style.display = "block";
        msgErrPais.textContent = 'Por favor, selecciona un pais';
        return false;
    }

    // Devolver true si todos los campos son válidos
    return true;

}

function validarContraseñaNueva(newPasswd) {
    var msgErrPasswd = document.getElementById('errorMsgPasswd');
    // Ocultamos el mensaje si estaba visible
    msgErrPasswd.style.display = "none";

    const contrasenaValida = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_+=]).{8,}$/;
    var criteriosContrasena = "La contraseña debe cumplir con los siguientes criterios de seguridad:\n\
    - Al menos 8 caracteres.\n\
    - Al menos una letra mayúscula.\n\
    - Al menos una letra minúscula.\n\
    - Al menos un dígito numérico.\n\
    - Al menos un carácter especial (por ejemplo, !@#$%^&*()-_+=).";

    if (newPasswd === '') {
        msgErrPasswd.style.display = "block";
        msgErrPasswd.textContent = 'La contraseña es obligatoria';
        return false;
    } else if (!contrasenaValida.test(newPasswd)) {
        msgErrPasswd.style.display = "block";
        msgErrPasswd.textContent = criteriosContrasena;
        return false;
    }

    return true;


}

// Funcion para editar un usuario mediante una peticion PUT al servidor
async function editarUserCliente(objetoUsuario) {

    // Obtener el token
    const token = await obtenerToken();

    // Obtenemos los datos de la incidencia desde el objeto
    var idUser = objetoUsuario.idUsuario;
    var rolUser = objetoUsuario.rol;

    console.log('id de la fila a editar es : ' + idUser);

    const userOriginal = objetoUsuario;

    // Obtener los datos originales del usuario trabjador
    var idUserOriginal = userOriginal.idUsuario;
    var tipoDoc = userOriginal.tipoDocumento;
    var documento = userOriginal.documento;
    var genero = userOriginal.genero;
    var nombre = userOriginal.nombre;
    var apellidos = userOriginal.apellido;
    var email = userOriginal.correoElectronico;
    var password = userOriginal.contrasena;
    var telefono = userOriginal.telefono;
    var calle = userOriginal.calle;
    var ciudad = userOriginal.ciudad;
    var provincia = userOriginal.provincia;
    var codPostal = userOriginal.codigoPostal;
    var pais = userOriginal.pais;

    // Escuchar el evento submit del formulario
    document.getElementById("editarClientesForm").addEventListener("submit", async function (event) {
        event.preventDefault();

        // Obtener los nuevos valores del formulario
        //var nuevaImagenPerfil = document.getElementById("imagenPerfil").value;
        var newTipoDoc = document.getElementById("comboTipoDocEdit").value;
        var newDoc = document.getElementById("inputDocEdit").value;
        var newGenero = document.getElementById("comboGeneroEdit").value;
        var newNombre = document.getElementById("nombreUserEdit").value;
        var newApellidos = document.getElementById("apellidosUserEdit").value;
        var newTlfn = document.getElementById("telfUserEdit").value;
        var newEmail = document.getElementById("emailUserEdit").value;
        // Obtenemos el campo Contraseña nueva
        var newPasswd = document.getElementById("passwdUserEdit");
        var newCalle = document.getElementById("inputCalleEdit").value;
        var newCiudad = document.getElementById("inputCiudadEdit").value;
        var newProv = document.getElementById("inputProvinciaEdit").value;
        var newCodPostal = document.getElementById("inputCpEdit").value;
        var newPais = document.getElementById("comboPaisEdit").value;

        // Imprimir variables para depuracion
        console.log('Original TipoDOCUMENTO es ==>' + tipoDoc);
        console.log('Nuevo TipoDOCUMENTO es ==>' + newTipoDoc);
        console.log('Original DOCUMENTO es ==>' + documento);
        console.log('Nuevo DOCUMENTO es ==>' + newDoc);
        console.log('Original GENERO es ==>' + genero);
        console.log('Nuevo GENERO es ==>' + newGenero);
        console.log('Original Nombre es ==>' + nombre);
        console.log('Nuevo Nombre es ==>' + newNombre);
        console.log('Original Apellidos es ==>' + apellidos);
        console.log('Nuevo Apellidos es ==>' + newApellidos);
        console.log('Original TLFN es ==>' + telefono);
        console.log('Nuevo TLFN es ==>' + newTlfn);
        console.log('Original Email es ==>' + email);
        console.log('Nuevo Email es ==>' + newEmail);
        console.log('Original CIUDAD es ==>' + ciudad);
        console.log('Nuevo CIUDAD es ==>' + newCiudad);
        console.log('Original CALLE es ==>' + calle);
        console.log('Nuevo CALLE es ==>' + newCalle);
        console.log('Original PROVINCIA es ==>' + provincia);
        console.log('Nuevo PROVINCIA es ==>' + newProv);
        console.log('Original COD POSTAL es ==>' + codPostal);
        console.log('Nuevo COD POSTAL es ==>' + newCodPostal);
        console.log('Original PAIS es ==>' + pais);
        console.log('Nuevo PAIS es ==>' + newPais);

        //console.log('Original Password es ==>' + password);
        //console.log('Nuevo Password es ==>' + nuevaContrasena);


        // Verificar si ha habido cambios
        if (newTipoDoc == tipoDoc &&
            newDoc == documento &&
            newGenero == genero &&
            newNombre == nombre &&
            newApellidos == apellidos &&
            newTlfn == telefono &&
            newEmail == email &&
            newPasswd == null &&
            newCalle == calle &&
            newCiudad == ciudad &&
            newProv == provincia &&
            newCodPostal == codPostal &&
            newPais == pais) {
            // No hay cambios, mostrar alerta y salir de la función
            //alert("No se han realizado cambios.");
            Swal.fire({
                title: "No se han realizado cambios.",
                icon: "info"
            });
            return;

        }

        // Validamos los campos
        if (validarCamposUserCliente(newTipoDoc, newDoc, newTlfn, newEmail, newCalle, newCiudad, newProv, newCodPostal, newPais)) {
            // Construir el objeto de usuario trabajador a actualizar
            var usuarioActualizado = {
                idUsuario: idUserOriginal,
                tipoDocumento: newTipoDoc,
                documento: newDoc,
                genero: newGenero,
                nombre: newNombre,
                apellido: newApellidos,
                correoElectronico: newEmail,
                //contrasena: nuevaContrasena,
                telefono: newTlfn,
                calle: newCalle,
                ciudad: newCiudad,
                provincia: newProv,
                codigoPostal: newCodPostal,
                pais: newPais,
            };

            // Si hay cambios, hacemos una solicitud PUT al servidor pasándole el id obtenido por la solicitud GET
            var urlPut = 'http://localhost:8080/api/v1/clientes/' + idUserOriginal;


            // Ahora comprobar si se ha introducido una nueva contraseña
            if (newPasswd != null) {
                var txtNuevaContrasena = document.getElementById("passwdUserEdit").value;
                if (txtNuevaContrasena != '') {
                    usuarioActualizado.contrasena = txtNuevaContrasena;
                    // Validamos la contraseña 
                    if (validarContraseñaNueva(txtNuevaContrasena)) {
                        console.warn("Objeto q se va a editar CON CONTRASEÑA --->", usuarioActualizado);
                        actualizarPasswdCliente(idUserOriginal, usuarioActualizado, token);
                    }
                }
            } else {
                console.warn("Editando usuario sin Contraseña --->", usuarioActualizado);
                actualizarUserCliente(urlPut, usuarioActualizado, token);
            }

        }


    });


    // Creamos el campo donde introducir la nueva contraseña
    crearCampoNewContraseña();


}


function crearCampoNewContraseña() {
    // Hacer el listener del boton Cambiar contraseña
    var btnCambiarPasswd = document.getElementById("btnCambiarPasswd");

    // Agrega un evento "click" al botón
    btnCambiarPasswd.addEventListener("click", function () {

        // Este código se ejecutará cuando se haga clic en el botón
        console.log("El botón Cambiar contraseña ha sido pulsado.");

        // Ocultamos el boton Cambiar contraseña
        btnCambiarPasswd.style.display = "none";


        // Obtén una referencia al contenedor
        var contenedor = document.getElementById("contenedorNewPasswd");

        // Crea el input de contraseña
        var inputPasswd = document.createElement("input");
        inputPasswd.type = "password";
        inputPasswd.className = "form-control";
        inputPasswd.id = "passwdUserEdit";
        contenedor.appendChild(inputPasswd);

        // Crea el botón para mostrar la contraseña
        var botonMostrar = document.createElement("button");
        botonMostrar.className = "btn btn-outline-secondary";
        botonMostrar.type = "button";
        botonMostrar.id = "showPasswordButton";

        // Crea el icono dentro del botón
        var icono = document.createElement("i");
        icono.className = "fas fa-eye";
        botonMostrar.appendChild(icono);

        // Agrega un evento de clic al botón para mostrar la contraseña
        botonMostrar.addEventListener("click", function () {
            if (inputPasswd.type === "password") {
                inputPasswd.type = "text";
            } else {
                inputPasswd.type = "password";
            }
        });

        contenedor.appendChild(botonMostrar);

        // Crea el div para el mensaje de error
        var errorMsgDiv = document.createElement("div");
        errorMsgDiv.id = "errorMsgPasswd";
        errorMsgDiv.className = "alert alert-danger";
        errorMsgDiv.role = "alert";
        errorMsgDiv.style.padding = "5px";
        errorMsgDiv.style.marginBottom = "0";
        errorMsgDiv.style.wordWrap = "break-word";
        errorMsgDiv.style.display = "none";

        // Inserta el div justo después del input de contraseña
        contenedor.appendChild(errorMsgDiv);

    });
}


async function actualizarUserCliente(urlPut, objetoUsuario, token) {

    // Realizar la solicitud PUT al servidor
    try {
        const response = await fetch(urlPut, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(objetoUsuario)
        });

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: '¡El usuario ha sido actualizado correctamente!',
                text: 'Puedes consultar el usuario actualizado en el listado de los usuarios',
                willClose: function () {
                    location.reload();
                }
            });
            // Aquí podrías recargar la tabla u otras acciones necesarias después de la actualización
            //recargarPagina();
        } else {
            throw new Error('Error al actualizar el usuario');
        }
    } catch (error) {
        console.error('Error al actualizar el usuario :', error);
        Swal.fire({
            icon: 'error',
            title: 'Error al actualizar los datos del usuario.',
            text: `Por favor, inténtelo de nuevo más tarde.`,
        });
    }
}

async function actualizarPasswdCliente(idUser, usuario,token) {
    try {
        const response = await fetch(`http://localhost:8080/api/v1/clientes/update-con-contraseña/${idUser}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(usuario)
        });

        if (response.ok) {
            const userActualizado = await response.json();
            console.log('Usuario actualizado:', userActualizado);
            return userActualizado;
        } else if (response.status === 404) {
            console.log('Usuario no encontrado');
            return null;
        } else {
            console.error('Error al actualizar usuario:', response.status);
            return null;
        }
    } catch (error) {
        console.error('Error de red:', error);
        return null;
    }
}


async function eliminarCliente(boton, objetoUsuario) {
    console.log("El el objeto user que ha entrado desde el bucle de la tabla es --->", objetoUsuario);


    // Obtenemos el id del usuario trabajador desde la tabla
    var idUser = objetoUsuario.idUsuario;

    var docUser = objetoUsuario.documento;

    console.log('id de la fila es : ' + idUser);

    // URL para la solicitud DELETE
    var urlDelete = 'http://localhost:8080/api/v1/clientes/' + idUser;

    // Confirmar si el usuario realmente quiere eliminar la incidencia
    Swal.fire({
        title: '¿Está seguro de que desea dar de baja al usuario con Nº de documento ' + docUser + ' ?',
        text: 'El usuario se eliminará definitivamente',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, Eliminar',
        cancelButtonText: 'No, Cancelar'
    }).then(async (result) => {
        // Si el usuario confirma
        if (result.isConfirmed) {
            // Obtener el token
            const token = await obtenerToken();

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
                        title: '¡El usuario ha sido dado de baja correctamente!',
                        text: 'Puedes consultar los usuarios en el botón "Gestión usuarios"',
                    });
                } else {
                    // Manejar errores de la respuesta
                    const errorMessage = await response.text();
                    throw new Error(`Error al eliminar el usuario: ${errorMessage}`);
                }
            } catch (error) {
                console.error('Error al eliminar el usuario:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al eliminar el usuario.',
                    text: `Por favor, inténtelo de nuevo más tarde.`,
                });
            }
        }
    });





}


function volverListaUsuarios() {
    // Ocultamos el formulario de editar incidencia
    document.getElementById("editarClientesForm").style.display = "none";

    // Volvemos a mostrar el listado de incidencias
    document.getElementById("tablaListaUsers").style.display = "block";

    // Obtenemos el elemento subtitulo de la pagina Ver incidencias por su id
    var subTituloElemento = document.getElementById("subtitle-gestion-user");

    // Sobreescribemos el texto del elemento
    subTituloElemento.textContent = "Gestión de usuarios";

    location.reload();
}


document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOMContentLoaded 1 ejecutado');


    var btnVolverListaUsers = document.getElementById('btnVolverListaUsers');
    // Agregamos un event listener para el evento de clic
    btnVolverListaUsers.addEventListener('click', function () {

        volverListaUsuarios();
    });

});

