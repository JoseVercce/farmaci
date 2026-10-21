const API_CATEGORIAS = "../../backend/categoria/";

let paginaCategoria = 1;
let buscarCategoria = "";


document.addEventListener("DOMContentLoaded", () => {
    cargarCategorias();

    document.getElementById("buscar-categoria").addEventListener("input", e => {
        buscarCategoria = e.target.value;
        paginaCategoria = 1;
        cargarCategorias();
    });

    document.getElementById("btn-nueva-categoria").addEventListener("click", abrirModalNueva);
    document.getElementById("btn-cancelar").addEventListener("click", cerrarModal);

    document.getElementById("form-categoria").addEventListener("submit", guardarCategoria);
});


/* ============================
   LISTAR + BUSCAR + PAGINAR
============================ */
async function cargarCategorias() {
    const tbody = document.getElementById("tabla-categorias");
    tbody.innerHTML = "";

    const res = await fetch(
        `${API_CATEGORIAS}listar.php?buscar=${buscarCategoria}&pagina=${paginaCategoria}&limite=10`
    );

    const data = await res.json();

    if (!data.ok) {
        alert("Error al cargar categorías");
        return;
    }

    data.data.forEach(c => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${c.nombre}</td>
            <td>${c.descripcion ?? ""}</td>
            <td class="acciones">
                <button class="action-btn edit" onclick="editarCategoria(${c.id})">✏️</button>
                <button class="action-btn delete" onclick="eliminarCategoria(${c.id})">🗑️</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    renderPaginacionCategorias(data.total);
}


function renderPaginacionCategorias(total) {
    const cont = document.getElementById("paginacion-categorias");
    cont.innerHTML = "";

    const totalPaginas = Math.ceil(total / 10);
    if (totalPaginas <= 1) return;

    if (paginaCategoria > 1) {
        cont.innerHTML += `<button onclick="irPaginaCategoria(${paginaCategoria - 1})">Anterior</button>`;
    }

    let inicio = Math.max(1, paginaCategoria - 2);
    let fin = Math.min(totalPaginas, paginaCategoria + 2);

    for (let i = inicio; i <= fin; i++) {
        cont.innerHTML += `
            <button class="${i === paginaCategoria ? 'active' : ''}" onclick="irPaginaCategoria(${i})">${i}</button>
        `;
    }

    if (paginaCategoria < totalPaginas) {
        cont.innerHTML += `<button onclick="irPaginaCategoria(${paginaCategoria + 1})">Siguiente</button>`;
    }
}

function irPaginaCategoria(num) {
    paginaCategoria = num;
    cargarCategorias();
}


/* ============================
   NUEVA CATEGORÍA
============================ */
function abrirModalNueva() {
    document.getElementById("modal-title").textContent = "Nueva categoría";
    document.getElementById("form-categoria").reset();
    document.getElementById("categoria-id").value = "";
    
  const modal = document.getElementById("modal-categoria");
    modal.classList.remove("hidden");
}

function cerrarModal() {
    const modal = document.getElementById("modal-categoria");
    modal.classList.add("hidden");      // ✔ Ocultar modal correctamente
}



/* ============================
   GUARDAR CATEGORÍA
============================ */
async function guardarCategoria(e) {
    e.preventDefault();

    const formData = new FormData(document.getElementById("form-categoria"));

    const archivo = formData.get("id") ? "actualizar.php" : "crear.php";

    const res = await fetch(API_CATEGORIAS + archivo, {
        method: "POST",
        body: formData
    });

    const json = await res.json();

    if (!json.ok) {
        alert("Error: " + json.error);
        return;
    }

    cerrarModal();
    cargarCategorias();
}


/* ============================
   EDITAR CATEGORÍA
============================ */
async function editarCategoria(id) {
    const res = await fetch(API_CATEGORIAS + "obtener.php?id=" + id);
    const json = await res.json();

    if (!json.ok) {
        alert("Error: " + json.error);
        return;
    }

    const c = json.data;

    document.getElementById("modal-title").textContent = "Editar categoría";
    document.getElementById("categoria-id").value = c.id;
    document.getElementById("categoria-nombre").value = c.nombre;
    document.getElementById("categoria-descripcion").value = c.descripcion ?? "";

document.getElementById("modal-categoria").classList.remove("hidden");

}


/* ============================
   ELIMINAR CATEGORÍA
============================ */
async function eliminarCategoria(id) {
    if (!confirm("¿Eliminar categoría?")) return;

    const fd = new FormData();
    fd.append("id", id);

    const res = await fetch(API_CATEGORIAS + "eliminar.php", {
        method: "POST",
        body: fd
    });

    const json = await res.json();

    if (json.status !== "success") {
        alert("Error: " + json.msg);
        return;
    }

    cargarCategorias();
}

document.getElementById("btn-mini-logout").addEventListener("click", () => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = "../../login/index.html";
});