const API_STOCK = "../../backend/stock/";

let paginaStock = 1;
let buscarStock = "";
let estadoRegistroStock = "1";

document.addEventListener("DOMContentLoaded", () => {
  inicializarFiltroEstado("filtro-stock", (estado) => {
    estadoRegistroStock = estado;
    paginaStock = 1;
    cargarStock();
  });

  document.getElementById("buscar-stock").addEventListener("input", e => {
    buscarStock = e.target.value;
    paginaStock = 1;
    cargarStock();
  });
});

async function cargarStock() {
  const tbody = document.getElementById("tabla-stock");
  tbody.innerHTML = "";

  const res = await fetch(
    `${API_STOCK}listar.php?buscar=${encodeURIComponent(buscarStock)}&pagina=${paginaStock}&limite=9&estado=${estadoRegistroStock}`
  );

  const json = await res.json();

  if (!json.ok) {
    console.error("Error backend:", json.error);
    return;
  }

  if (json.data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="text-center">No hay registros de stock para este filtro.</td></tr>';
  }

  json.data.forEach(s => {

    let clase = "";
    let etiqueta = s.estado.toUpperCase();

    if (s.estado === "Normal") clase = "estado-normal";
    if (s.estado === "Bajo") clase = "estado-bajo";
    if (s.estado === "Excedido") clase = "estado-excedido";

    const tr = document.createElement("tr");
    const accionesStock = Number(s.estado_registro) === 1
      ? `<button class="btn-transferir" onclick="abrirTransferencia(${s.id})">🔁 Transferir</button>`
      : `<button class="action-btn edit" onclick="activarStock(${s.id})" aria-label="Activar stock">♻️</button>`;

const almacenesUI = {
  "Transporte": { icono: "🚚", color: "#007bff" },
  "Secundario":   { icono: "🏬", color: "#ffc107" },  
  "Principal":   { icono: "📦", color: "#28a745" } 
};

const infoAlmacen = almacenesUI[s.almacen] || { icono: "❓", color: "#6c757d" };

const nombreAlmacen = `
  <span style="
    display:inline-flex;
    align-items:center;
    gap:6px;
    background:${infoAlmacen.color}20;
    color:${infoAlmacen.color};
    padding:4px 8px;
    border-radius:6px;
    font-weight:600;
  ">
    ${infoAlmacen.icono} ${s.almacen || "Sin asignar"}
  </span>
`;


tr.innerHTML = `
  <td>${s.nombre}</td>
  <td class="cantidad">${s.cantidad_actual}</td>
  <td class="minima">${s.minima}</td>
  <td class="maxima">${s.maxima}</td>
  <td class="estado"><span class="estado-tag ${clase}">${etiqueta}</span></td>
  <td>${Number(s.estado_registro) === 1 ? "Activo" : "Inactivo"}</td>
  <td>${accionesStock} ${nombreAlmacen}
  </td>
`;

    tbody.appendChild(tr);
  });

  renderPaginacionStock(json.total);
}

async function activarStock(id) {
  confirmarAccion("¿Activar nuevamente este registro de stock?", async () => {
    const formData = new FormData();
    formData.append("id", id);

    try {
      const respuesta = await fetch(`${API_STOCK}activar.php`, {
        method: "POST",
        body: formData
      });
      const json = await respuesta.json();

      if (!respuesta.ok || !json.ok) {
        mostrarMensajeBonito("Error: " + (json.msg || "No se pudo activar el stock."), "❌");
        return;
      }

      await cargarStock();
      mostrarMensajeBonito(json.msg || "Stock activado correctamente", "✅");
    } catch (error) {
      console.error("Error activando stock:", error);
      mostrarMensajeBonito("Error de conexión al activar el stock.", "❌");
    }
  }, "Sí, activar");
}

function renderPaginacionStock(total) {
  const cont = document.getElementById("paginacion-stock");
  cont.innerHTML = "";

  const totalPaginas = Math.ceil(total / 9);
  if (totalPaginas <= 1) return;

  if (paginaStock > 1) {
    cont.innerHTML += `<button onclick="irPaginaStock(${paginaStock - 1})">Anterior</button>`;
  }

  let inicio = Math.max(1, paginaStock - 2);
  let fin = Math.min(totalPaginas, paginaStock + 2);

  for (let i = inicio; i <= fin; i++) {
    cont.innerHTML += `
      <button class="${i === paginaStock ? 'active' : ''}" onclick="irPaginaStock(${i})">${i}</button>
    `;
  }

  if (paginaStock < totalPaginas) {
    cont.innerHTML += `<button onclick="irPaginaStock(${paginaStock + 1})">Siguiente</button>`;
  }
}

function irPaginaStock(num) {
  paginaStock = num;
  cargarStock();
}

let stockSeleccionado = null;

function abrirTransferencia(id_stock) {
    stockSeleccionado = id_stock;

    fetch("../../backend/stock/get_stock.php?id=" + id_stock)
    .then(r => r.json())
    .then(data => {

        document.getElementById("trans-producto").textContent = data.producto;
        document.getElementById("trans-origen").textContent = data.almacen;
        document.getElementById("trans-disponible").textContent = data.cantidad;

        let select = document.getElementById("trans-destino");
        select.innerHTML = "";

        data.almacenes.forEach(a => {
            if (a.id_almacen != data.id_almacen) {
                select.innerHTML += `<option value="${a.id_almacen}">${a.nombre}</option>`;
            }
        });

        document.getElementById("modal-transferencia").classList.remove("hidden");
    });
}

function confirmarTransferencia() {
    const formData = new FormData();
    formData.append("id_stock", stockSeleccionado);
    formData.append("id_destino", document.getElementById("trans-destino").value);
    formData.append("cantidad", document.getElementById("trans-cantidad").value);

    fetch("../../backend/stock/transferir.php", {
        method: "POST",
        body: formData
    })
    .then(r => r.json())
    .then(data => {
        alert(data.msg);
        cerrarTransferencia();
        cargarStock(); // recarga la tabla
    });
}
function cerrarTransferencia() {
    document.getElementById("modal-transferencia").classList.add("hidden");
}


document.getElementById("btn-mini-logout").addEventListener("click", () => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = "../../login/index.html";
});