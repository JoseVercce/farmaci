const API_CLIENTE = "../../backend/clientes/";

let pagina = 1;
let buscar = "";
let cargando = false; // evita spam de clics

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("modal-cliente").style.display = "none";
  cargarClientes();

  const btnNuevo = document.getElementById("btn-nuevo-cliente");
  const modal = document.getElementById("modal-cliente");
  const form = document.getElementById("form-cliente");

  // NUEVO CLIENTE
  btnNuevo.addEventListener("click", () => {
    form.reset();
    const hidden = form.querySelector("input[name='id']");
    if (hidden) hidden.remove();

    document.getElementById("modal-cliente-title").textContent = "Nuevo cliente";
      modal.style.display = "flex";
  });

  // CANCELAR
  document.getElementById("btn-cancelar-cliente").addEventListener("click", () => {
    modal.style.display = "none";
  });

  // GUARDAR / ACTUALIZAR CLIENTE
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
document.getElementById("modal-cliente").style.display = "flex";

    if (cargando) return;
    cargando = true;

    const fd = new FormData(form);
    const id = form.querySelector("input[name='id']");
    const archivo = id ? "actualizar.php" : "guardar.php";

    try {
      const res = await fetch(API_CLIENTE + archivo, {
        method: "POST",
        body: fd
      });

      const data = await res.json();

      if (data.status === "success") {
        modal.style.display = "none"; 
        cargarClientes();
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      alert("Error de conexión con el servidor");
    }

    cargando = false;
  });

  // BUSCAR CLIENTE
  document.getElementById("buscar-cliente").addEventListener("input", e => {
    buscar = e.target.value.trim();
    pagina = 1;
    cargarClientes();
  });
});

// LISTAR CLIENTES CON PAGINACIÓN
async function cargarClientes() {
  const tbody = document.getElementById("tabla-clientes");
  tbody.innerHTML = `<tr><td colspan="5">Cargando...</td></tr>`;

  try {
    const res = await fetch(
      `${API_CLIENTE}listar.php?buscar=${buscar}&pagina=${pagina}&limite=10`
    );

    const data = await res.json();

    if (data.status !== "success") {
      alert("Error al cargar clientes: " + data.message);
      return;
    }

    tbody.innerHTML = "";

    if (data.data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5">No hay resultados</td></tr>`;
    }

    data.data.forEach(c => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${c.nombre}</td>
        <td>${c.cedula}</td>
        <td>${c.telefono}</td>
        <td>${c.direccion}</td>
            <td class="acciones">
                <button class="action-btn edit" onclick="editarCliente(${c.id})">✏️</button>
                <button class="action-btn delete" onclick="eliminarCliente(${c.id})">🗑️</button>
            </td>
      `;
      tbody.appendChild(tr);
    });

    renderPaginacion(data.total);

  } catch (err) {
    alert("Error de conexión con el servidor");
  }
}

function renderPaginacion(total) {
  const cont = document.getElementById("paginacion-clientes");
  cont.innerHTML = "";

  const totalPaginas = Math.ceil(total / 10);
  if (totalPaginas <= 1) return;

  if (pagina > 1) {
    cont.innerHTML += `<button onclick="irPagina(${pagina - 1})">Anterior</button>`;
  }

  let inicio = Math.max(1, pagina - 2);
  let fin = Math.min(totalPaginas, pagina + 2);

  for (let i = inicio; i <= fin; i++) {
    cont.innerHTML += `
      <button class="${i === pagina ? 'active' : ''}" onclick="irPagina(${i})">${i}</button>
    `;
  }

  if (pagina < totalPaginas) {
    cont.innerHTML += `<button onclick="irPagina(${pagina + 1})">Siguiente</button>`;
  }
}

function irPagina(num) {
  pagina = num;
  cargarClientes();
}

// EDITAR CLIENTE
async function editarCliente(id) {
  try {
    const res = await fetch(API_CLIENTE + "cargar.php?id=" + id);
    const data = await res.json();

    if (data.status !== "success") {
      alert("Error al obtener cliente");
      return;
    }

    const c = data.data;

    document.getElementById("modal-cliente-title").textContent = "Editar cliente";

    document.getElementById("cliente-nombre").value = c.nombre;
    document.getElementById("cliente-cedula").value = c.cedula;
    document.getElementById("cliente-telefono").value = c.telefono;
    document.getElementById("cliente-direccion").value = c.direccion;

    let hidden = document.querySelector("#form-cliente input[name='id']");
    if (!hidden) {
      hidden = document.createElement("input");
      hidden.type = "hidden";
      hidden.name = "id";
      document.getElementById("form-cliente").appendChild(hidden);
    }
    hidden.value = c.id;

document.getElementById("modal-cliente").style.display = "flex";


  } catch (err) {
    alert("Error de conexión con el servidor");
  }
}

// ELIMINAR CLIENTE
async function eliminarCliente(id) {
  if (!confirm("¿Eliminar cliente?")) return;

  const fd = new FormData();
  fd.append("id", id);

  try {
    const res = await fetch(API_CLIENTE + "eliminar.php", {
      method: "POST",
      body: fd
    });

    const data = await res.json();

    if (data.status === "success") {
      cargarClientes();
    } else {
      alert("Error: " + data.message);
    }
  } catch (err) {
    alert("Error de conexión con el servidor");
  }
}

/* LOGOUT */
function cerrarSesion() {
  fetch("../../backend/login/logout.php")
    .then(() => {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "../../login/index.html";
    });
}

document.getElementById("btn-mini-logout").addEventListener("click", () => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = "../../login/index.html";
});
