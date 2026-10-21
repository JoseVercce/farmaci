const API_LISTAR = "http://localhost/berti2/backend/almacenes/listar.php";
const API_CREAR = "http://localhost/berti2/backend/almacenes/crear.php";
const API_EDITAR = "http://localhost/berti2/backend/almacenes/editar.php";
const API_ELIMINAR = "http://localhost/berti2/backend/almacenes/eliminar.php";

let paginaActual = 1;
let limite = 10;
let totalRegistros = 0;
let almacenes = [];

// ===============================
//   CARGAR LISTA
// ===============================
async function cargarAlmacenes(buscar = "") {
  try {
    const url = `${API_LISTAR}?buscar=${buscar}&pagina=${paginaActual}&limite=${limite}`;
    const respuesta = await fetch(url);

    const data = await respuesta.json(); // ← ahora sí funciona

    if (!data.ok) {
      console.error("Error al cargar almacenes");
      return;
    }

    almacenes = data.data;
    totalRegistros = data.total;

    mostrarAlmacenes();

  } catch (error) {
    console.error("Error:", error);
  }
}

// ===============================
//   MOSTRAR EN TABLA
// ===============================
function mostrarAlmacenes() {
  const tabla = document.getElementById("tabla-almacenes");
  tabla.innerHTML = "";

  almacenes.forEach(almacen => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${almacen.nombre}</td>
      <td>${almacen.ubicacion ?? "—"}</td>
      <td class="acciones">
        <button class="action-btn edit" onclick="editarAlmacen(${almacen.id})">✏️</button>
        <button class="action-btn delete" onclick="eliminarAlmacen(${almacen.id})">🗑️</button>
      </td>
      
    `;

    tabla.appendChild(fila);
  });
}


// ===============================
//   BUSCADOR
// ===============================
document.getElementById("buscar-almacen").addEventListener("input", function () {
  paginaActual = 1;
  cargarAlmacenes(this.value);
});

// ===============================
//   NUEVO ALMACÉN
// ===============================
document.getElementById("btn-nuevo-almacen").addEventListener("click", () => {
  document.getElementById("modal-title").textContent = "Nuevo almacén";
  document.getElementById("form-almacen").reset();
  document.getElementById("almacen-id").value = "";
  abrirModal();
});

// ===============================
//   ABRIR / CERRAR MODAL
// ===============================
function abrirModal() {
  const m = document.getElementById("modal-almacen");
  m.classList.remove("hidden");   
}

document.getElementById("btn-cancelar").addEventListener("click", cerrarModal);

function cerrarModal() {
  const m = document.getElementById("modal-almacen");
  m.classList.add("hidden"); 
}

// ===============================
//   EDITAR
// ===============================
function editarAlmacen(id) {
  const almacen = almacenes.find(a => a.id == id);

  if (!almacen) {
    console.error("Almacén no encontrado:", id);
    return;
  }

  document.getElementById("modal-title").textContent = "Editar almacén";
  document.getElementById("almacen-id").value = almacen.id;
  document.getElementById("almacen-nombre").value = almacen.nombre;
  document.getElementById("almacen-ubicacion").value = almacen.ubicacion;

  abrirModal();
}


// ===============================
//   GUARDAR (CREAR / EDITAR)
// ===============================
document.getElementById("form-almacen").addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const id = formData.get("id");

  const url = id ? API_EDITAR : API_CREAR;

  try {
    const respuesta = await fetch(url, {
      method: "POST",
      body: formData
    });

    const data = await respuesta.json();

    if (data.ok) {
      cerrarModal();
      cargarAlmacenes();
    } else {
      alert("Error: " + data.msg);
    }

  } catch (error) {
    console.error("Error al guardar:", error);
  }
});

// ===============================
//   ELIMINAR
// ===============================
async function eliminarAlmacen(id) {
  if (!confirm("¿Seguro que deseas eliminar este almacén?")) return;

  try {
    const respuesta = await fetch(API_ELIMINAR + "?id=" + id);
    const data = await respuesta.json();

    if (data.ok) {
      cargarAlmacenes();
    } else {
      alert("Error: " + data.msg);
    }

  } catch (error) {
    console.error("Error al eliminar:", error);
  }
}

// ===============================
//   INICIALIZAR
// ===============================
cargarAlmacenes();

document.getElementById("btn-mini-logout").addEventListener("click", () => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = "../../login/index.html";
});