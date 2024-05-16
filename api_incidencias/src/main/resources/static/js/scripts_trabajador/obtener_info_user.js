import * as manejadorToken from '../manejador_token.js';

let datosUsuario = null; // Variable para almacenar los datos del usuario

function obtenerToken() {
    return manejadorToken.getToken();
}

function obtenerIDUser(token) {
    return manejadorToken.getIdFromToken(token);
}

// Función para hacer la petición GET al servidor para obtener la informacion del usuario loguedo
export async function obtenerDatosUser() {
    if (!datosUsuario) {
        try {
            const token = await obtenerToken();
            const response = await fetch('http://localhost:8080/api/v1/trabajadores/' + obtenerIDUser(token), {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al obtener la información del usuario');
            }

            datosUsuario = await response.json(); // Almacenar los datos del usuario una vez obtenidos
        } catch (error) {
            console.error(error);
        }
    }

    return datosUsuario;
}

// Esta funcion extrae el nombre del usuario del objeto devuelto por el servidor y lo carga en el elemento HTML correspondiente.
export function cargarNombreUser(objetoDatosUser) {
    try {
        // Extraer el nombre de usuario del objeto JSON
        var nombreUsuario = objetoDatosUser.nombre;

        // Actualizar el contenido del elemento HTML con el nombre de usuario
        const textUsername = document.getElementById("txt_username");

        console.log("Elemento nombre user ---> "+textUsername);
        if (textUsername) {
            textUsername.textContent = nombreUsuario;
        }
        

    } catch (error) {
        console.error("Error al cargar el nombre de usuario:", error);
    }
}

export async function cargarImgUser(){
    try {
        const token = await obtenerToken(); // Suponiendo que tienes una función para obtener el token de autorización
        const response = await fetch('http://localhost:8080/api/v1/usuarios/obtener-imagen-user', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener la imagen del usuario');
        }

        // Si la respuesta es exitosa, obtenemos los datos como un blob (tipo de datos binarios)
        const blob = await response.blob();

        // Creamos una URL del objeto blob para mostrar la imagen en el frontend
        const imageUrl = URL.createObjectURL(blob);

        // Cargamos la imagen del perfil en el formulario Ajuste de perfil
        cargarImgPerfilForm(imageUrl);


        // Aquí puedes hacer lo que necesites con la URL de la imagen, como mostrarla en una etiqueta <img>
        console.log('URL de la imagen del usuario:', imageUrl);

        return imageUrl; // Retorna la URL de la imagen
    } catch (error) {
        console.error(error);
    }    
}

// Esta funcion va a leer la imagen del user guardada en el servidor y la cargara en el elemento HTML correspondiente.
function cargarImgPerfilForm(imageUrl){
    // Verificar si las variables están inicializadas
    if (!imageUrl) {
        console.error("La variable imageUrl no está inicializada.");
        return; // Salir del método si la variable no está inicializada
    }

    var previewImagenPerfil = document.getElementById('previewImagenPerfil');
    var cajaImgPerfil = document.getElementById('cajaImgPerfil');

    // Verificar si los elementos HTML están disponibles
    if (!previewImagenPerfil || !cajaImgPerfil) {
        console.error("No se encontraron los elementos HTML necesarios.");
        return; // Salir del método si los elementos no están disponibles
    }

    // Mostrar el div de la imagen y el elemento img
    cajaImgPerfil.style.display = 'inline-block'; // Mostrar el elemento div de la imagen 
    previewImagenPerfil.style.display = 'block'; 

    // Aquí leer la imagen del servidor y cargarla en el elemento previewImagenPerfil.
    previewImagenPerfil.src = imageUrl;
}


// Esta funcion carga los datos del usuario en el formulario Perfil
export function cargarDatosPerfilUser(objetoDatosUser) {
    try {
        // Verificar si la información del usuario está disponible
        if (!objetoDatosUser) {
            console.error("No se pudo obtener la información del usuario.");
            return;
        }

        // Extraer los datos del usuario del objeto JSON
        let imagenPerfil = objetoDatosUser.imagenPerfil;
        console.log("Imagen de perfil del user es ----> "+imagenPerfil);

        let idUsuario = objetoDatosUser.idUsuario;
        let rolUsuario = objetoDatosUser.rol;
        let tipoDocUsuario = objetoDatosUser.tipoDocumento;
        let docUsuario = objetoDatosUser.documento;
        let generoUsuario = objetoDatosUser.genero;
        let nombreUsuario = objetoDatosUser.nombre;
        let apellidos = objetoDatosUser.apellido;
        let emailUsuario = objetoDatosUser.correoElectronico;
        let telefonoUsuario = objetoDatosUser.telefono;

        // Actualizar el contenido de los campos HTML con la info del usuario
        document.getElementById("inputIdUser").value = idUsuario || "";
        document.getElementById("inputRol").value = convertirRolToFrontend(rolUsuario) || "Sin rol";
        document.getElementById("comboTipoDoc").value = tipoDocUsuario || "";
        document.getElementById("inputDoc").value = docUsuario || "Sin documento";
        document.getElementById("comboGenero").value = generoUsuario || "";
        document.getElementById("inputNombre").value = nombreUsuario || "Sin nombre";
        document.getElementById("inputApellidos").value = apellidos || "Sin apellidos";
        document.getElementById("inputTelefono").value = telefonoUsuario || "";
        document.getElementById("inputEmail").value = emailUsuario || "";

        // Cargamos la imagen de perfil en el formulario en caso de tenerla
        //cargarImgPerfilForm();



        /*
        // Esta es información solo de clientes
        document.getElementById("inputCalle").value = calleUsuario;
        document.getElementById("inputCiudad").value = ciudadUsuario;
        document.getElementById("inputProvincia").value = provinciaUsuario;
        document.getElementById("inputCodigoPostal").value = codigoPostalUsuario;
        document.getElementById("inputPais").value = paisUsuario;
        */

    } catch (error) {
        console.error("Error al cargar la información de usuario:", error);
    }
}

// Función para transformar el rol obtenido de la tabla al formarto del desplegable
function convertirRolToFrontend(rol) {
    switch (rol) {
        case 'administrador':
            return 'Admin';
        case 'tecnico jefe':
            return 'Técnico Jefe';
        case 'tecnico':
            return 'Técnico';
        default:
            return null;
    }
}