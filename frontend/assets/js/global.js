/* ============================================================
   GLOBAL.JS — SISTEMA CENTRAL DE CONTROL
   - Cargar usuario actual
   - Cargar sidebar dinámico según rol
   - Activar botón del menú
   - Dropdown del usuario
   - Logout
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
    cargarUsuarioActual();
    cargarSidebar();
    activarMenuActual();
    inicializarDropdownUsuario();
    inicializarLogout();
});

/* ============================================================
   1. CARGAR USUARIO ACTUAL
   ============================================================ */
async function cargarUsuarioActual() {
    try {
        const res = await fetch("../backend/login/usuario_actual.php");
        const data = await res.json();

        if (!data.ok) {
            window.location.href = "../login/index.html";
            return;
        }

        // Mostrar nombre y rol en el panel
        document.querySelector(".sidebar-user h3").textContent = data.nombre;
        document.querySelector(".sidebar-user p").textContent = "Rol: " + data.rol;

        const topUsuario = document.getElementById("top-usuario");
        if (topUsuario) topUsuario.textContent = "Usuario: " + data.nombre;

    } catch (error) {
        console.error("Error cargando usuario:", error);
        window.location.href = "../login/index.html";
    }
}

/* ============================================================
   2. CARGAR SIDEBAR DINÁMICO SEGÚN ROL
   ============================================================ */
async function cargarSidebar() {
    try {
        const res = await fetch("../backend/seguridad/sidebar.php");
        const paginas = await res.json();

        const nav = document.querySelector(".sidebar-nav");
        nav.innerHTML = ""; // limpiar

        paginas.forEach(p => {
            const a = document.createElement("a");
            a.href = "../" + p.archivo;
            a.classList.add("nav-item");
            a.textContent = p.nombre;
            nav.appendChild(a);
        });

        activarMenuActual();

    } catch (error) {
        console.error("Error cargando sidebar:", error);
    }
}

/* ============================================================
   3. ACTIVAR EL BOTÓN DEL MENÚ SEGÚN LA PÁGINA ACTUAL
   ============================================================ */
function activarMenuActual() {
    const actual = window.location.pathname.split("/").pop();

    document.querySelectorAll(".nav-item").forEach(item => {
        if (item.href.includes(actual)) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });
}

/* ============================================================
   4. DROPDOWN DEL USUARIO
   ============================================================ */
function inicializarDropdownUsuario() {
    const userBlock = document.querySelector(".sidebar-user");
    const dropdown = document.querySelector(".user-dropdown");

    if (!userBlock || !dropdown) return;

    userBlock.addEventListener("click", () => {
        dropdown.classList.toggle("show");
    });

    // Cerrar si se hace click afuera
    document.addEventListener("click", (e) => {
        if (!userBlock.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove("show");
        }
    });
}

/* ============================================================
   5. LOGOUT
   ============================================================ */
function inicializarLogout() {
    const btnLogout = document.getElementById("btn-logout");
    if (!btnLogout) return;

    btnLogout.addEventListener("click", async () => {
        const res = await fetch("../backend/login/logout.php");
        const data = await res.json();

        if (data.ok) {
            window.location.href = "../login/index.html";
        }
    });
}
