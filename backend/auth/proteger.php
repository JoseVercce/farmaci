<?php
session_name("farmacia_sesion");
session_start();

require_once "../conexion.php";

// Si no hay sesión → redirigir al login
if (!isset($_SESSION["id_rol"])) {
    header("Location: ../../login/index.html");
    exit;
}

$id_rol = $_SESSION["id_rol"];

// Obtener URL actual
$archivo = basename($_SERVER["PHP_SELF"]);

// Buscar si esta página existe en la tabla pagina
$sql = $conexion->prepare("SELECT id FROM pagina WHERE url LIKE ?");
$sql->bind_param("s", "%$archivo%");
$sql->execute();
$res = $sql->get_result();

if ($res->num_rows === 0) {
    // Página no registrada → permitir acceso
    return;
}

$id_pagina = $res->fetch_assoc()["id"];

// Buscar permisos del rol para esta página
$sql = $conexion->prepare("
    SELECT per.nombre AS permiso
    FROM rm_per rmp
    INNER JOIN rm_pagin rp ON rp.id = rmp.id_rm_pagin
    INNER JOIN permisos per ON per.id = rmp.id_permiso
    WHERE rp.id_rol = ? AND rmp.id_pagina = ?
");
$sql->bind_param("ii", $id_rol, $id_pagina);
$sql->execute();
$res = $sql->get_result();

$permisos = [];
while ($row = $res->fetch_assoc()) {
    $permisos[] = $row["permiso"];
}

// Si no tiene permisos → bloquear
if (empty($permisos)) {
    echo "<h2 style='padding:40px; text-align:center;'>Acceso denegado</h2>";
    echo "<p style='text-align:center;'>No tienes acceso para ver esta página.</p>";
    exit;
}
?>
