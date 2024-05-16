

/*
comboTipoDoc
inputDoc
comboGenero
inputName
inputFirstName
inputLastName
inputEmail
inputPassword
inputPasswordConfirm
inputTlfn
inputCiudad
inputCalle
inputProvincia
inputPostalCode
comboPais
----------------
errorMsgInputDoc
errorMsgInputEmail
errorMsgPasswd
errorMsgConfirmPasswd
errorMsgTlfn
errorMsgCiudad
errorMsgCalle
errorMsgProvincia
errorMsgCp
errorMsgPais
*/



function validarCampos(tipoDoc, doc, email, passwd, confirmPasswd, tlfn, ciudad, calle, provincia, cp, pais) {
    var msgErrInputDoc = document.getElementById("errorMsgInputDoc");
    var msgErrEmail = document.getElementById("errorMsgInputEmail");
    var msgErrPasswd = document.getElementById("errorMsgPasswd");
    var msgErrConfirmPasswd = document.getElementById("errorMsgConfirmPasswd");
    var msgErrTlfn = document.getElementById("errorMsgTlfn");
    var msgErrCiudad = document.getElementById("errorMsgCiudad");
    var msgErrCalle = document.getElementById("errorMsgCalle");
    var msgErrProvincia = document.getElementById("errorMsgProvincia");
    var msgErrCp = document.getElementById("errorMsgCp");
    var msgErrPais = document.getElementById("errorMsgPais");

    // Ocultamos los mensajes de error si estaban visibles
    msgErrInputDoc.style.display = "none";
    msgErrEmail.style.display = "none";
    msgErrPasswd.style.display = "none";
    msgErrConfirmPasswd.style.display = "none";
    msgErrTlfn.style.display = "none";
    msgErrCiudad.style.display = "none";
    msgErrCalle.style.display = "none";
    msgErrProvincia.style.display = "none";
    msgErrCp.style.display = "none";
    msgErrPais.style.display = "none";


    const dniValido = /^\d{8}[A-Z]$/;
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


    if (doc === '') {
        msgErrInputDoc.style.display = "block";
        msgErrInputDoc.textContent = 'El documento es obligatorio';
        return false;
    } else if (tipoDoc === 'dni' && !(dniValido.test(doc))) {
        msgErrInputDoc.style.display = "block";
        msgErrInputDoc.textContent = 'DNI no valido. Formato admitido: 12345678A';
        return false;
    } else if (tipoDoc === 'nie' && !(nieValido.test(doc))) {
        msgErrInputDoc.style.display = "block";
        msgErrInputDoc.textContent = 'NIE no valido. Formato admitido: A1234567A';
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


    if (tlfn === '') {
        msgErrTlfn.style.display = "block";
        msgErrTlfn.textContent = 'El telefono es obligatorio';
        return false;
    } else if (tlfn.length !== 9) {
        msgErrTlfn.style.display = "block";
        msgErrTlfn.textContent = 'El telefono debe tener 9 numeros';
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

    if (calle === '') {
        msgErrCalle.style.display = "block";
        msgErrCalle.textContent = 'La calle es obligatoria';
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

    return true;

}

async function registrarTrabajador() {

    const tipoDocumento = document.getElementById('comboTipoDoc').value;
    const documento = document.getElementById('inputDoc').value;
    const genero = document.getElementById('comboGenero').value;
    const nombre = document.getElementById('inputName').value;
    const apellidos = document.getElementById('inputFirstName').value + " " + document.getElementById('inputLastName').value;
    const email = document.getElementById('inputEmail').value;
    const passwd = document.getElementById('inputPassword').value;
    const confirmPasswd = document.getElementById('inputPasswordConfirm').value;
    const tlfn = document.getElementById('inputTlfn').value;
    const ciudad = document.getElementById('inputCiudad').value;
    const calle = document.getElementById('inputCalle').value;
    const provincia = document.getElementById('inputProvincia').value;
    const codigoPostal = document.getElementById('inputPostalCode').value;
    const pais = document.getElementById('comboPais').value;


    if (validarCampos(tipoDocumento, documento, email, passwd, confirmPasswd, tlfn, ciudad, calle, provincia, codigoPostal, pais)) {
        const url = 'http://localhost:8080/auth/registrar-cliente';

        const data = {
            tipoDocumento: tipoDocumento,
            documento: documento,
            genero: genero,
            nombre: nombre,
            apellido: apellidos,
            correoElectronico: email,
            contrasena: passwd,
            telefono: tlfn,
            calle: calle,
            ciudad: ciudad,
            provincia: provincia,
            codigoPostal: codigoPostal,
            pais: pais
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            //token
            const responseData = await response.json();

            Swal.fire({
                icon: 'success',
                title: '¡Registro exitoso!',
                text: 'Ya tienes tu cuenta creada',
            });
            console.log('Trabajador registrado exitosamente:', responseData);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Error de red: ${error.message}`,
            });
            console.error('Error de red:', error.message);
        }
    }

}


document.addEventListener('DOMContentLoaded', () => {
    const btnRegistrarse = document.querySelector('#btnCrearCuenta');

    if (btnRegistrarse) {
        btnRegistrarse.addEventListener('click', async function (event) {
            event.preventDefault();

            await registrarTrabajador();
        });
    } else {
        console.error('Botón no encontrado');
    }
});

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

// Event Listener para el campo de contraseña
document.addEventListener('DOMContentLoaded', () => {

    // Verificar seguridad y mostrar medidor de fuerza
    var passwordInput = document.getElementById('inputPassword');
    if (passwordInput) {
        passwordInput.addEventListener('input', function () {
            mostrarStrengthMeter();
            verificarSeguridad();
        });
    } else {
        console.error('Campo de contraseña no encontrado');
    }

    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});