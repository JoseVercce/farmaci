<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$id = $_GET["id"] ?? null;

if (!$id) {
    echo json_encode(["status" => "error", "msg" => "ID requerido"]);
    exit;
}

$stmt = $conexion->prepare("
    SELECT id, nombre, telefono, correo, direccion
    FROM proveedores
    WHERE id = ?
");
$stmt->bind_param("i", $id);
$stmt->execute();

$res = $stmt->get_result();
$prov = $res->fetch_assoc();

echo json_encode($prov ?: ["status" => "error", "msg" => "Proveedor no encontrado"]);
