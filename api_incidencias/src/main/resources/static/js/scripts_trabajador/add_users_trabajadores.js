import * as manejadorToken from '/js/manejador_token.js';

// Función para obtener el token
function obtenerToken() {
    return manejadorToken.getToken();
}

// Función para registrar un usuario trabajador en la base de datos mediante el método POST
async function registrarUserTrabajador() {
    // Escuchar el evento submit del formulario
    document.getElementById("addUserTrabajadorForm").addEventListener("submit", async function (event) {
        event.preventDefault(); // Evitar el comportamiento predeterminado de enviar el formulario

        // Recoger los datos de los campos
        var tipoDoc = document.getElementById("comboTipoDoc").value;
        var documento = document.getElementById("inputDoc").value.trim();
        var rolUser = document.getElementById("comboRol").value;
        var generoUser = document.getElementById("comboGenero").value;
        var nombreUser = document.getElementById("inputNombre").value.trim();
        var apellidosUser = document.getElementById("inputApellidos").value.trim();
        var tlfnUser = document.getElementById("inputTlfn").value.trim();
        var emailUser = document.getElementById("inputEmail").value.trim();
        var passwdUser = document.getElementById("inputPassword").value.trim();
        var confirmPasswd = document.getElementById("inputPasswdConfirm").value.trim();



        if (validarCamposUserTrabajador(tipoDoc, documento, nombreUser, apellidosUser, tlfnUser, emailUser, passwdUser, confirmPasswd, rolUser)) {
            // Obtener el token
            const token = await obtenerToken();

            // Construir el objeto de usuario para enviarlo al servidor
            const objetoUser = {
                tipoDocumento: tipoDoc,
                documento: documento,
                genero: generoUser,
                nombre: nombreUser,
                apellido: apellidosUser,
                correoElectronico: emailUser,
                contrasena: passwdUser,
                telefono: tlfnUser,
                rol: rolUser,
            };

            // URL para la solicitud POST
            const urlPost = 'http://localhost:8080/auth/registrar-trabajador';

            try {
                const response = await fetch(urlPost, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Incluir el token en los headers
                    },
                    body: JSON.stringify(objetoUser),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                // Parsear la respuesta
                const responseData = await response.json();

                // Mostrar mensaje de éxito
                Swal.fire({
                    icon: 'success',
                    title: '¡Usuario trabajador creado con éxito!',
                    text: 'Puedes consultar los usuarios en boton Gestionar usuarios',
                    onClose: function () {
                        // Redirigir a la página ver_partes_trabajo.html
                        window.location.href = 'gestion_users_trabajadores';
                    }
                });
                console.log('Trabajador registrado exitosamente:', responseData);
            } catch (error) {
                // Manejar errores
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `Error de red: ${error.message}`,
                });
                console.error('Error de red:', error.message);
            }
        }

    });
}


function validarCamposUserTrabajador(tipoDoc, doc, nombre, apellidos, tlfn, email, passwd, confirmPasswd, rol) {

    // Obtener los div de los mensajes de error
    var msgErrInputDoc = document.getElementById('errorMsgDoc');
    var msgErrTlfn = document.getElementById('errorMsgTlfn');
    var msgErrEmail = document.getElementById('errorMsgEmail');
    var msgErrPasswd = document.getElementById('errorMsgPasswd');
    var msgErrConfirmPasswd = document.getElementById('errorMsgConfirmPasswd');
    var msgErrRol = document.getElementById('errorMsgRol');

    // Ocultamos los mensajes de error si estaban visibles
    msgErrInputDoc.style.display = "none";
    msgErrTlfn.style.display = "none";
    msgErrEmail.style.display = "none";
    msgErrPasswd.style.display = "none";
    msgErrConfirmPasswd.style.display = "none";
    msgErrRol.style.display = "none";



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

    if (passwd === '') {
        msgErrPasswd.style.display = "block";
        msgErrPasswd.textContent = 'La contraseña es obligatoria';
        return false;
    } else if (confirmPasswd === '') {
        msgErrConfirmPasswd.style.display = "block";
        msgErrConfirmPasswd.textContent = 'Por favor, repite la contraseña';
        return false;
    } else if (!contrasenaValida.test(passwd)) {
        msgErrPasswd.style.display = "block";
        msgErrPasswd.textContent = 'La contraseña no cumple con los criterios de seguridad';
        return false;
    } else if (passwd !== confirmPasswd) {
        msgErrConfirmPasswd.style.display = "block";
        msgErrConfirmPasswd.textContent = 'Las contraseñas no coinciden';
        return false;
    }

    if (rol === 'sinRol') {
        msgErrRol.style.display = "block";
        msgErrRol.textContent = 'Por favor, selecciona un rol';
        return false;
    }

    // Devolver true si todos los campos son válidos
    return true;
}


