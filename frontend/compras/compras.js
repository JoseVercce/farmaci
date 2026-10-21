const API_COMPRAS = "../../backend/compras/";
const API_PROVEEDORES = "../../backend/proveedores/";
const API_PRODUCTOS = "../../backend/productos/";

let DETALLES_COMPRA = [];

// 🔹 NUEVO:
let paginaCompras = 1;
let buscarCompras = "";

document.addEventListener("DOMContentLoaded", () => {
  cargarCompras();
  configurarEventosCompras();

  // 🔹 NUEVO:
  const inputBuscar = document.getElementById("buscar-compra");
  if (inputBuscar) {
    inputBuscar.addEventListener("input", e => {
      buscarCompras = e.target.value;
      paginaCompras = 1;
      cargarCompras();
    });
  }
});

/* ============================
   EVENTOS
============================ */
function configurarEventosCompras() {
  const btnNueva = document.getElementById("btn-nueva-compra");
  const modalCompra = document.getElementById("modal-compra");
  const btnCancelarCompra = document.getElementById("btn-cancelar-compra");
  const formCompra = document.getElementById("form-compra");
  const btnAgregarProducto = document.getElementById("btn-agregar-producto");

  const modalDetalle = document.getElementById("modal-agregar-producto");
  const btnGuardarDetalle = document.getElementById("btn-guardar-detalle");
  const btnCancelarDetalle = document.getElementById("btn-cancelar-detalle");

  btnNueva.addEventListener("click", async () => {
    DETALLES_COMPRA = [];
    limpiarFormularioCompra();
    await cargarProveedores();
    await cargarProductosDetalle();
    renderizarDetallesCompra();
    mostrarModal(modalCompra);
  });

  btnCancelarCompra.addEventListener("click", () => ocultarModal(modalCompra));

  formCompra.addEventListener("submit", async e => {
    e.preventDefault();
    if (DETALLES_COMPRA.length === 0) {
      alert("Debe agregar al menos un producto.");
      return;
    }
    await guardarCompra();
  });

  btnAgregarProducto.addEventListener("click", async () => {
    await cargarProductosDetalle();
    mostrarModal(modalDetalle);
  });

  btnCancelarDetalle.addEventListener("click", () => ocultarModal(modalDetalle));

  btnGuardarDetalle.addEventListener("click", () => agregarDetalleDesdeModal());
}

// Selección de almacén
document.addEventListener("click", e => {
  if (e.target.classList.contains("almacen-btn")) {

    document.querySelectorAll(".almacen-btn").forEach(b => b.classList.remove("active"));

    e.target.classList.add("active");

    document.getElementById("detalle-almacen").value = e.target.dataset.almacen;
  }
});



/* ============================
   MODALES
============================ */
function mostrarModal(modal) { modal.classList.remove("hidden"); }
function ocultarModal(modal) { modal.classList.add("hidden"); }

/* ============================
   LISTAR COMPRAS
============================ */
async function cargarCompras() {
  const tbody = document.getElementById("tabla-compras");
  tbody.innerHTML = "";

  const res = await fetch(
    `${API_COMPRAS}listar.php?buscar=${encodeURIComponent(buscarCompras)}&pagina=${paginaCompras}&limite=10`
  );
  const json = await res.json();

  if (!json.ok) return;

  json.data.forEach(c => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${c.fecha}</td>
      <td>${c.proveedor}</td>
      <td>${Number(c.total).toFixed(2)}</td>
      <td>${c.usuario ?? "-"}</td>
      <td class="acciones">
          <button class="action-btn edit" onclick="verCompra(${c.id})">👁️</button>
          <button class="action-btn delete" onclick="eliminarCompra(${c.id})">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // 🔹 NUEVO:
  renderPaginacionCompras(json.total);
}


/* ============================
   PROVEEDORES
============================ */
async function cargarProveedores() {
  const select = document.getElementById("compra-proveedor");
  select.innerHTML = "";

  const res = await fetch(API_PROVEEDORES + "listar.php");
  const json = await res.json();

  if (json.status !== "success") return;

  json.data.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = p.nombre;
    select.appendChild(opt);
  });
}

