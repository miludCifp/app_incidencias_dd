import * as obtenerInfoUser from './obtener_info_user.js';
import * as manejadorToken from '../manejador_token.js';

let fileImagen;

function obtenerToken() {
    return manejadorToken.getToken();
}

async function actualizarPerfil(objetoDatosUsuario) {

    // Escuchar el evento submit del formulario
    document.getElementById("ajustesPerfilForm").addEventListener("submit", async function (event) {
        event.preventDefault(); // Evitar el comportamiento predeterminado de enviar el formulario

        /*
        comboTipoDoc
        inputDoc
        comboGenero
        inputNombre
        inputApellidos
        inputTelefono
        inputEmail
        -----------------------
        */

        // Obtenemos los datos de los campos
        var tipoDoc = document.getElementById("comboTipoDoc").value;
        var txtDocumento = document.getElementById("inputDoc").value.trim();
        var genero = document.getElementById("comboGenero").value;
        var txtNombre = document.getElementById("inputNombre").value.trim();
        var txtApellidos = document.getElementById("inputApellidos").value.trim();
        var txtTlfn = document.getElementById("inputTelefono").value.trim();
        var txtEmail = document.getElementById("inputEmail").value.trim();

        var btnSelectImgPerfil = document.getElementById("inputImagenPerfil");

        if (validarCampos(objetoDatosUsuario, tipoDoc,txtDocumento,genero,txtNombre, txtApellidos, txtTlfn, txtEmail)) {

            
            // Obtener el token
            const token = await obtenerToken();

            var idUser = await manejadorToken.getIdFromToken(token);

            // Contruimos el nuevo objeto usuario a actualizar
            const objetoUsuarioActualizado = {
                idUsuario: idUser,
                tipoDocumento: tipoDoc,
                documento: txtDocumento,
                genero: genero,
                nombre: txtNombre,
                apellido: txtApellidos,
                correoElectronico: txtEmail,
                telefono: txtTlfn,
                rol: objetoDatosUsuario.rol
            };

            var urlPut = 'http://localhost:8080/api/v1/trabajadores/' + idUser;

            // Realizamos la solicitud PUT al servidor
            try {
                const response = await fetch(urlPut, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(objetoUsuarioActualizado)
                });

                if (btnSelectImgPerfil.files.length !== 0) {
                    subirImagen(fileImagen);
                }

                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Datos actualizados correctamente!',
                        willClose: function () {
                            // Recargar pagina
                            location.reload();
                        }
                    });

                } else {
                    throw new Error('Error al actualizar los datos del usuario');
                }
            } catch (error) {
                console.error('Error al actualizar los datos del usuario :', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al actualizar los datos del usuario.',
                    text: `Por favor, inténtelo de nuevo más tarde.`,
                });
            }

        }

    });

}


function validarCampos(objetoDatosUsuario, tipoDoc,txtDoc,genero, txtName, txtApellidos, txtTlfn, txtEmail) {

    // Obtener los datos de los campos
    //var imgPerfil = document.getElementById("previewImagenPerfil").value;

    var btnSelectImgPerfil = document.getElementById("inputImagenPerfil");
    var msgErrInputDoc = document.getElementById('errorMsgDoc');
    var msgErrTlfn = document.getElementById('errorMsgTlfn');
    var msgErrEmail = document.getElementById('errorMsgEmail');


    console.log("El primer apellido es -->" + objetoDatosUsuario.apellido.split(' ')[0]);

    console.log("El segundo apellido es -->" + objetoDatosUsuario.apellido.split(' ')[1]);

    // Verficar si hay cambios
    if (btnSelectImgPerfil.files.length === 0 &&
        tipoDoc == objetoDatosUsuario.tipoDocumento &&
        txtDoc == objetoDatosUsuario.documento &&
        genero == objetoDatosUsuario.genero &&
        txtName == objetoDatosUsuario.nombre &&
        txtApellidos == objetoDatosUsuario.apellido &&
        txtTlfn == objetoDatosUsuario.telefono &&
        txtEmail == objetoDatosUsuario.correoElectronico) {
        // No hay cambios, mostrar alerta y salir de la función
        //alert("No se han realizado cambios.");
        Swal.fire({
            title: "No se han realizado cambios.",
            icon: "info"
        });
        return;
    }

    const dniValido = /^\d{8}[A-Z]$/;
    const cifValido = /^[a-zA-Z]\d{8}$/;
    const nieValido = /^[A-Z]\d{7}[A-Z]$/;
    // Esta expresion regular permite solo caracteres alfanumericos
    const regexAlfaNum = /^[a-zA-Z0-9]+$/;
    // Esta expresion regular permite solo numeros
    const regexNum = /^\d+$/;
    // Expresión regular para validar el formato del correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    // Ocultamos los mensajes de error si estaban visibles
    msgErrInputDoc.style.display = "none";
    msgErrTlfn.style.display = "none";
    msgErrEmail.style.display = "none";




    // Comprobaciones de los campos
    if (txtDoc === '') {
        msgErrInputDoc.style.display = "block";
        msgErrInputDoc.textContent = 'El documento es obligatorio';
        return false;
    } else if (tipoDoc === 'DNI' && !(dniValido.test(txtDoc))) {
        msgErrInputDoc.style.display = "block";
        msgErrInputDoc.textContent = 'DNI no valido. Formato admitido: 12345678A';
        return false;
    } else if (tipoDoc === 'NIE' && !(nieValido.test(txtDoc))) {
        msgErrInputDoc.style.display = "block";
        msgErrInputDoc.textContent = 'NIE no valido. Formato admitido: A1234567A';
        return false;
    } else if (tipoDoc === 'CIF' && !(cifValido.test(txtDoc))) {
        msgErrInputDoc.style.display = "block";
        msgErrInputDoc.textContent = 'CIF no valido. Formato admitido: A12345678';
        return false;
    }

    if (txtTlfn === '') {
        msgErrTlfn.style.display = "block";
        msgErrTlfn.textContent = 'El telefono es obligatorio';
        return false;
    } else if (txtTlfn.length !== 9) {
        msgErrTlfn.style.display = "block";
        msgErrTlfn.textContent = 'El telefono debe tener 9 numeros';
        return false;
    }

    if (txtEmail === '') {
        msgErrEmail.style.display = "block";
        msgErrEmail.textContent = 'El correo es obligatorio';
        return false;
    } else if (!emailRegex.test(txtEmail)) {
        msgErrEmail.style.display = "block";
        msgErrEmail.textContent = 'El email introducido no es valido';
        return false;
    }

    return true;


}

