<?php
session_name("farmacia_sesion");
session_start();

header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-store, max-age=0");

require_once __DIR__ . "/../conexion.php";

// ===============================
// VALIDAR SESIÓN
// ===============================
if (!isset($_SESSION["id_rol"]) || !isset($_SESSION["usuario"])) {
    http_response_code(401);
    echo json_encode([
        "status" => "error",
        "message" => "La sesión no tiene un rol asignado."
    ]);
    exit;
}

$id_rol = $_SESSION["id_rol"];

// ===============================
// OBTENER MÓDULOS DEL ROL
// ===============================
$sql = $conexion->prepare("
    SELECT m.id AS id_modulo, m.nombre AS modulo
    FROM rm_pagin rp
    INNER JOIN modulo m ON m.id = rp.id_modulo
    WHERE rp.id_rol = ?
");
$sql->bind_param("i", $id_rol);
$sql->execute();
$res = $sql->get_result();

$modulos = [];
while ($row = $res->fetch_assoc()) {
    $modulos[$row["id_modulo"]] = [
        "nombre" => $row["modulo"],
        "paginas" => []
    ];
}

// ===============================
// OBTENER PERMISOS POR PÁGINA
// ===============================
$sql = $conexion->prepare("
    SELECT rp.id_modulo, p.id AS id_pagina, p.url, per.nombre AS permiso
    FROM rm_per rmp
    INNER JOIN rm_pagin rp ON rp.id = rmp.id_rm_pagin
    INNER JOIN pagina p ON p.id = rmp.id_pagina
    INNER JOIN permisos per ON per.id = rmp.id_permiso
    WHERE rp.id_rol = ?
");
$sql->bind_param("i", $id_rol);
$sql->execute();
$res = $sql->get_result();

while ($row = $res->fetch_assoc()) {

    $mod = $row["id_modulo"];
    $pag = $row["id_pagina"];

    if (!isset($modulos[$mod]["paginas"][$pag])) {
        $modulos[$mod]["paginas"][$pag] = [
            "url" => $row["url"],
            "permisos" => []
        ];
    }

    $modulos[$mod]["paginas"][$pag]["permisos"][] = $row["permiso"];
}

echo json_encode([
    "status" => "success",
    "data" => $modulos
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
?>
