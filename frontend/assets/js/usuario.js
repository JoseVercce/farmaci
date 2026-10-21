function getBackendBase() {
    return window.location.pathname.includes("/frontend/")
        ? "../../backend/"
        : "../backend/";
}

function getApiUrl(path) {
    return `${getBackendBase()}${path}`;
}

/* -------------------------------------------
   ACTIVAR ITEM DEL SIDEBAR SEGÚN LA RUTA
-------------------------------------------- */
function activarMenuActual() {
    // Obtener el módulo actual desde la URL
    const partes = window.location.pathname.split("/");
    const moduloActual = partes[partes.length - 2]?.toLowerCase(); // ejemplo: "productos"

    document.querySelectorAll(".nav-item, .nav-subitem").forEach((item) => {
        const href = item.getAttribute("href")?.toLowerCase() || "";

        // Extraer módulo del href
        const partesHref = href.split("/");
        const moduloHref = partesHref[partesHref.length - 2]?.toLowerCase();

        if (moduloHref === moduloActual) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });
}

/* -------------------------------------------
   MOSTRAR / OCULTAR MENÚ DEL USUARIO
-------------------------------------------- */
function inicializarMenuUsuario() {
    const btn = document.getElementById("sidebar-user-btn");
    const menu = document.getElementById("sidebar-user-menu");

    if (!btn || !menu) return;

    const alternarMenu = () => {
        menu.classList.toggle("show");
        menu.classList.toggle("hidden");
    };

    btn.addEventListener("click", alternarMenu);

    btn.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            alternarMenu();
        }
    });

    document.addEventListener("click", (event) => {
        if (!btn.contains(event.target) && !menu.contains(event.target)) {
            menu.classList.add("hidden");
            menu.classList.remove("show");
        }
    });
}

/* -------------------------------------------
   CARGAR DATOS DEL USUARIO
-------------------------------------------- */
async function cargarDatosUsuario() {
    try {
        const res = await fetch(getApiUrl("login/usuario_actual.php"));
        const data = await res.json();

        if (!data.ok) {
            localStorage.removeItem("usuarioActual");
            localStorage.removeItem("permisos_usuario");
            localStorage.removeItem("menu_usuario");

            const loginPath = window.location.pathname.includes("/frontend/")
                ? "../../login/index.html"
                : "../login/index.html";

            window.location.href = loginPath;
            return;
        }

        const usuario = data.usuario || {};

        localStorage.setItem("usuarioActual", JSON.stringify(usuario));
        if (data.permisos) localStorage.setItem("permisos_usuario", JSON.stringify(data.permisos));
        if (data.menu) localStorage.setItem("menu_usuario", JSON.stringify(data.menu));

        // Mostrar datos en el sidebar
        const nombre = document.getElementById("user-nombre");
        const rol = document.getElementById("user-rol");
        const img = document.querySelector(".sidebar-user-img");
        const welcome = document.getElementById("usor-nombro-welcome");

        if (nombre) nombre.textContent = usuario.nombre || "Usuario";

        if (rol) {
            const rolesTexto = (usuario.roles || []).map(r => r.nombre || r).join(", ");
            rol.textContent = rolesTexto || "Sin rol";
        }

        if (welcome) welcome.textContent = usuario.nombre || "Usuario";

        activarMenuActual();
        inicializarMenuUsuario();

    } catch (error) {
        console.error("Error cargando sesión:", error);
    }
}

/* -------------------------------------------
   CERRAR SESIÓN
-------------------------------------------- */
async function cerrarSesion() {
    try {
        await fetch(getApiUrl("login/logout.php"));
    } catch (error) {
        console.error("Error cerrando sesión:", error);
    }

    localStorage.removeItem("usuarioActual");
    localStorage.removeItem("permisos_usuario");
    localStorage.removeItem("menu_usuario");

    window.location.href = "/berti2/login/index.html";
}

window.cerrarSesion = cerrarSesion;
window.addEventListener("DOMContentLoaded", cargarDatosUsuario);
