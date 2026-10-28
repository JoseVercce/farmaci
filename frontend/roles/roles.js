// ===============================
// VARIABLES
// ===============================
const tablaRoles = document.getElementById("tabla-roles");
const buscarRol = document.getElementById("buscar-rol");
const modalRol = document.getElementById("modal-rol");
const modalPermisos = document.getElementById("modalPermisosRol");
const catalogosPermisos = {
    modulos: [],
    paginas: [],
    permisos: []
};
const carpetasModulo = {
    "dashboard": "dashboard",
    "categorias": "categorias",
    "clientes": "clientes",
    "productos": "productos",
    "stock": "stock",
    "movimientos": "movimientos",
    "compras": "compras",
    "facturas": "facturas",
    "proveedores": "proveedores",
    "roles": "roles",
    "usuarios": "usuarios",
    "almacenes": "almacenes"
};
let idModuloSeleccionado = null;
let solicitudPermisos = 0;

// ===============================
// CARGAR ROLES
// ===============================
function cargarRolesTabla() {
    fetch("../../backend/rol/listar.php")
        .then(r => r.json())
        .then(roles => mostrarRoles(roles.data));
}

function mostrarRoles(roles) {
    tablaRoles.innerHTML = "";

    roles.forEach(rol => {
        tablaRoles.innerHTML += `
            <tr>
                <td>${rol.nombre}</td>
                <td>${rol.descripcion}</td>
                <td class="acciones">
                    <button class="action-btn edit" onclick="editarRol(${rol.id})">✏️</button>
                    <button class="action-btn delete" onclick="eliminarRol(${rol.id})">🗑️</button>
                    <button class="action-btn permiso" onclick="abrirModalPermisos(${rol.id})">📋</button>
                </td>
            </tr>
        `;
    });
}

// ===============================
// BUSCAR ROLES
// ===============================
buscarRol.addEventListener("keyup", () => {
    const texto = buscarRol.value.trim();

    fetch("../../backend/rol/buscar.php?texto=" + texto)
        .then(r => r.json())
        .then(roles => mostrarRoles(roles.data));
});

// ===============================
// NUEVO ROL
// ===============================
document.getElementById("btn-nuevo-rol").addEventListener("click", () => {
    document.getElementById("modal-title").innerText = "Nuevo rol";
    document.getElementById("rol-id").value = "";
    document.getElementById("rol-nombre").value = "";
    document.getElementById("rol-descripcion").value = "";
    modalRol.classList.remove("hidden");
});

// ===============================
// CERRAR MODAL ROL
// ===============================
document.getElementById("btn-cancelar").addEventListener("click", () => {
    modalRol.classList.add("hidden");
});

// ===============================
// GUARDAR ROL
// ===============================
document.getElementById("form-rol").addEventListener("submit", e => {
    e.preventDefault();

    const datos = new FormData(document.getElementById("form-rol"));
    const esEdicion = Boolean(datos.get("id"));

    fetch("../../backend/rol/guardar.php", {
        method: "POST",
        body: datos
    })
    .then(r => r.json())
    .then(res => {
        if (!res.mensaje) {
            alert("No se pudo guardar el rol.");
            return;
        }
        modalRol.classList.add("hidden");
        cargarRolesTabla();
        mostrarMensajeBonito(
            esEdicion ? "Rol actualizado correctamente" : "Rol registrado correctamente",
            "⚙️"
        );
    });
});

// ===============================
// EDITAR ROL
// ===============================
function editarRol(id) {
    fetch("../../backend/rol/obtener.php?id=" + id)
        .then(r => r.json())
        .then(rol => {
            document.getElementById("modal-title").innerText = "Editar rol";
            document.getElementById("rol-id").value = rol.id;
            document.getElementById("rol-nombre").value = rol.nombre;
            document.getElementById("rol-descripcion").value = rol.descripcion;
            modalRol.classList.remove("hidden");
        });
}

// ===============================
// ELIMINAR ROL
// ===============================
function eliminarRol(id) {
    confirmarAccion("¿Eliminar este rol? Esta acción no se puede deshacer.", async () => {
        try {
            const respuesta = await fetch(`../../backend/rol/eliminar.php?id=${id}`);
            const res = await respuesta.json();

            if (!respuesta.ok || res.status === "error") {
                console.error("Error al eliminar el rol:", res.message, res.debug);
                mostrarMensajeBonito(res.message || "No se pudo eliminar el rol.", "❌");
                return;
            }

            cargarRolesTabla();
            mostrarMensajeBonito(res.message || "Rol eliminado correctamente", "🗑️");
        } catch (error) {
            console.error("Error al eliminar el rol:", error);
            mostrarMensajeBonito("Error de conexión al eliminar el rol.", "❌");
        }
    }, "Sí, eliminar");
}


