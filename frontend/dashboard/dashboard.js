/* ============================================================
   CARGAR USUARIO ACTUAL
============================================================ */
function cargarUsuario() {
    fetch("../../backend/login/usuario_actual.php")
        .then(res => res.json())
        .then(data => {
            if (!data.ok) {
                window.location.href = "../../login/index.html";
                return;
            }

            // Ya no escribimos nada en el sidebar
        })
        .catch(err => console.error("Error cargando usuario:", err));
}


/* ============================================================
   CARGAR MÉTRICAS DEL DASHBOARD
============================================================ */
function cargarMetricas() {
    fetch("../../backend/dashboard/metricas.php")
        .then(res => res.json())
        .then(data => {
            if (!data.ok) {
                console.error("Error en métricas:", data.error);
                return;
            }

            document.getElementById("card-productos").textContent = data.productos;
            document.getElementById("card-stock").textContent = data.stock;
            document.getElementById("card-facturas").textContent = data.facturas;
            document.getElementById("card-proveedores").textContent = data.proveedores;
        })
        .catch(err => console.error("Error cargando métricas:", err));
}

/* ============================================================
   CARGAR ÚLTIMOS MOVIMIENTOS
============================================================ */
function cargarMovimientosRecientes() {
    fetch("../../backend/dashboard/movimientos_recientes.php")
        .then(res => res.json())
        .then(data => {

            const tbody = document.getElementById("tabla-movimientos-recientes");
            if (!tbody) return;

            tbody.innerHTML = "";

            if (!data.ok) {
                tbody.innerHTML = `<tr><td colspan="4">No hay movimientos recientes</td></tr>`;
                return;
            }

            data.data.forEach(m => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${m.fecha}</td>
                    <td>${m.tipo}</td>
                    <td>${m.producto}</td>
                    <td>${m.cantidad}</td>
                `;
                tbody.appendChild(tr);
            });

        })
        .catch(err => console.error("Error cargando movimientos:", err));
}

/* ============================================================
   LOGOUT
============================================================ */
function cerrarSesion() {
    fetch("../../backend/login/logout.php")
        .then(() => {
            window.location.href = "../../login/index.html";
        });
}

window.cerrarSesion = cerrarSesion;

/* ============================================================
   EJECUTAR AL CARGAR LA PÁGINA
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
    cargarUsuario();
    cargarMetricas();
    cargarMovimientosRecientes();
});

document.getElementById("btn-mini-logout").addEventListener("click", () => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = "../../login/index.html";
});