/* ============================
   PRODUCTOS
============================ */
async function cargarProductosDetalle() {
  const select = document.getElementById("detalle-producto");
  select.innerHTML = "";

  const res = await fetch(API_PRODUCTOS + "listar.php");
  const json = await res.json();

if (!json.ok && json.status !== "success") {
    console.error("Error productos:", json.error);
    return;
}


  json.data.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = p.nombre;
    select.appendChild(opt);
  });
}

/* ============================
   FORMULARIO
============================ */
function limpiarFormularioCompra() {
  document.getElementById("compra-id").value = "";
  document.getElementById("compra-fecha").value = new Date().toISOString().slice(0,16);
  document.getElementById("compra-total").value = "0.00";
}

/* ============================
   DETALLES
============================ */
function agregarDetalleDesdeModal() {
  const selectProd = document.getElementById("detalle-producto");
  const cantidad = parseInt(document.getElementById("detalle-cantidad").value || "0", 10);
  const costo = parseFloat(document.getElementById("detalle-costo").value || "0");

  if (!selectProd.value || cantidad <= 0 || costo <= 0) {
    alert("Complete producto, cantidad y costo.");
    return;
  }

  const id_producto = parseInt(selectProd.value, 10);
  const nombre = selectProd.options[selectProd.selectedIndex].text;

  const existente = DETALLES_COMPRA.find(d => d.id_producto === id_producto);

  if (existente) {
    existente.cantidad += cantidad;
    existente.costo_unitario = costo;
  } else {
const id_almacen = parseInt(document.getElementById("detalle-almacen").value || "0", 10);

if (id_almacen === 0) {
  alert("Debe seleccionar un almacén (Transporte o Depósito).");
  return;
}

DETALLES_COMPRA.push({
  id_producto,
  nombre,
  cantidad,
  costo_unitario: costo,
  id_almacen
});

  }

  renderizarDetallesCompra();
  document.getElementById("detalle-cantidad").value = "";
  document.getElementById("detalle-costo").value = "";
  ocultarModal(document.getElementById("modal-agregar-producto"));
}

