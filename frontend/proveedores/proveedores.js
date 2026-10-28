const API_PROVEEDOR = "../../backend/proveedores/";

let paginaProv = 1;
let buscarProv = "";
let estadoProv = "1";

// =====================================
// INICIO
// =====================================
document.addEventListener("DOMContentLoaded", () => {
  const btnNuevo = document.getElementById("btn-nuevo-proveedor");
  const modal = document.getElementById("modal-proveedor");
  const form = document.getElementById("form-proveedor");

  // NUEVO PROVEEDOR
  btnNuevo.addEventListener("click", () => {
    form.reset();

    // limpiar hidden id si existe
    let hidden = document.querySelector("#form-proveedor input[name='id']");
    if (hidden) hidden.value = "";

    document.getElementById("modal-prov-title").textContent = "Nuevo proveedor";
    modal.classList.remove("hidden");
  });

  // CANCELAR
  document.getElementById("btn-cancelar-prov").addEventListener("click", () => {
  modal.classList.add("hidden");
  });

  // GUARDAR / ACTUALIZAR
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(form);

    const id = document.querySelector("#form-proveedor input[name='id']");
    const esEdicion = Boolean(id && id.value);
    const archivo = esEdicion ? "actualizar.php" : "crear.php";

    const res = await fetch(API_PROVEEDOR + archivo, {
      method: "POST",
      body: fd
    });

    const data = await res.json();

    if (data.ok || data.status === "success") {
      modal.classList.add("hidden");
      cargarProveedores();
      mostrarMensajeBonito(
        esEdicion ? "Proveedor actualizado correctamente" : "Proveedor registrado correctamente",
        "🤝"
      );
    } else {
      alert("Error al guardar proveedor");
    }
  });

  // BUSCAR PROVEEDOR
  document.getElementById("buscar-proveedor").addEventListener("input", e => {
    buscarProv = e.target.value;
    paginaProv = 1;
    cargarProveedores();
  });

  inicializarFiltroEstado("filtro-proveedores", (estado) => {
    estadoProv = estado;
    paginaProv = 1;
    cargarProveedores();
  });
});


// =====================================
// CARGAR PROVEEDORES
// =====================================
async function cargarProveedores() {
  const tbody = document.getElementById("tabla-proveedores");
  tbody.innerHTML = "";

  const res = await fetch(
    `${API_PROVEEDOR}listar.php?buscar=${encodeURIComponent(buscarProv)}&pagina=${paginaProv}&limite=8&estado=${estadoProv}`
  );

  const data = await res.json();

  if (data.status !== "success") {
    alert("Error al cargar proveedores");
    return;
  }

  if (data.data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center">No hay proveedores para este filtro.</td></tr>';
  }

  data.data.forEach(p => {
    const tr = document.createElement("tr");
    const botonEstado = Number(p.estado) === 1
      ? `<button class="action-btn delete" onclick="eliminarProveedor(${p.id})" aria-label="Inactivar proveedor">🗑️</button>`
      : `<button class="action-btn edit" onclick="activarProveedor(${p.id})" aria-label="Activar proveedor">♻️</button>`;
    tr.innerHTML = `
      <td>${p.nombre}</td>
      <td>${p.telefono}</td>
      <td>${p.correo ?? ""}</td>
      <td>${p.direccion ?? ""}</td>
      <td>${Number(p.estado) === 1 ? "Activo" : "Inactivo"}</td>
      <td class="acciones">
        <button class="action-btn edit" onclick="editarProveedor(${p.id})">✏️</button>
        ${botonEstado}
      </td>
    `;
    tbody.appendChild(tr);
  });

  renderPaginacionProveedores(data.total);
}


// =====================================
// PAGINACIÓN
// =====================================
function renderPaginacionProveedores(total) {
  const cont = document.getElementById("paginacion-proveedores");
  cont.innerHTML = "";

  const totalPaginas = Math.ceil(total / 8);
  if (totalPaginas <= 1) return;

  cont.innerHTML += `<button onclick="irPaginaProv(1)">Primera</button>`;

  if (paginaProv > 1) {
    cont.innerHTML += `<button onclick="irPaginaProv(${paginaProv - 1})">Anterior</button>`;
  }

  let inicio = Math.max(1, paginaProv - 2);
  let fin = Math.min(totalPaginas, paginaProv + 2);

  for (let i = inicio; i <= fin; i++) {
    cont.innerHTML += `
      <button class="${i === paginaProv ? 'active' : ''}" onclick="irPaginaProv(${i})">${i}</button>
    `;
  }

  if (paginaProv < totalPaginas) {
    cont.innerHTML += `<button onclick="irPaginaProv(${paginaProv + 1})">Siguiente</button>`;
  }
}

function irPaginaProv(num) {
  paginaProv = num;
  cargarProveedores();
}

async function activarProveedor(id) {
  confirmarAccion("¿Activar nuevamente este proveedor?", async () => {
    const fd = new FormData();
    fd.append("id", id);

    try {
      const respuesta = await fetch(API_PROVEEDOR + "activar.php", {
        method: "POST",
        body: fd
      });
      const data = await respuesta.json();

      if (!respuesta.ok || data.status !== "success") {
        mostrarMensajeBonito("Error: " + (data.msg || "No se pudo activar el proveedor."), "❌");
        return;
      }

      await cargarProveedores();
      mostrarMensajeBonito(data.msg || "Proveedor activado correctamente", "✅");
    } catch (error) {
      console.error("Error activando proveedor:", error);
      mostrarMensajeBonito("Error de conexión al activar el proveedor.", "❌");
    }
  }, "Sí, activar");
}


// =====================================
// EDITAR PROVEEDOR
// =====================================
async function editarProveedor(id) {
  const res = await fetch(API_PROVEEDOR + "obtener.php?id=" + id);
  const pr = await res.json();

  document.getElementById("modal-prov-title").textContent = "Editar proveedor";
  document.getElementById("prov-nombre").value = pr.nombre;
  document.getElementById("prov-telefono").value = pr.telefono || "";
  document.getElementById("prov-correo").value = pr.correo || "";
  document.getElementById("prov-direccion").value = pr.direccion || "";

  let hidden = document.querySelector("#form-proveedor input[name='id']");
  if (!hidden) {
    hidden = document.createElement("input");
    hidden.type = "hidden";
    hidden.name = "id";
    document.getElementById("form-proveedor").appendChild(hidden);
  }
  hidden.value = pr.id;

  document.getElementById("modal-proveedor").classList.remove("hidden");
}


// =====================================
// ELIMINAR PROVEEDOR
// =====================================
async function eliminarProveedor(id) {
  confirmarAccion("¿Eliminar o desactivar este proveedor?", async () => {
    const fd = new FormData();
    fd.append("id", id);

    const res = await fetch(API_PROVEEDOR + "eliminar.php", {
      method: "POST",
      body: fd
    });

    const data = await res.json();

    if (data.status === "success") {
      cargarProveedores();
      mostrarMensajeBonito(data.msg || "Proveedor eliminado correctamente", "🗑️");
    } else {
      alert("Error al desactivar proveedor");
    }
  }, "Sí, continuar");
}

document.getElementById("btn-mini-logout").addEventListener("click", () => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = "../../login/index.html";
});