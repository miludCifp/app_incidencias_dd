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
                        window.location.href = 'inicio'; // Cambia 'nueva_pagina.html' por la ruta de tu nueva página
                    }, 1000); // 1 segundo
                }
            });
    
            console.log('Inicio de sesión exitoso:', responseData);
            //pruebas    
            console.log('getToken: ', manejadorToken.getToken());
            console.log('getRol: ', manejadorToken.getRoleFromToken(manejadorToken.getToken()));
        } catch (error) {
            // Mostrar alerta de error
            
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Error de red. `+error.message,
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