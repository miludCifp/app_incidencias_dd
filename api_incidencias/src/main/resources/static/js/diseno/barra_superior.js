import * as manejadorToken from '../manejador_token.js';

document.addEventListener("DOMContentLoaded", async function () {
    // Crear la barra superior
    var navbar = document.createElement("nav");
    navbar.className = "sb-topnav navbar navbar-expand navbar-dark bg-dark";

    // Crear el enlace del Navbar Brand
    var navbarBrand = document.createElement("a");
    navbarBrand.className = "navbar-brand ps-3";
    navbarBrand.href = "inicio.html";
    navbarBrand.textContent = "Gestor incidencias";

    // Crear el botón de Sidebar Toggle
    var sidebarToggle = document.createElement("button");
    sidebarToggle.className = "btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0";
    sidebarToggle.id = "sidebarToggle";
    sidebarToggle.href = "#";
    sidebarToggle.innerHTML = '<i class="fas fa-bars"></i>';

    // Crear la lista de elementos del Navbar Perfil user
    var navbarUserList = document.createElement("ul");
    navbarUserList.className = "navbar-nav ms-auto mb-0 mb-lg-0";

    // Crear el elemento de dropdown
    var dropdown = document.createElement("li");
    dropdown.className = "nav-item dropdown";

    // Crear el enlace del dropdown
    var dropdownLink = document.createElement("a");
    dropdownLink.className = "nav-link dropdown-toggle";
    dropdownLink.id = "navbarDropdown";
    dropdownLink.href = "#";
    dropdownLink.setAttribute("role", "button");
    dropdownLink.setAttribute("data-bs-toggle", "dropdown");
    dropdownLink.setAttribute("aria-expanded", "false");
    dropdownLink.innerHTML = '<i class="fas fa-user fa-fw"></i>';

    // Crear la lista desplegable del dropdown
    var dropdownMenu = document.createElement("ul");
    dropdownMenu.className = "dropdown-menu dropdown-menu-end";
    dropdownMenu.setAttribute("aria-labelledby", "navbarDropdown");

    // Agregar los elementos a la lista desplegable del dropdown
    dropdownMenu.innerHTML = `
        <li><a class="dropdown-item" href="ajustes_perfil_user">Mi perfil</a></li>
        <!-- <li><a class="dropdown-item" href="#!">Registro de actividades</a></li> -->
        <li><hr class="dropdown-divider" /></li>
        <li><button class="dropdown-item" id="btn_cerrar_session_slidebar">Cerrar sesión</button></li>
    `;

    // Agregar elementos al DOM
    dropdown.appendChild(dropdownLink);
    dropdown.appendChild(dropdownMenu);
    navbarUserList.appendChild(dropdown);

    navbar.appendChild(navbarBrand);
    navbar.appendChild(sidebarToggle);
    navbar.appendChild(navbarUserList);

    // Insertar la barra superior en el documento
    document.body.insertBefore(navbar, document.body.firstChild);

    // Agregar el event listener para el botón de cerrar sesión
    document.getElementById("btn_cerrar_session_slidebar").addEventListener("click", function () {
        // Mostrar SweetAlert con la pregunta de confirmación
        Swal.fire({
            title: '¿Estás seguro de que deseas cerrar la sesión?',
            text: 'La sesión actual se cerrará',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, Salir',
            cancelButtonText: 'No, Cancelar'
        }).then((result) => {
            // Si el usuario confirma
            if (result.isConfirmed) {
                // Distruyemos el token actual
                manejadorToken.removeToken();

                // Redireccionar a la página de inicio después de cerrar sesión
                window.location.href = "login";
            }
        });
    });


});
