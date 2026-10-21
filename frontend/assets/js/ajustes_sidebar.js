document.addEventListener("DOMContentLoaded", () => {

    // Aplicar colores al iniciar la página
    fetch("../../backend/config_farmacia.php")
        .then(res => res.json())
        .then(data => aplicarColores(data));

    const modal = document.getElementById("modal-ajustes");
    const btn = document.getElementById("sidebar-brand-btn");

    btn.addEventListener("click", () => {
        modal.classList.remove("hidden");
        cargarDatos();
    });

    document.getElementById("aj-cerrar").addEventListener("click", () => {
        modal.classList.add("hidden");
    });

    document.getElementById("aj-logo").addEventListener("change", function() {
        const file = this.files[0];
        if (file) {
            document.getElementById("aj-preview-logo").src = URL.createObjectURL(file);
        }
    });

    document.getElementById("aj-guardar").addEventListener("click", guardarDatos);
});


function cargarDatos() {
    fetch("../../backend/config_farmacia.php")
        .then(res => res.json())
        .then(data => {

            document.getElementById("aj-nombre").value = data.nombre || "";
            document.getElementById("aj-preview-logo").src = data.logo || "";

            document.getElementById("aj-color-primario").value = data.colorPrimario || "#7B3AED";
            document.getElementById("aj-color-secundario").value = data.colorSecundario || "#14B8A6";
            document.getElementById("aj-color-sidebar").value = data.colorSidebar || "#5B21B6";

            aplicarColores(data); // ← IMPORTANTE
        });
}




function guardarDatos() {
    const formData = new FormData();

    formData.append("nombre", document.getElementById("aj-nombre").value);

    formData.append("colorPrimario", document.getElementById("aj-color-primario").value);
    formData.append("colorSecundario", document.getElementById("aj-color-secundario").value);
    formData.append("colorSidebar", document.getElementById("aj-color-sidebar").value);

    const logoFile = document.getElementById("aj-logo").files[0];
    if (logoFile) formData.append("logo", logoFile);

    fetch("../../backend/guardar_farmacia.php", {
        method: "POST",
        body: formData
    })
    .then(res => res.text())
    .then(msg => {
        alert("Cambios guardados correctamente");
        location.reload();
    });
}

function aplicarColores(data) {
    const root = document.documentElement;

    root.style.setProperty("--color-primary", data.colorPrimario || "#7B3AED");
    root.style.setProperty("--color-secondary", data.colorSecundario || "#14B8A6");
    root.style.setProperty("--color-sidebar-bg", data.colorSidebar || "#5B21B6");
    root.style.setProperty("--color-sidebar-hover", data.colorSidebarHover || "#7C3AED");
}