// ===============================
// PERMISOS POR ROL
// ===============================

// Abrir modal
async function abrirModalPermisos(idRol) {
    solicitudPermisos += 1;
    modalPermisos.classList.remove("hidden");
    establecerEstadoPermisos("Cargando roles, módulos y permisos...");
    document.getElementById("listaModulos").replaceChildren();
    document.getElementById("listaPaginas").replaceChildren();
    document.getElementById("btnGuardarPermisos").disabled = true;

    try {
        const [respuestaRoles, modulos, paginas, permisos] = await Promise.all([
            fetch("../../backend/rol/listar.php"),
            fetch("../../backend/modulo/listar.php"),
            fetch("../../backend/pagina/listar.php"),
            fetch("../../backend/permisos/listar.php")
        ]);
        const respuestaRolesJson = await respuestaRoles.json();
        if (!respuestaRoles.ok || !respuestaRolesJson.data) {
            throw new Error(respuestaRolesJson.error || "No se pudieron cargar los roles.");
        }
        if (!modulos.ok || !paginas.ok || !permisos.ok) {
            throw new Error("No se pudieron cargar los datos para configurar permisos.");
        }

        catalogosPermisos.modulos = await modulos.json();
        catalogosPermisos.paginas = await paginas.json();
        catalogosPermisos.permisos = await permisos.json();

        const select = document.getElementById("selectRol");
        select.replaceChildren();
        respuestaRolesJson.data.forEach(rol => {
            const opcion = document.createElement("option");
            opcion.value = rol.id;
            opcion.textContent = rol.nombre;
            select.appendChild(opcion);
        });
        select.value = String(idRol);

        mostrarModulos();
        idModuloSeleccionado = null;
        document.getElementById("tituloPermisosModulo").textContent = "Selecciona un módulo";
        establecerEstadoPermisos("Selecciona un módulo para consultar sus permisos.");
    } catch (error) {
        establecerEstadoPermisos(error.message, true);
    }
}

document.getElementById("selectRol").addEventListener("change", () => {
    if (idModuloSeleccionado !== null) {
        seleccionarModulo(idModuloSeleccionado);
    }
});

function mostrarModulos() {
    const contenedor = document.getElementById("listaModulos");
    contenedor.replaceChildren();

    catalogosPermisos.modulos.forEach(modulo => {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = "mod-btn";
        boton.textContent = modulo.nombre;
        boton.dataset.modulo = modulo.id;
        boton.addEventListener("click", () => seleccionarModulo(modulo.id));
        contenedor.appendChild(boton);
    });
}

async function seleccionarModulo(idModulo) {
    const solicitudActual = ++solicitudPermisos;
    idModuloSeleccionado = Number(idModulo);
    const idRol = document.getElementById("selectRol").value;
    const modulo = catalogosPermisos.modulos.find(item => Number(item.id) === idModuloSeleccionado);
    document.getElementById("tituloPermisosModulo").textContent =
        modulo ? `Permisos de ${modulo.nombre}` : "Permisos del módulo";
    document.querySelectorAll(".mod-btn").forEach(boton => {
        boton.classList.toggle("active", Number(boton.dataset.modulo) === idModuloSeleccionado);
    });
    document.getElementById("btnGuardarPermisos").disabled = true;
    document.getElementById("listaPaginas").replaceChildren();
    establecerEstadoPermisos("Cargando permisos...");

    try {
        const respuesta = await fetch(
            `../../backend/rol/permisos_get.php?id_rol=${encodeURIComponent(idRol)}&id_modulo=${encodeURIComponent(idModuloSeleccionado)}`
        );
        const permisosRol = await respuesta.json();
        if (solicitudActual !== solicitudPermisos) return;
        if (!respuesta.ok || !Array.isArray(permisosRol)) {
            throw new Error(permisosRol.error || "No se pudieron consultar los permisos del rol.");
        }
        const cantidadPaginas = mostrarPaginas(permisosRol, modulo);
        document.getElementById("btnGuardarPermisos").disabled = cantidadPaginas === 0;
        establecerEstadoPermisos(cantidadPaginas
            ? "Los cambios se aplican al módulo seleccionado."
            : "No hay páginas registradas para este módulo en el catálogo.");
    } catch (error) {
        if (solicitudActual !== solicitudPermisos) return;
        document.getElementById("listaPaginas").replaceChildren();
        establecerEstadoPermisos(error.message, true);
    }
}

