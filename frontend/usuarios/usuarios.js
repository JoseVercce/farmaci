const API_USER = "../../backend/usuario/";
let estadoUsuario = "1";

document.addEventListener("DOMContentLoaded", () => {
    cargarRolesUsuario();
    inicializarFiltroEstado("filtro-usuarios", (estado) => {
        estadoUsuario = estado;
        cargarUsuarios();
    });

    const btnNuevo = document.getElementById("btn-nuevo-usuario");
    const modal = document.getElementById("modal-usuario");
    const form = document.getElementById("form-usuario");

    // NUEVO USUARIO
    btnNuevo.addEventListener("click", async () => {
        form.reset();
        document.getElementById("modal-user-title").textContent = "Nuevo usuario";
        document.getElementById("user-id").value = "";

        await cargarRolesUsuario();

        modal.classList.remove("hidden");
    });

    // CANCELAR
    document.getElementById("btn-cancelar-usuario").addEventListener("click", () => {
        modal.classList.add("hidden");
    });

    // GUARDAR
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const fd = new FormData(form);
        const id = document.getElementById("user-id").value;

        const archivo = id ? "actualizar.php" : "crear.php";

        const res = await fetch(API_USER + archivo, {
            method: "POST",
            body: fd
        });

        const json = await res.json();

        if (json.ok) {
            modal.classList.add("hidden");
            cargarUsuarios();
            mostrarMensajeBonito(
                id ? "Usuario actualizado correctamente" : "Usuario registrado correctamente",
                "👤"
            );
        } else {
            alert("Error: " + json.error);
        }
    });
});


// =============================
// LISTAR USUARIOS
// =============================
async function cargarUsuarios() {
    const tbody = document.getElementById("tabla-usuarios");
    tbody.innerHTML = "";

    const res = await fetch(API_USER + "listar.php?estado=" + encodeURIComponent(estadoUsuario));
    const json = await res.json();

    if (!json.ok) {
        alert("Error al cargar usuarios");
        return;
    }

    if (json.data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No hay usuarios para este filtro.</td></tr>';
    }

    json.data.forEach(u => {
        const tr = document.createElement("tr");
        const botonEstado = Number(u.estado) === 1
            ? `<button class="action-btn delete" onclick="eliminarUsuario(${u.id})" aria-label="Inactivar usuario">🗑️</button>`
            : `<button class="action-btn edit" onclick="activarUsuario(${u.id})" aria-label="Activar usuario">♻️</button>`;
        tr.innerHTML = `
            <td>${u.nombre}</td>
            <td>${u.usuario}</td>
            <td>${u.correo}</td>
            <td>${u.telefono}</td>
            <td>${u.roles}</td>
            <td>${Number(u.estado) === 1 ? "Activo" : "Inactivo"}</td>
            <td class="acciones">
                <button class="action-btn edit" onclick="editarUsuario(${u.id})">✏️</button>
                ${botonEstado}
            </td>
        `;
        tbody.appendChild(tr);
    });
}


// =============================
// CARGAR ROLES COMO CHECKBOXES
// =============================
async function cargarRolesUsuario() {
    const res = await fetch("../../backend/rol/listar.php");
    const json = await res.json();

    const cont = document.getElementById("lista-roles");
    cont.innerHTML = "";

    json.data.forEach(r => {
        cont.innerHTML += `
            <label>
                <input type="checkbox" name="roles[]" value="${r.id}">
                ${r.nombre}
            </label>
        `;
    });
}


// =============================
// EDITAR USUARIO (MULTI‑ROL)
// =============================
async function editarUsuario(id) {

    await cargarRolesUsuario();

    const res = await fetch(API_USER + "obtener.php?id=" + id);
    const json = await res.json();

    if (!json.ok) {
        alert("Error al obtener usuario");
        return;
    }

    const u = json.data;

    document.getElementById("modal-user-title").textContent = "Editar usuario";
    document.getElementById("user-id").value = u.id;
    document.getElementById("user-nombre").value = u.nombre;
    document.getElementById("user-usuario").value = u.usuario;
    document.getElementById("user-correo").value = u.correo;
    document.getElementById("user-telefono").value = u.telefono;
    document.getElementById("user-estado").value = u.estado;

    document.getElementById("user-clave").value = "";

    // MARCAR ROLES
    const checkboxes = document.querySelectorAll('#lista-roles input[type="checkbox"]');
    checkboxes.forEach(chk => {
        chk.checked = u.roles.includes(parseInt(chk.value));
    });

    document.getElementById("modal-usuario").classList.remove("hidden");

}


// =============================
// ELIMINAR USUARIO
// =============================
async function activarUsuario(id) {
    confirmarAccion("¿Activar nuevamente este usuario?", async () => {
        const fd = new FormData();
        fd.append("id", id);

        try {
            const respuesta = await fetch(API_USER + "activar.php", {
                method: "POST",
                body: fd
            });
            const json = await respuesta.json();

            if (!respuesta.ok || !json.ok) {
                mostrarMensajeBonito("Error: " + (json.msg || "No se pudo activar el usuario."), "❌");
                return;
            }

            await cargarUsuarios();
            mostrarMensajeBonito(json.msg || "Usuario activado correctamente", "✅");
        } catch (error) {
            console.error("Error activando usuario:", error);
            mostrarMensajeBonito("Error de conexión al activar el usuario.", "❌");
        }
    }, "Sí, activar");
}

async function eliminarUsuario(id) {
    confirmarAccion("¿Eliminar este usuario?", async () => {
        const fd = new FormData();
        fd.append("id", id);

        const res = await fetch(API_USER + "eliminar.php", {
            method: "POST",
            body: fd
        });

        const json = await res.json();

        if (json.ok) {
            cargarUsuarios();
            mostrarMensajeBonito(json.msg || "Usuario eliminado correctamente", "🗑️");
        } else {
            alert("Error al eliminar usuario");
        }
    }, "Sí, eliminar");
}

document.getElementById("btn-mini-logout").addEventListener("click", () => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = "../../login/index.html";
});