function getPermisosPagina(idPagina) {
    return { crear: 1, actualizar: 1, eliminar: 1, leer: 1 };
}

function aplicarPermisosCRUD(idPagina) {
    const permiso = getPermisosPagina(idPagina);

    const btnCrear = document.querySelector(".btn-crear");
    if (btnCrear) {
        btnCrear.style.display = "";
    }

    const btnEditar = document.querySelectorAll(".btn-editar");
    btnEditar.forEach(btn => {
        btn.style.display = "";
    });

    const btnEliminar = document.querySelectorAll(".btn-eliminar");
    btnEliminar.forEach(btn => {
        btn.style.display = "";
    });

    if (permiso.leer === 0) {
        document.body.innerHTML = "<h2>No tienes permiso para ver esta sección</h2>";
    }
}