function verificarSeguridad() {
    const password = document.getElementById('inputPassword').value;
    const strengthMeter = document.querySelector('#strength-meter .strength-bar');

    // Verificar la fortaleza de la contraseña
    const strength = calcularFortaleza(password);

    // Establecer los colores y tamaños de la barra de colores según la fortaleza de la contraseña
    switch (strength) {
        case 0:
            strengthMeter.style.backgroundColor = '#cccccc';
            strengthMeter.style.width = '20%';
            break;
        case 1:
            strengthMeter.style.backgroundColor = '#ff3333';
            strengthMeter.style.width = '40%';
            break;
        case 2:
            strengthMeter.style.backgroundColor = '#ff9933';
            strengthMeter.style.width = '60%';
            break;
        case 3:
            strengthMeter.style.backgroundColor = '#33cc33';
            strengthMeter.style.width = '80%';
            break;
        case 4:
            strengthMeter.style.backgroundColor = '#3399ff';
            strengthMeter.style.width = '100%';
            break;
    }
}

function calcularFortaleza(password) {
    let score = 0;
    if (!password) {
        return score;
    }

    // Verificar longitud mínima
    if (password.length >= 8) {
        score++;
    }

    // Verificar letras mayúsculas y minúsculas
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
        score++;
    }

    // Verificar números
    if (/\d/.test(password)) {
        score++;
    }

    // Verificar caracteres especiales
    if (/[!@#$%^&*()\-_=+{};:,<.>]/.test(password)) {
        score++;
    }

    return score;
}

function mostrarStrengthMeter() {
    const passwordInput = document.getElementById('inputPassword');
    const contIconoAndBarra = document.getElementById('contIconoAndBarra');
    const msgErrorPasswd = document.getElementById('errorMsgPasswd');

    if (passwordInput.value.trim() !== '') {
        // Si el campo de contraseña no está vacío, mostrar la barra de fuerza de la contraseña
        contIconoAndBarra.style.display = 'flex';
        // Ocultamos el mensaje de error
        msgErrorPasswd.style.display = 'none';
    } else {
        // Si el campo de contraseña está vacío, ocultar la barra de fuerza de la contraseña
        contIconoAndBarra.style.display = 'none';
    }
}

document.addEventListener("DOMContentLoaded", async function () {
    await registrarUserTrabajador();
});

document.addEventListener("DOMContentLoaded", function () {
    // Mostrar/Ocultar contraseña
    document.getElementById('showPasswordBtn').addEventListener('click', function () {
        var passwordField = document.getElementById('inputPassword');
        var passwordFieldType = passwordField.getAttribute('type');
        passwordField.setAttribute('type', passwordFieldType === 'password' ? 'text' : 'password');
    });

    // Mostrar/Ocultar confirmar contraseña
    document.getElementById('showConfirmPasswordBtn').addEventListener('click', function () {
        var confirmPasswdField = document.getElementById('inputPasswdConfirm');
        var confPasswdFieldType = confirmPasswdField.getAttribute('type');
        confirmPasswdField.setAttribute('type', confPasswdFieldType === 'password' ? 'text' : 'password');
    });


    // Verificar seguridad y mostrar medidor de fuerza
    var passwordInput = document.getElementById('inputPassword');
    if (passwordInput) {
        passwordInput.addEventListener('input', function () {
            mostrarStrengthMeter();
            verificarSeguridad();
        });
    }

    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});