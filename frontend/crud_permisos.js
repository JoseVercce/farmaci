function aplicarPermisosCRUD() {
    document.querySelectorAll(".btn-crear").forEach(btn => btn.style.display = "");
    document.querySelectorAll(".btn-editar").forEach(btn => btn.style.display = "");
    document.querySelectorAll(".btn-eliminar").forEach(btn => btn.style.display = "");
}

document.addEventListener("DOMContentLoaded", aplicarPermisosCRUD);
