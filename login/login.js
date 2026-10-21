document.getElementById("form-login").addEventListener("submit", async (e) => {
    e.preventDefault();

    const usuario = document.getElementById("login-usuario").value.trim();
    const clave   = document.getElementById("login-pass").value.trim();

    const formData = new FormData();
    formData.append("usuario", usuario);
    formData.append("clave", clave);

    const resp = await fetch("../backend/login/login.php", {
        method: "POST",
        body: formData
    });

    let data;

    try {
        data = await resp.json();
    } catch (error) {
        console.error("Error: el servidor devolvió datos inválidos.");
        const texto = await resp.clone().text();   // 🔥 FIX
        console.log("Respuesta del servidor:", texto);
        alert("Error: el servidor devolvió datos inválidos.");
        return;
    }

    if (data.status === "success") {
        localStorage.setItem("usuarioActual", JSON.stringify(data.usuario || {}));

        if (data.permisos) {
            localStorage.setItem("permisos_usuario", JSON.stringify(data.permisos));
        }
        if (data.menu) {
            localStorage.setItem("menu_usuario", JSON.stringify(data.menu));
        }

        window.location.href = "../frontend/dashboard/index.html";
        return;
    }

    alert(data.message);
});
