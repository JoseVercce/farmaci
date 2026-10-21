<?php

$jsonPath = "farmacia.json";
$data = json_decode(file_get_contents($jsonPath), true);

// Datos principales
$data["nombre"] = $_POST["nombre"];
$data["slogan"] = $_POST["slogan"];

// Colores dinámicos (los que usa tu JS)
$data["colorPrimario"] = $_POST["colorPrimario"];
$data["colorSecundario"] = $_POST["colorSecundario"];
$data["colorSecundarioDark"] = $_POST["colorSecundarioDark"];
$data["colorSidebar"] = $_POST["colorSidebar"];
$data["colorSidebarHover"] = $_POST["colorSidebarHover"];

// Si viene un logo nuevo
if (!empty($_FILES["logo"]["name"])) {

    $logoName = "logo_" . time() . ".png";

    // Ruta física real
    $ruta_fisica = __DIR__ . "/../frontend/assets/css/" . $logoName;

    // Ruta para el frontend
    $ruta_frontend = "../assets/css/" . $logoName;

    if (move_uploaded_file($_FILES["logo"]["tmp_name"], $ruta_fisica)) {
        $data["logo"] = $ruta_frontend;
    }
}

// Guardar JSON
file_put_contents($jsonPath, json_encode($data, JSON_PRETTY_PRINT));

echo "✔ Cambios guardados correctamente";
?>
