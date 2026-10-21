const API_ROLES = "../../backend/rol/";

let paginaRol = 1;
let buscarRol = "";


document.addEventListener("DOMContentLoaded", () => {
    cargarRoles();

    document.getElementById("buscar-rol").addEventListener("input", e => {
        buscarRol = e.target.value;
        paginaRol = 1;
        cargarRoles();
    });

    document.getElementById("btn-nuevo-rol").addEventListener("click", abrirModalNuevo);
    document.getElementById("btn-cancelar").addEventListener("click", cerrarModal);

    document.getElementById("form-rol").addEventListener("submit", guardarRol);
});


/* ============================
   LISTAR + BUSCAR + PAGINAR
============================ */
async function cargarRoles() {
    const tbody = document.getElementById("tabla-roles");
    tbody.innerHTML = "";

    const res = await fetch(
        `${API_ROLES}listar.php?buscar=${buscarRol}&pagina=${paginaRol}&limite=10`
    );

    const data = await res.json();

    if (!data.ok) {
        alert("Error al cargar roles");
        return;
    }

    data.data.forEach(r => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${r.nombre}</td>
            <td>${r.descripcion}</td>
            <td class="acciones">
                <button class="action-btn edit" onclick="editarRol(${r.id})">✏️</button>
                <button class="action-btn delete" onclick="eliminarRol(${r.id})">🗑️</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    renderPaginacionRoles(data.total);
}


function renderPaginacionRoles(total) {
    const cont = document.getElementById("paginacion-roles");
    cont.innerHTML = "";

    const totalPaginas = Math.ceil(total / 10);
    if (totalPaginas <= 1) return;

    if (paginaRol > 1) {
        cont.innerHTML += `<button onclick="irPaginaRol(${paginaRol - 1})">Anterior</button>`;
    }

    let inicio = Math.max(1, paginaRol - 2);
    let fin = Math.min(totalPaginas, paginaRol + 2);

    for (let i = inicio; i <= fin; i++) {
        cont.innerHTML += `
            <button class="${i === paginaRol ? 'active' : ''}" onclick="irPaginaRol(${i})">${i}</button>
        `;
    }

    if (paginaRol < totalPaginas) {
        cont.innerHTML += `<button onclick="irPaginaRol(${paginaRol + 1})">Siguiente</button>`;
    }
}

function irPaginaRol(num) {
    paginaRol = num;
    cargarRoles();
}


/* ============================
   NUEVO ROL
============================ */
function abrirModalNuevo() {
    document.getElementById("modal-title").textContent = "Nuevo rol";
    document.getElementById("form-rol").reset();
    document.getElementById("rol-id").value = "";

  const modal = document.getElementById("modal-rol");
    modal.classList.remove("hidden");   // ✔ Mostrar modal correctamente
}

function cerrarModal() {
    const modal = document.getElementById("modal-rol");
    modal.classList.add("hidden");      // ✔ Ocultar modal correctamente
}


/* ============================
   GUARDAR ROL
============================ */
async function guardarRol(e) {
    e.preventDefault();

    const formData = new FormData(document.getElementById("form-rol"));
    const archivo = formData.get("id") ? "actualizar.php" : "crear.php";

    const res = await fetch(API_ROLES + archivo, {
        method: "POST",
        body: formData
    });

    const json = await res.json();

    // ✔ Acepta ambos formatos del backend
    const ok = json.ok === true || json.status === "ok" || json.status === "success";

    if (!ok) {
        alert("Error: " + (json.msg || json.error || "Error desconocido"));
        return;
    }

    cerrarModal();
    cargarRoles();
}





/* ============================
   EDITAR ROL
============================ */
async function editarRol(id) {
    const res = await fetch(API_ROLES + "obtener.php?id=" + id);
    const json = await res.json();

    if (!json.ok) {
        alert("Error: " + json.msg);
        return;
    }

    const r = json.rol; // ✔ AQUÍ ESTABA EL PROBLEMA

    document.getElementById("modal-title").textContent = "Editar rol";
    document.getElementById("rol-id").value = r.id;
    document.getElementById("rol-nombre").value = r.nombre;
    document.getElementById("rol-descripcion").value = r.descripcion;

document.getElementById("modal-rol").classList.remove("hidden");

}



/* ============================
   ELIMINAR ROL
============================ */
async function eliminarRol(id) {
    if (!confirm("¿Eliminar rol?")) return;

    const fd = new FormData();
    fd.append("id", id);

    const res = await fetch(API_ROLES + "eliminar.php", {
        method: "POST",
        body: fd
    });

    const json = await res.json();

if (json.status !== "success") {
    alert("Error: " + json.msg);
    return;
}


    cargarRoles();
}


document.getElementById("btn-mini-logout").addEventListener("click", () => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = "../../login/index.html";
});