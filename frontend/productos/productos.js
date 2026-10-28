/* ============================
   CONSTANTES
============================ */
const API_PRODUCTOS = "../../backend/productos/";
const API_CATEGORIAS = "../../backend/categoria/";

let paginaProd = 1;
let buscarProd = "";
let estadoProd = "1";


/* ============================
   INICIO
============================ */
document.addEventListener("DOMContentLoaded", () => {
    cargarCategorias();
    inicializarFiltroEstado("filtro-productos", (estado) => {
        estadoProd = estado;
        paginaProd = 1;
        cargarProductos();
    });

    document.getElementById("buscar-producto").addEventListener("input", e => {
        buscarProd = e.target.value;
        paginaProd = 1;
        cargarProductos();
    });

    document.getElementById("btn-nuevo-producto").addEventListener("click", abrirModalNuevo);
    document.getElementById("btn-cancelar").addEventListener("click", cerrarModal);

    document.getElementById("form-producto").addEventListener("submit", guardarProducto);
});


/* ============================
   LISTAR + BUSCAR + PAGINAR
============================ */
async function cargarProductos() {
    const tbody = document.getElementById("tabla-productos");
    tbody.innerHTML = "";

    const res = await fetch(
        `${API_PRODUCTOS}listar.php?buscar=${encodeURIComponent(buscarProd)}&pagina=${paginaProd}&limite=8&estado=${estadoProd}`
    );

    const data = await res.json();

    if (!data.ok) {
        alert("Error al cargar productos");
        return;
    }

    if (data.data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No hay productos para este filtro.</td></tr>';
    }

    data.data.forEach(p => {
        const tr = document.createElement("tr");
        const botonEstado = Number(p.estado) === 1
            ? `<button class="action-btn delete" onclick="eliminarProducto(${p.id})" aria-label="Inactivar producto">🗑️</button>`
            : `<button class="action-btn edit" onclick="activarProducto(${p.id})" aria-label="Activar producto">♻️</button>`;
        tr.innerHTML = `
            <td>${p.nombre}</td>
            <td>${p.descripcion}</td>
            <td>${p.categoria}</td>
            <td>${p.precio}</td>
            <td>${Number(p.estado) === 1 ? "Activo" : "Inactivo"}</td>
            <td class="acciones">
                <button class="action-btn edit" onclick="editarProducto(${p.id})">✏️</button>
                ${botonEstado}
            </td>
        `;
        tbody.appendChild(tr);
    });

    renderPaginacionProductos(data.total);
}


/* ============================
   PAGINACIÓN
============================ */
function renderPaginacionProductos(total) {
    const cont = document.getElementById("paginacion-productos");
    cont.innerHTML = "";

    const totalPaginas = Math.ceil(total / 8);
    if (totalPaginas <= 1) return;

    if (paginaProd > 1) {
        cont.innerHTML += `<button onclick="irPaginaProd(${paginaProd - 1})">Anterior</button>`;
    }

    let inicio = Math.max(1, paginaProd - 2);
    let fin = Math.min(totalPaginas, paginaProd + 2);

    for (let i = inicio; i <= fin; i++) {
        cont.innerHTML += `
            <button class="${i === paginaProd ? 'active' : ''}" onclick="irPaginaProd(${i})">${i}</button>
        `;
    }

    if (paginaProd < totalPaginas) {
        cont.innerHTML += `<button onclick="irPaginaProd(${paginaProd + 1})">Siguiente</button>`;
    }
}

function irPaginaProd(num) {
    paginaProd = num;
    cargarProductos();
}


/* ============================
   CARGAR CATEGORÍAS
============================ */
async function cargarCategorias() {
    const res = await fetch(API_CATEGORIAS + "listar.php");
    const json = await res.json();

    if (!json.ok) {
        console.error("Error backend:", json.error);
        return;
    }

    const select = document.getElementById("prod-categoria");
    select.innerHTML = "";

    json.data.forEach(c => {
        select.innerHTML += `<option value="${c.id}">${c.nombre}</option>`;
    });
}


/* ============================
   NUEVO PRODUCTO
============================ */
function abrirModalNuevo() {
    document.getElementById("modal-title").textContent = "Nuevo producto";
    const form = document.getElementById("form-producto");

    form.reset();

    // Valores válidos para inputs number
    document.getElementById("prod-precio").value = "0.00";
    document.getElementById("prod-min").value = "0";
    document.getElementById("prod-max").value = "1";

    // ID vacío
    document.getElementById("prod-id").value = "";

    // Mostrar modal
    document.getElementById("modal-producto").style.display = "flex";
}