function cambiarContrasena() {
    var btnCambiarPasswd = document.getElementById("btnCambiarPasswd");
    btnCambiarPasswd.addEventListener('click', function () {

        // Confirmar si el usuario realmente quiere eliminar la incidencia
        Swal.fire({
            title: '¿Está seguro de que desea cambiar la contraseña?',
            text: 'La sesión actual se va a cerrar',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, Cambiar',
            cancelButtonText: 'No, Cancelar'
        }).then(async (result) => {
            // Si el usuario confirma
            if (result.isConfirmed) {

                // Distruyemos el token actual
                manejadorToken.removeToken();

                // Redirigir a la pagina recuperar contraseña
                window.location.href = 'recup_password';
            }
        });

    });
}

async function subirImagen(file) {
    try {
        // Crear una instancia de FormData para enviar el archivo
        const formData = new FormData();
        formData.append('file', file);

        // Construir la URL para la solicitud POST
        const url = `http://localhost:8080/api/v1/usuarios/imagen`;

        const token = await obtenerToken();

        // Realizar la solicitud POST usando fetch
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}` // Agregar el token de autenticación en los headers
            }
        });

        // Verificar si la solicitud fue exitosa
        if (!response.ok) {
            if (response.status === 403) {
                Swal.fire({
                    icon: 'error',
                    title: 'La imagen es demasiado grande.',
                    text: `Por favor, selecciona una imagen mas ligera`,
                });
            } else {
                //throw new Error('Error al subir la imagen');
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `Error de red al subir la imagen: ${error.message}`,
                });
            }
        }

        // Obtener la URL de la imagen del cuerpo de la respuesta
        const urlImagen = await response.text();
        console.log('URL de la imagen:', urlImagen);

        // Retornar la URL de la imagen
        return urlImagen;
    } catch (error) {
        console.error('Error:', error.message);
    }
}


function seleccionarImagen() {
    // Seleccionar el campo de entrada de archivo y el elemento img
    const inputImagenPerfil = document.getElementById('inputImagenPerfil');
    const previewImagenPerfil = document.getElementById('previewImagenPerfil');
    const cajaImgPerfil = document.getElementById('cajaImgPerfil');

    // Escuchar el evento change en el campo de entrada de archivo
    inputImagenPerfil.addEventListener('change', function () {
        // Verificar si se seleccionó algún archivo
        if (inputImagenPerfil.files && inputImagenPerfil.files[0]) {
            // Crear un objeto URL para la imagen seleccionada
            const reader = new FileReader();
            reader.onload = function (e) {
                // Mostrar la imagen seleccionada en el elemento img
                previewImagenPerfil.src = e.target.result;
                cajaImgPerfil.style.display = 'inline-block'; // Mostrar el elemento div de la imagen 
                previewImagenPerfil.style.display = 'block'; // Mostrar el elemento img

            };
            reader.readAsDataURL(inputImagenPerfil.files[0]); // Leer el archivo como una URL
            fileImagen = inputImagenPerfil.files[0];
        } else {
            // Si no se seleccionó ningún archivo, ocultar el elemento img
            previewImagenPerfil.src = '#';
            cajaImgPerfil.style.display = 'none';
            previewImagenPerfil.style.display = 'none';
        }
    });
}


document.addEventListener("DOMContentLoaded", async function () {

    seleccionarImagen();

    // Obtenemos la informacion del usuario logueado
    const datosUsuario = await obtenerInfoUser.obtenerDatosUser();

    console.log("el objeto Datos usuario recibido del usaurio es --->" + datosUsuario);

    // Utilizamos esta funcion para cargar el nombre del usuario en el elemento nombre del menu lateral
    obtenerInfoUser.cargarDatosPerfilUser(datosUsuario);

    // Aqui llamo a actualizar perfil
    actualizarPerfil(datosUsuario);

    cambiarContrasena();
});