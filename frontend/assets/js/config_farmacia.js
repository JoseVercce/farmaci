document.addEventListener("DOMContentLoaded", () => {
    fetch("../../backend/config_farmacia.php")
        .then(res => res.json())
        .then(data => {

            document.getElementById("farmacia-nombre").innerText = data.nombre;
            document.querySelector(".sidebar-logo").src = data.logo;

            document.documentElement.style.setProperty("--color-primario", data.colorPrimario);
            document.documentElement.style.setProperty("--color-sidebar", data.colorSidebar);
            
        })
        .catch(err => console.error("Error cargando configuración de farmacia:", err));
});
document.getElementById("aj-logo").addEventListener("change", function () {
    const fileName = this.files.length ? this.files[0].name : "No se ha seleccionado ningún archivo";
    document.getElementById("file-name").textContent = fileName;
});