function renderizarDetallesCompra() {
  const tbody = document.getElementById("tabla-detalle-compra");
  tbody.innerHTML = "";

  let total = 0;

  DETALLES_COMPRA.forEach((d, idx) => {
    const subtotal = d.cantidad * d.costo_unitario;
    total += subtotal;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${d.nombre}</td>
      <td>${d.cantidad}</td>
      <td>${d.costo_unitario.toFixed(2)}</td>
      <td>${subtotal.toFixed(2)}</td>
      <td>
        <button class="action-btn btn-eliminar" onclick="eliminarDetalle(${idx})">
          <i class="fas fa-times">X</i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // 🔹 Actualiza el total visual
  document.getElementById("total-visual").textContent = total.toFixed(2);

  // 🔹 Actualiza el total REAL que se envía al backend
  document.getElementById("compra-total").value = total.toFixed(2);
}


function eliminarDetalle(index) {
  DETALLES_COMPRA.splice(index, 1);
  renderizarDetallesCompra();
}

/* ============================
   GUARDAR COMPRA
============================ */
async function guardarCompra() {
  const form = document.getElementById("form-compra");
  const formData = new FormData(form);

  formData.append("detalles", JSON.stringify(DETALLES_COMPRA));

  const res = await fetch(API_COMPRAS + "crear.php", {
    method: "POST",
    body: formData
  });

  const json = await res.json();

  if (!json.ok) {
    alert("Error al guardar compra: " + json.error);
    return;
  }

  alert("Compra registrada correctamente.");
  ocultarModal(document.getElementById("modal-compra"));
  cargarCompras();
}

/* ============================
   ELIMINAR COMPRA
============================ */
async function eliminarCompra(id_compra) {
  if (!confirm("¿Eliminar esta compra?")) return;

  const formData = new FormData();
  formData.append("id", id_compra);

  const res = await fetch(API_COMPRAS + "eliminar.php", {
    method: "POST",
    body: formData
  });

  const json = await res.json();

  if (!json.ok) {
    alert("Error al eliminar compra: " + json.error);
    return;
  }

  cargarCompras();
}
async function verCompra(id) {

    const res = await fetch(API_COMPRAS + "detalle.php?id=" + id);
    const json = await res.json();

    if (!json.ok || !json.compra) {
        alert("No se pudo cargar el detalle de la compra");
        return;
    }

    if (!json.detalle || !Array.isArray(json.detalle)) {
        alert("Esta compra no tiene productos registrados.");
        return;
    }

    const compra = json.compra;
    const detalle = json.detalle;

    document.getElementById("detc-fecha").textContent = compra.fecha;
    document.getElementById("detc-proveedor").textContent = compra.proveedor;
    document.getElementById("detc-usuario").textContent = compra.usuario;
    document.getElementById("detc-total").textContent = compra.total;

    const tbody = document.getElementById("detc-tabla");
    tbody.innerHTML = "";

    detalle.forEach(d => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${d.producto}</td>
            <td>${d.cantidad}</td>
            <td>${d.costo_unitario}</td>
            <td>${d.subtotal}</td>
            <td>${d.almacen ?? "Sin asignar"}</td>
        `;
        tbody.appendChild(tr);
    });
document.getElementById("modal-detalle-compra").classList.remove("hidden");
}


function cerrarModalCompra() {
    document.getElementById("modal-detalle-compra").classList.add("hidden");
}
/* ============================
   VER DETALLE
============================ */
async function verDetalleCompra(id_compra) {
  const res = await fetch(API_COMPRAS + "detalle.php?id=" + id_compra);
  const json = await res.json();

  if (!json.ok) {
    alert("Error al obtener detalle: " + json.error);
    return;
  }

  const modal = document.getElementById("modal-compra");
  const titulo = document.getElementById("modal-title-compra");

  titulo.textContent = "Detalle de compra";
DETALLES_COMPRA = (json.detalles || []).map(d => ({
    ...d,
    cantidad: Number(d.cantidad),
    costo_unitario: Number(d.costo_unitario)
}));


  document.getElementById("compra-id").value = json.compra.id;
  document.getElementById("compra-fecha").value = json.compra.fecha.replace(" ", "T");
  document.getElementById("compra-total").value = Number(json.compra.total).toFixed(2);

  await cargarProveedores();
  document.getElementById("compra-proveedor").value = json.compra.id_proveedor;

  renderizarDetallesCompra();
  mostrarModal(modal);
}
function renderPaginacionCompras(total) {
  const cont = document.getElementById("paginacion-compras");
  if (!cont) return;

  cont.innerHTML = "";

  const totalPaginas = Math.ceil(total / 10);
  if (totalPaginas <= 1) return;

  if (paginaCompras > 1) {
    cont.innerHTML += `<button onclick="irPaginaCompras(${paginaCompras - 1})">Anterior</button>`;
  }

  let inicio = Math.max(1, paginaCompras - 2);
  let fin = Math.min(totalPaginas, paginaCompras + 2);

  for (let i = inicio; i <= fin; i++) {
    cont.innerHTML += `
      <button class="${i === paginaCompras ? 'active' : ''}" onclick="irPaginaCompras(${i})">${i}</button>
    `;
  }

  if (paginaCompras < totalPaginas) {
    cont.innerHTML += `<button onclick="irPaginaCompras(${paginaCompras + 1})">Siguiente</button>`;
  }
}

function irPaginaCompras(num) {
  paginaCompras = num;
  cargarCompras();
}



document.getElementById("btn-mini-logout").addEventListener("click", () => {
  // eliminar cookie de sesión del backend
  document.cookie = "farmacia_sesion=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  localStorage.clear();
  sessionStorage.clear();
  window.location.href = "../../login/index.html";
});
