import * as manejadorToken from './manejador_token.js';

// Declarar la variable globalmente
var codigo;

function obtenerToken() {
    return manejadorToken.getToken();
}

function validarCorreoElectronico(correo) {
    // Expresión regular para validar el formato del correo electrónico
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(correo);
}

async function enviarCorreo(correo) {
    try {
        const url = `http://localhost:8080/api/v1/usuarios/codigo-contraseña/${correo}`;
        const response = await fetch(url, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('Error al solicitar el código');
        }
        const data = await response.json();
        console.log("Datos del código:", data);

        return data;
    } catch (error) {
        console.error(error);
    }
}


function pasarToCodVerificacion() {

    // Escuchar el evento submit del formulario
    document.getElementById("emailRecupPasswdForm").addEventListener("submit", function (event) {
        event.preventDefault(); // Evitar el comportamiento predeterminado de enviar el formulario

        // Obtener el valor del campo de correo electrónico
        var txtEmailRecup = document.getElementById("inputEmail").value.trim();

        
        var msgErrEmail = document.getElementById("errorMsgEmail");
        // Ocultamos el mensaje si estaba visible
        msgErrEmail.style.display = "none";

        if (txtEmailRecup === "") {
            console.log("Por favor, ingresa tu dirección de correo electrónico.");
            msgErrEmail.style.display = "block";
            msgErrEmail.textContent = 'Por favor, ingresa tu dirección de correo electrónico.';

        } else if (!validarCorreoElectronico(txtEmailRecup)) {
            console.log("correo No valido");
            msgErrEmail.style.display = "block";
            msgErrEmail.textContent = 'Por favor, ingresa un correo electrónico válido.';

        } else {
            console.log("Grande, correo valido");

            // Enviamos el correo
            enviarCorreo(txtEmailRecup);

            // Ocultar el formulario de recuperación de contraseña
            document.getElementById('emailRecupPasswdForm').style.display = "none";

            // Mostrar el formulario de código de verificación
            document.getElementById("codVerificacionForm").style.display = "block";


        }

    });
}


function pasarToNuevaContrasena() {
    // Escuchar el evento submit del formulario
    document.getElementById("codVerificacionForm").addEventListener("submit", function (event) {
        event.preventDefault(); // Evitar el comportamiento predeterminado de enviar el formulario

        // Obtener el valor del campo de correo electrónico
        codigo = document.getElementById("inputCodVerificacion").value.trim();

        
        var errorMsgVerifyCod = document.getElementById('errorMsgVerifyCod');
        // Ocultamos el mensaje de error si estaba visible
        errorMsgVerifyCod.style.display = "none";

        if (codigo === "") {
            console.log("no hay ningun codigo introducido");
            errorMsgVerifyCod.style.display = "block";
            errorMsgVerifyCod.textContent = 'Por favor, ingresa el codigo de verificación.';

        } else if (codigo.length !== 6) {
            console.log("codigo No valido");
            errorMsgVerifyCod.style.display = "block";
            errorMsgVerifyCod.textContent = 'Codigo de verificación no valido, la longitud debe ser de 6 caracteres';

        } else {
            console.log("Grande, codigo valido");

            // validamos el codigo
            //validarCodVerificacion(txtCodVerificacion);

            // Ocultar el formulario de recuperación de contraseña
            document.getElementById('codVerificacionForm').style.display = "none";

            // Mostrar el formulario de código de verificación
            document.getElementById("nuevaContrasenaForm").style.display = "block";


        }

    });
}

function validarContraseña(txtPasswd, txtConfirmPasswd) {
    var msgErrPasswd = document.getElementById('errorMsgPasswd');
    var msgErrConfirmPasswd = document.getElementById('errorMsgConfirmPasswd');

    // Ocultamos el mensaje si estaba visible
    msgErrPasswd.style.display = "none";
    msgErrConfirmPasswd.style.display = "none";

    const contrasenaValida = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_+=]).{8,}$/;
    var criteriosContrasena = "La contraseña debe cumplir con los siguientes criterios de seguridad:\n\
    - Al menos 8 caracteres.\n\
    - Al menos una letra mayúscula.\n\
    - Al menos una letra minúscula.\n\
    - Al menos un dígito numérico.\n\
    - Al menos un carácter especial (por ejemplo, !@#$%^&*()-_+=).";

    if (txtPasswd === '') {
        msgErrPasswd.style.display = "block";
        msgErrPasswd.textContent = 'La contraseña es obligatoria';
        return false;
    } else if (txtConfirmPasswd === '') {
        msgErrConfirmPasswd.style.display = "block";
        msgErrConfirmPasswd.textContent = 'Por favor, repite la contraseña';
        return false;
    } else if (!contrasenaValida.test(txtPasswd)) {
        msgErrPasswd.style.display = "block";
        msgErrPasswd.textContent = 'La contraseña no cumple con los criterios de seguridad';
        return false;
    } else if (txtPasswd !== txtConfirmPasswd) {
        //msgErrConfirmPasswd.style.display = "block";
        //msgErrConfirmPasswd.textContent = 'Las contraseñas no coinciden';
        console.log("Las contraseñas no coinciden");

        Swal.fire({
            title: "Las contraseñas no son iguales.",
            icon: "warning"
        });
        return false;
    }

    return true;
}

async function cambiarContrasena() {

    // Escuchar el evento submit del formulario
    document.getElementById("nuevaContrasenaForm").addEventListener("submit", async function (event) {
        event.preventDefault(); // Evitar el comportamiento predeterminado de enviar el formulario


        var txtNewPasswd = document.getElementById("inputNewPasswd").value.trim();

        var txtConfirmPasswd = document.getElementById("inputConfirmPasswd").value.trim();

        var codigo = document.getElementById("inputCodVerificacion").value.trim();


        // Validamos los campos de la contraseña nueva
        if (validarContraseña(txtNewPasswd, txtConfirmPasswd)) {
            // Procedemos a cambiar la contraseña despues de validarla
            try {
                const url = `http://localhost:8080/api/v1/usuarios/cambiar-contraseña/${codigo}`;
                const response = await fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: txtNewPasswd
                });

                if (!response.ok) {
                    throw new Error('Error al cambiar la contraseña');
                }

                const data = await response.text();
                console.log("Respuesta del servidor:", data);
                Swal.fire({
                    icon: 'success',
                    title: '¡Contraseña ha sido cambiada correctamente!',
                    text: 'Ya puedes inciar sesion con tu nueva contraseña',
                    onClose: function () {
                        window.location.href = 'login';
                    }
                });

                return data;
            } catch (error) {
                console.error(error);
            }

        }



    });


}


function verificarSeguridad() {
    const password = document.getElementById('inputNewPasswd').value;
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
    const passwordInput = document.getElementById('inputNewPasswd');
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

// Llamamos a las funciónes cuando se cargue el DOM
document.addEventListener('DOMContentLoaded', async function () {
    pasarToCodVerificacion();
    pasarToNuevaContrasena();
    await cambiarContrasena();
});

document.addEventListener("DOMContentLoaded", function () {
    /*
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
    */

    // Verificar seguridad y mostrar medidor de fuerza
    var passwordInput = document.getElementById('inputNewPasswd');
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