function cerrarModal() {
    document.getElementById("modal-producto").style.display = "none";
}

function mostrarMensajeBonito(texto, icono = "✔️") {
    const modal = document.getElementById("modal-mensaje");
    const mensajeTexto = document.getElementById("mensaje-texto");
    const mensajeIcono = document.getElementById("mensaje-icono");

    mensajeTexto.textContent = texto;
    mensajeIcono.textContent = icono;

    modal.classList.remove("hidden");

    document.getElementById("mensaje-btn").onclick = () => {
        modal.classList.add("hidden");
    };
}

/* ============================
   GUARDAR PRODUCTO
============================ */
async function guardarProducto(e) {
    e.preventDefault();

    const formData = new FormData(document.getElementById("form-producto"));

    const archivo = formData.get("id") ? "actualizar.php" : "crear.php";

    const res = await fetch(API_PRODUCTOS + archivo, {
        method: "POST",
        body: formData
    });

    const json = await res.json();

if (!json.ok) {
    mostrarMensajeBonito("Error: " + json.error, "❌");
    return;
}

cerrarModal();
cargarProductos();
mostrarMensajeBonito("Producto registrado correctamente", "🧴");
}


/* ============================
   EDITAR PRODUCTO
============================ */
async function editarProducto(id) {
    const res = await fetch(API_PRODUCTOS + "obtener.php?id=" + id);
    const json = await res.json();

    if (!json.ok) {
        alert("Error: " + json.error);
        return;
    }

    const p = json.data;

    document.getElementById("modal-title").textContent = "Editar producto";
    document.getElementById("prod-id").value = p.id;
    document.getElementById("prod-nombre").value = p.nombre;
    document.getElementById("prod-descripcion").value = p.descripcion;
    document.getElementById("prod-categoria").value = p.id_categoria;
    document.getElementById("prod-precio").value = p.precio;

    document.getElementById("modal-producto").style.display = "flex";
}

function confirmarAccion(texto, callbackAceptar) {
    const modal = document.getElementById("modal-confirmar");
    const textoElem = document.getElementById("confirmar-texto");

    textoElem.textContent = texto;
    modal.classList.remove("hidden");

    document.getElementById("confirmar-aceptar").onclick = () => {
        modal.classList.add("hidden");
        callbackAceptar(); 
    };

    document.getElementById("confirmar-cancelar").onclick = () => {
        modal.classList.add("hidden");
    };
}

async function activarProducto(id) {
    confirmarAccion("¿Activar nuevamente este producto?", async () => {
        try {
            const formData = new FormData();
            formData.append("id", id);
            const respuesta = await fetch(API_PRODUCTOS + "activar.php", {
                method: "POST",
                body: formData
            });
            const json = await respuesta.json();

            if (!respuesta.ok || !json.ok) {
                mostrarMensajeBonito("Error: " + (json.error || "No se pudo activar el producto."), "❌");
                return;
            }

            await cargarProductos();
            mostrarMensajeBonito(json.msg || "Producto activado correctamente", "✅");
        } catch (error) {
            console.error("Error activando producto:", error);
            mostrarMensajeBonito("Error de conexión al activar el producto.", "❌");
        }
    }, "Sí, activar");
}

/* ============================
   ELIMINAR PRODUCTO
============================ */
function eliminarProducto(id_producto) {

    confirmarAccion("¿Eliminar este producto?", async () => {

        const formData = new FormData();
        formData.append("id", id_producto);

        try {
            const res = await fetch("../../backend/productos/eliminar.php", {
                method: "POST",
                body: formData
            });

            const json = await res.json();

            if (!json.ok) {
                mostrarMensajeBonito("Error: " + json.error, "❌");
                return;
            }

            mostrarMensajeBonito("Producto eliminado correctamente", "🗑️");
            cargarProductos();

        } catch (err) {
            console.error("Error eliminando producto:", err);
            mostrarMensajeBonito("Error inesperado al eliminar", "⚠️");
        }

    });
}



async function moverStock(id_stock, id_destino) {
    const formData = new FormData();
    formData.append("id", id_stock);
    formData.append("id_destino", id_destino);

    try {
        const res = await fetch("../../backend/stock/mover.php", {
            method: "POST",
            body: formData
        });

        const json = await res.json();

        if (json.ok) {
            mostrarMensajeBonito("Producto movido correctamente", "📦");

            cargarProductos();
        } else {
            alert("Error: " + json.msg);
        }

    } catch (error) {
        console.error("Error al mover:", error);
    }
}

document.getElementById("btn-mini-logout").addEventListener("click", () => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = "../../login/index.html";
});