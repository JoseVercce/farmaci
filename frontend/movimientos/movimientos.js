/* ============================
   CONSTANTES
============================ */
const API_MOV = "../../backend/movimientos/";

let paginaMov = 1;
let buscarMov = "";

/* ============================
   INICIO
============================ */
document.addEventListener("DOMContentLoaded", () => {
    cargarMovimientos();

    document.getElementById("buscar-mov").addEventListener("input", e => {
        buscarMov = e.target.value;
        paginaMov = 1;
        cargarMovimientos();
    });
});

/* ============================
   CARGAR MOVIMIENTOS
============================ */
async function cargarMovimientos() {
    const tbody = document.getElementById("tabla-movimientos");
    tbody.innerHTML = "";

    const res = await fetch(
        `${API_MOV}listar.php?buscar=${buscarMov}&pagina=${paginaMov}&limite=10`
    );

    const json = await res.json();

    if (!json.ok) {
        alert("Error al cargar movimientos");
        return;
    }

    json.data.forEach(m => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${m.fecha}</td>
            <td>${m.producto}</td>
            <td>${m.tipo}</td>
            <td>${m.cantidad_inicio}</td>
            <td>${m.cantidad_ingreso}</td>
            <td>${m.cantidad_salida}</td>
            <td>${m.cantidad_final}</td>
        `;
        tbody.appendChild(tr);
    });

    renderPaginacionMov(json.total);
}

/* ============================
   PAGINACIÓN
============================ */
function renderPaginacionMov(total) {
    const cont = document.getElementById("paginacion");
    cont.innerHTML = "";

    const totalPaginas = Math.ceil(total / 10);
    if (totalPaginas <= 1) return;

    if (paginaMov > 1) {
        cont.innerHTML += `<button onclick="irPaginaMov(${paginaMov - 1})">Anterior</button>`;
    }

    let inicio = Math.max(1, paginaMov - 2);
    let fin = Math.min(totalPaginas, paginaMov + 2);

    for (let i = inicio; i <= fin; i++) {
        cont.innerHTML += `
            <button class="${i === paginaMov ? 'active' : ''}" onclick="irPaginaMov(${i})">${i}</button>
        `;
    }

    if (paginaMov < totalPaginas) {
        cont.innerHTML += `<button onclick="irPaginaMov(${paginaMov + 1})">Siguiente</button>`;
    }
}

function irPaginaMov(num) {
    paginaMov = num;
    cargarMovimientos();
}

document.getElementById("btn-mini-logout").addEventListener("click", () => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = "../../login/index.html";
});