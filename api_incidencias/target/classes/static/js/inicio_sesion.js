import * as manejadorToken from '/js/manejador_token.js';

async function iniciarSesion() {
    const txtEmail = document.getElementById('inputEmail').value;
    const txtPassword = document.getElementById('inputPassword').value;

    if (txtEmail && txtPassword) {
        const url = 'http://localhost:8080/auth/login';

        const data = {
            correoElectronico: txtEmail,
            contrasena: txtPassword
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
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `Datos erroneos`,
                });
                throw new Error(`HTTP error! Status: ${response.status}`);
                
            }
    
            //token
            const responseData = await response.json();
            manejadorToken.setToken(responseData.token);
    
            // Mostrar alerta de éxito
            Swal.fire({
                icon: 'success',
                title: '¡Inicio de sesión exitoso!',
                text: 'Sesión iniciada correctamente',
            }).then((result) => {
                if (result.isConfirmed || result.isDismissed) {
                    setTimeout(() => {
                        // Obtenemos el rol del usuario logueado
                        const token = manejadorToken.getToken();
                        const rolUser = manejadorToken.getRoleFromToken(token);
                        console.log('rol user es ---->'+rolUser);
                        // Comprobamos el rol y mandamos la pagina de inicio desde el controlador correspondiente
                        if(rolUser === 'administrador'){
                            window.location.href = 'app_trabajador/inicio'; // Cambia 'nueva_pagina.html' por la ruta de tu nueva página
                        }else if(rolUser === 'tecnico'){
                            window.location.href = 'app_tecnico/inicio';
                        }else if(rolUser === 'cliente'){
                            window.location.href = 'app_cliente/inicio';
                        }

                    }, 1000); // 1 segundo
                }
            });
    
            console.log('Inicio de sesión exitoso:', responseData);
            //pruebas    
            console.log('getToken: ', manejadorToken.getToken());
            console.log('getRol: ', manejadorToken.getRoleFromToken(manejadorToken.getToken()));
        } catch (error) {
            // Mostrar alerta de error

            /*
            // Inicializar el código de error
            let codeError = 'SIN_CODIGO';
            // Verificar si es un error HTTP
            if (error.message.includes('Status')) {
                codeError = error.message.split(': ')[1]; // Obtener el código de estado HTTP
                console.log('Obtener el código de estado HTTP es ----> '+codeError);
            } else if (error.code) {
                codeError = error.code; // Usar el código de error si está disponible
                console.log('El codigo de error sacado es ----> '+codeError);
            }
            */

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Error de red. `+error.message,
                /*
                willClose: function () {
                    // Redirigir a la página de error correspondiente
                    if(codeError === '401'){
                        window.location.href = 'error_401';
                    }else if(codeError === '403'){
                        window.location.href = 'error_404';
                    }else if(codeError === 500){
                        window.location.href = 'error_500';
                    }
                }
                */

            });
            
            console.error('Error de red:', error.message);
        }

    }else{
        Swal.fire("Por favor, rellena los campos");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const btnIniciarSesion = document.querySelector('#btnIniciarSesion');

    if (btnIniciarSesion) {
        btnIniciarSesion.addEventListener('click', async function (event) {
            event.preventDefault();
            await iniciarSesion();
        });
    } else {
        console.error('Botón de iniciar sesión no encontrado');
    }
});