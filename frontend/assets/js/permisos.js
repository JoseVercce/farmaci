(() => {
    const clasesPermiso = [
        ["Crear", ".btn-crear, .btn-nuevo, .btn-add, [id^='btn-nuevo'], [id^='btn-nueva'], [id^='btn-crear'], [id^='btn-agregar']"],
        ["Actualizar", ".btn-editar, .btn-update, .btn-transferir, .action-btn.edit, .action-btn.permiso"],
        ["Eliminar", ".btn-eliminar, .btn-delete, .action-btn.delete"]
    ];

    document.body.classList.add("permissions-pending");

    function asignarPermisosControles(root = document) {
        const elementos = [];
        if (root instanceof Element && root.matches("button, input, a")) {
            elementos.push(root);
        }
        if (root.querySelectorAll) {
            elementos.push(...root.querySelectorAll("button, input, a"));
        }

        elementos.forEach(elemento => {
            if (elemento.hasAttribute("data-permission")) return;

            const regla = clasesPermiso.find(([, selector]) => elemento.matches(selector));
            if (regla) {
                elemento.dataset.permission = regla[0];
            } else if (elemento.matches("form button[type='submit'], form input[type='submit']")) {
                elemento.dataset.permissionAny = "Crear,Actualizar";
            }
        });
    }

    function aplicarPermisosControles() {
        asignarPermisosControles();
        document.querySelectorAll("[data-permission], [data-permission-any]").forEach(elemento => {
            const permisos = elemento.dataset.permissionAny
                ? elemento.dataset.permissionAny.split(",")
                : [elemento.dataset.permission];
            elemento.classList.toggle(
                "permission-hidden",
                !permisos.some(permiso => window.tienePermiso(permiso))
            );
        });
         ocultarColumnasAcciones();
    }

    function ocultarColumnasAcciones() {
    document.querySelectorAll("td.acciones").forEach(td => {
        const visibles = td.querySelectorAll("button:not(.permission-hidden), a:not(.permission-hidden)");
        td.classList.toggle("permission-hidden", visibles.length === 0);
    });
}

    function normalizarRuta(ruta) {
        return decodeURIComponent(ruta).replace(/\/+$/, "").toLowerCase();
    }

function denegarAcceso(mensaje) {
    document.body.classList.remove("permissions-pending");
    document.body.innerHTML = `
        <style>
        body {
            background: #bdbcbc;
            }

            .denegado-box {
                max-width: 680px;
                margin: 180px auto;
                padding: 40px;
                background: #fff;
                border-radius: 14px;
                text-align: center;
                box-shadow: 0 4px 18px var(--color-primary);
                font-family: "Segoe UI", sans-serif;
            }
            .denegado-box .icon {
                font-size: 80px;
                color: #f70202;
                margin-bottom: 20px;
            }
            .denegado-box h2 {
                font-size: 40px;
                margin-bottom: 10px;
                color: var(--color-primary);
                font-weight: 700;
            }
            .denegado-box p {
                font-size: 25px;
                color: #0c0c0c;
                margin-bottom: 20px;
            }
            .denegado-box a {
                display: inline-block;
                padding: 10px 18px;
                background: var(--color-secondary);
                color: #fff;
                border-radius: 8px;
                text-decoration: none;
                font-weight: 600;
                transition: 0.2s;
            }
            .denegado-box a:hover {
                background: #4239f3;
            }
        </style>

        <main class="denegado-box" role="alert">
            <div class="icon">⛔</div>
            <h2>Acceso denegado</h2>
            <p>${mensaje}</p>
            <a href="../dashboard/index.html">Volver al inicio</a>
        </main>
    `;
}

    async function cargarPermisos() {
        try {
            const respuesta = await fetch("../../backend/auth/permisos_usuario.php", {
                credentials: "same-origin",
                cache: "no-store",
                headers: { "Accept": "application/json" }
            });
            const resultado = await respuesta.json();

            if (!respuesta.ok || resultado.status !== "success" || !resultado.data) {
                throw new Error(resultado.message || "El servidor no pudo cargar los permisos de esta sesión.");
            }

            const paginaActual = normalizarRuta(window.location.pathname);
            let permisosPagina = null;

            Object.values(resultado.data).forEach(modulo => {
                Object.values(modulo.paginas || {}).forEach(pagina => {
                    const rutaPagina = normalizarRuta(
                        new URL(pagina.url, window.location.href).pathname
                    );
                    if (rutaPagina === paginaActual) {
                        permisosPagina = pagina.permisos;
                    }
                });
            });

            const permisosNormalizados = Array.isArray(permisosPagina)
                ? permisosPagina.map(permiso => String(permiso).trim().toLowerCase())
                : [];
            const permisosCrud = ["crear", "leer", "actualizar", "eliminar"];

            if (!permisosNormalizados.some(permiso => permisosCrud.includes(permiso))) {
                denegarAcceso("No tienes acceso para ver esta página.");
                return;
            }

            window.tienePermiso = permiso =>
                permisosNormalizados.includes(String(permiso).trim().toLowerCase());

            aplicarPermisosControles();
            document.body.classList.remove("permissions-pending");
            document.body.classList.add("permissions-ready");
        } catch (error) {
            console.error("Error cargando permisos:", error);
            denegarAcceso("No fue posible verificar tus permisos. Actualiza la página o inicia sesión nuevamente.");
        }
    }

    window.tienePermiso = () => false;
    asignarPermisosControles();

    const observer = new MutationObserver(registros => {
        registros.forEach(registro => {
            registro.addedNodes.forEach(nodo => {
                if (nodo instanceof Element) asignarPermisosControles(nodo);
            });
        });
        if (document.body.classList.contains("permissions-ready")) {
            aplicarPermisosControles();
        }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", cargarPermisos, { once: true });
    } else {
        cargarPermisos();
    }
})();
