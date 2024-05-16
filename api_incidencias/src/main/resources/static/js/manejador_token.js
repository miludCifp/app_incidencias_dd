export function setToken(token) {
    localStorage.setItem('token', token);
}

export function getRoleFromToken(token) {
    const payload = JSON.parse(atob(token.split('.')[1]));  // Decodificar la parte del payload del token
    return payload.rol;  // Obtener el rol del payload
}

export function getToken() {
    return localStorage.getItem('token');
}

export function removeToken() {
    localStorage.removeItem('token');
}

export function getIdFromToken(token) {
    const payload = JSON.parse(atob(token.split('.')[1]));  // Decodificar la parte del payload del token
    return payload.id;  // Obtener el id del payload
}

function checkTokenExpiration() {
    // Obtener la fecha de expiración del token (suponiendo que está almacenada en una variable llamada tokenExpiration)
    var tokenExpiration = new Date(localStorage.getItem('tokenExpiration'));

    // Obtener la fecha y hora actual
    var now = new Date();

    // Calcular la diferencia en milisegundos entre la fecha de expiración y la fecha actual
    var timeDiff = tokenExpiration.getTime() - now.getTime();

    // Convertir la diferencia de tiempo a días
    var daysDiff = timeDiff / (1000 * 3600 * 24);

    // Si quedan menos de 7 días para que el token caduque, solicitar un nuevo token
    if (daysDiff < 1) {
        // Aquí puedes llamar a una función para solicitar un nuevo token
        // Por ejemplo:
        // requestNewToken();
        removeToken();
        window.location.href = "app_trabajador/login";
    }
}

// Ejecutar la función cada cierto intervalo de tiempo (por ejemplo, cada hora)
setInterval(checkTokenExpiration, 3600000); // 3600000 milisegundos = 1 hora