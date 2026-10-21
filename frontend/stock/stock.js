const API_STOCK = "../../backend/stock/";

let paginaStock = 1;
let buscarStock = "";

document.addEventListener("DOMContentLoaded", () => {
  cargarStock();

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
    `${API_STOCK}listar.php?buscar=${buscarStock}&pagina=${paginaStock}&limite=10`
  );

  const json = await res.json();

  if (!json.ok) {
    console.error("Error backend:", json.error);
    return;
  }

  json.data.forEach(s => {

    let clase = "";
    let etiqueta = s.estado.toUpperCase();

    if (s.estado === "Normal") clase = "estado-normal";
    if (s.estado === "Bajo") clase = "estado-bajo";
    if (s.estado === "Excedido") clase = "estado-excedido";

    const tr = document.createElement("tr");

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
  <td> <button class="btn-transferir" onclick="abrirTransferencia(${s.id})">🔁 Transferir</button> ${nombreAlmacen}
  </td>
`;

    tbody.appendChild(tr);
  });

  renderPaginacionStock(json.total);
}

function renderPaginacionStock(total) {
  const cont = document.getElementById("paginacion-stock");
  cont.innerHTML = "";

  const totalPaginas = Math.ceil(total / 10);
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