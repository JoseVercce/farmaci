const API_USER = "../../backend/usuario/";

document.addEventListener("DOMContentLoaded", () => {
    cargarUsuarios();
    cargarRolesUsuario();

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

    const res = await fetch(API_USER + "listar.php");
    const json = await res.json();

    if (!json.ok) {
        alert("Error al cargar usuarios");
        return;
    }

    json.data.forEach(u => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${u.nombre}</td>
            <td>${u.usuario}</td>
            <td>${u.correo}</td>
            <td>${u.telefono}</td>
            <td>${u.roles}</td>
            <td class="acciones">
                <button class="action-btn edit" onclick="editarUsuario(${u.id})">✏️</button>
                <button class="action-btn delete" onclick="eliminarUsuario(${u.id})">🗑️</button>
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
async function eliminarUsuario(id) {
    if (!confirm("¿Eliminar usuario?")) return;

    const fd = new FormData();
    fd.append("id", id);

    const res = await fetch(API_USER + "eliminar.php", {
        method: "POST",
        body: fd
    });

    const json = await res.json();

    if (json.ok) cargarUsuarios();
    else alert("Error al eliminar usuario");
}

document.getElementById("btn-mini-logout").addEventListener("click", () => {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = "../../login/index.html";
});