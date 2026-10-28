<?php
require_once __DIR__ . "/permisos_acceso.php";
requireAdminPermisosRol();
require_once __DIR__ . "/../conexion.php";

header("Content-Type: application/json; charset=utf-8");
$id_rol = filter_input(INPUT_GET, "id_rol", FILTER_VALIDATE_INT);
$id_modulo = filter_input(INPUT_GET, "id_modulo", FILTER_VALIDATE_INT);

if (!$id_rol || !$id_modulo) {
    http_response_code(400);
    echo json_encode(["ok" => false, "error" => "El rol y el módulo son obligatorios."]);
    exit;
}

$sql = $conexion->prepare(
    "SELECT DISTINCT rp.id_pagina, rp.id_permiso
     FROM rm_per rp
     INNER JOIN rm_pagin rm ON rm.id = rp.id_rm_pagin
     WHERE rm.id_rol = ? AND rm.id_modulo = ?
     ORDER BY rp.id_pagina, rp.id_permiso"
);
$sql->bind_param("ii", $id_rol, $id_modulo);
$sql->execute();
$res = $sql->get_result();

$data = [];
while ($row = $res->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