function mostrarPaginas(permisosRol, modulo) {
    const contenedor = document.getElementById("listaPaginas");
    contenedor.replaceChildren();

    const nombreModulo = String(modulo.nombre).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const carpetaModulo = carpetasModulo[nombreModulo];
    const paginasModulo = catalogosPermisos.paginas.filter(pagina => {
        try {
            const ruta = new URL(pagina.url, window.location.href).pathname.toLowerCase();
            return ruta.includes(`/frontend/${carpetaModulo}/`);
        } catch (error) {
            console.error("URL inválida en el catálogo de páginas:", pagina.url, error);
            return false;
        }
    });
    const permisosAsignados = new Set(
        permisosRol.map(item => `${item.id_pagina}:${item.id_permiso}`)
    );

    paginasModulo.forEach(pagina => {
        const elemento = document.createElement("section");
        elemento.className = "pagina-item";

        const titulo = document.createElement("h4");
        titulo.textContent = pagina.nombre;
        elemento.appendChild(titulo);

        const url = document.createElement("p");
        url.className = "pagina-url";
        url.textContent = pagina.url;
        elemento.appendChild(url);

        const listaPermisos = document.createElement("div");
        listaPermisos.className = "permisos-pagina";

        catalogosPermisos.permisos.forEach(permiso => {
            const etiqueta = document.createElement("label");
            etiqueta.className = "permiso-opcion";

            const casilla = document.createElement("input");
            casilla.type = "checkbox";
            casilla.className = "chkPermiso";
            casilla.dataset.pagina = pagina.id;
            casilla.dataset.permiso = permiso.id;
            casilla.checked = permisosAsignados.has(`${pagina.id}:${permiso.id}`);

            etiqueta.append(casilla, document.createTextNode(permiso.nombre));
            listaPermisos.appendChild(etiqueta);
        });

        elemento.appendChild(listaPermisos);
        contenedor.appendChild(elemento);
    });
    return paginasModulo.length;
}

function establecerEstadoPermisos(mensaje, esError = false) {
    const estado = document.getElementById("estadoPermisosRol");
    estado.textContent = mensaje;
    estado.classList.toggle("error", esError);
}

document.getElementById("btnGuardarPermisos").addEventListener("click", async () => {
    const idRol = document.getElementById("selectRol").value;
    if (idModuloSeleccionado === null || !idRol) {
        establecerEstadoPermisos("Selecciona un rol y un módulo antes de guardar.", true);
        return;
    }

    const permisos = [];

    document.querySelectorAll(".chkPermiso").forEach(chk => {
        if (chk.checked) {
            permisos.push({
                pagina: Number(chk.dataset.pagina),
                permiso: Number(chk.dataset.permiso)
            });
        }
    });

    const boton = document.getElementById("btnGuardarPermisos");
    boton.disabled = true;
    document.querySelectorAll(".chkPermiso").forEach(chk => {
        chk.disabled = true;
    });
    establecerEstadoPermisos("Guardando cambios...");

    try {
        const respuesta = await fetch("../../backend/rol/permisos_guardar.php", {
            method: "POST",
            body: new URLSearchParams({
                id_rol: idRol,
                id_modulo: idModuloSeleccionado,
                permisos: JSON.stringify(permisos)
            })
        });
        const resultado = await respuesta.json();
        if (!respuesta.ok || !resultado.ok) {
            throw new Error(resultado.error || "No se pudieron guardar los permisos.");
        }

        boton.disabled = false;
        document.querySelectorAll(".chkPermiso").forEach(chk => {
            chk.disabled = false;
        });
        establecerEstadoPermisos(resultado.mensaje);
    } catch (error) {
        establecerEstadoPermisos(error.message, true);
        boton.disabled = false;
        document.querySelectorAll(".chkPermiso").forEach(chk => {
            chk.disabled = false;
        });
    }
});

function cerrarModalPermisos() {
    solicitudPermisos += 1;
    modalPermisos.classList.add("hidden");
    idModuloSeleccionado = null;
}

// ===============================
// INICIO
// ===============================
cargarRolesTabla();
