export function verificarPermiso(paginaActual) {
    const usuario = JSON.parse(localStorage.getItem("usuarioActual") || "null");

    if (!usuario) {
        window.location.href = "../../login/index.html";
        return false;
    }

    return true;
}
