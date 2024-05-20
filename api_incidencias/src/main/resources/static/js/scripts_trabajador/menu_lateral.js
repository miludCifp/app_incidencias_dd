import * as obtenerInfoUser from '../scripts_trabajador/obtener_info_user.js';
import * as manejadorToken from '../manejador_token.js';

document.addEventListener("DOMContentLoaded", async function () {

    // Crear el contenedor principal del menú lateral
    var layoutSidenav = document.createElement("div");
    layoutSidenav.id = "layoutSidenav";

    // Crear el contenedor del menú lateral
    var layoutSidenavNav = document.createElement("div");
    layoutSidenavNav.id = "layoutSidenav_nav";

    // Crear el elemento nav del menú lateral
    var navMenu = document.createElement("nav");
    navMenu.className = "sb-sidenav accordion sb-sidenav-dark";
    navMenu.id = "sidenavAccordion";

    // Crear el contenedor del menú
    var sbSidenavMenu = document.createElement("div");
    sbSidenavMenu.className = "sb-sidenav-menu";

    // Crear la lista de elementos del menú
    var navList = document.createElement("div");
    navList.className = "nav";

    // Agregar el contenido del menú
    navList.innerHTML = `
        <div class="sb-sidenav-user text-center" style="margin-bottom: 20px;">
            <img src="#" alt="img_perfil" width="100" height="100">
            <div id="txt_username" class="user-name" style="margin-top: 10px;">Nombre del Usuario</div>
        </div>
        <a class="nav-link" href="inicio">
            <div class="sb-nav-link-icon"><i class="fas fa-home"></i></div>
            Inicio
        </a>
        <a class="nav-link" href="ver_incidencias">
            <div class="sb-nav-link-icon"><i class="fas fa-eye"></i></div>
            Ver incidencias
        </a>
        <a class="nav-link" href="add_incidencias">
            <div class="sb-nav-link-icon"><i class="fas fa-plus-circle"></i></div>
            Registrar incidencia
        </a>
        <a class="nav-link" href="ver_partes_trabajo">
            <div class="sb-nav-link-icon"><i class="fas fa-file-alt"></i></div>
            Ver partes de trabajo
        </a>
        <a class="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#collapseAdmin"
            aria-expanded="false" aria-controls="collapseAdmin">
            <div class="sb-nav-link-icon"><i class="fas fa-tachometer-alt"></i></div>
            Administración
            <div class="sb-sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>
        </a>
        <div class="collapse" id="collapseAdmin" aria-labelledby="headingAdmin" data-bs-parent="#sidenavAccordion">
            <nav class="sb-sidenav-menu-nested nav">
                <a class="nav-link" href="add_user_trabajador">
                    <div class="sb-nav-link-icon"><i class="fas fa-user-plus"></i></div>
                    Añadir trabajador
                </a>
                <a class="nav-link" href="add_user_cliente">
                    <div class="sb-nav-link-icon"><i class="fas fa-user-plus"></i></div>
                    Añadir cliente
                </a>
                <a class="nav-link" href="gestion_users_trabajadores">
                    <div class="sb-nav-link-icon"><i class="fas fa-users-cog"></i></div>
                    Gestionar trabajadores
                </a>
                <a class="nav-link" href="gestion_users_clientes">
                    <div class="sb-nav-link-icon"><i class="fas fa-users-cog"></i></div>
                    Gestionar clientes
                </a>
            </nav>
        </div>
    `;

    // Crear el footer del menú lateral
    var sbSidenavFooter = document.createElement("div");
    sbSidenavFooter.className = "sb-sidenav-footer d-flex justify-content-center";
    sbSidenavFooter.innerHTML = '<button class="btn btn-danger" id="btn_cerrar_session_footer">Cerrar sesión</button>';

    // Agregar los elementos al DOM
    sbSidenavMenu.appendChild(navList);
    navMenu.appendChild(sbSidenavMenu);
    navMenu.appendChild(sbSidenavFooter);
    layoutSidenavNav.appendChild(navMenu);
    layoutSidenav.appendChild(layoutSidenavNav);

    // Insertar el menú lateral en el documento
    document.body.insertBefore(layoutSidenav, document.body.firstChild);

    // Agregar el event listener para el botón de cerrar sesión
    document.getElementById("btn_cerrar_session_footer").addEventListener("click", function () {
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


    /******************* Obtenemos la informacion del usuario logueado ************************/

    // Obtener el nombre de usuario del objeto de usuario
    const datosUsuario = await obtenerInfoUser.obtenerDatosUser();

    console.log("el objeto Datos usuario recibido del usaurio es --->" + datosUsuario);

    // Utilizamos esta funcion para cargar el nombre del usuario en el elemento nombre del menu lateral
    obtenerInfoUser.cargarNombreUser(datosUsuario);

    // Llamamos a la función para obtener la URL de la imagen del usuario
    obtenerInfoUser.cargarImgUser()
        .then(imageUrl => {
            // Actualizamos la fuente de la etiqueta <img> con la URL de la imagen obtenida
            const imgPerfil = document.querySelector('.sb-sidenav-user img');
            imgPerfil.src = imageUrl;

            // Opcional: También puedes cambiar el atributo alt de la imagen si lo necesitas
            imgPerfil.alt = 'Imagen de perfil';
        })
        .catch(error => {
            console.error('Error al cargar la imagen del usuario:', error);
        });


});

