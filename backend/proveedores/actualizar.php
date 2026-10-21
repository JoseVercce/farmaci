<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$id = $_POST["id"] ?? null;
$nombre = $_POST["nombre"] ?? null;
$telefono = $_POST["telefono"] ?? "";
$correo = $_POST["correo"] ?? "";
$direccion = $_POST["direccion"] ?? "";

if (!$id || !$nombre) {
    echo json_encode(["status" => "error", "msg" => "Datos incompletos"]);
    exit;
}

$stmt = $conexion->prepare("
    UPDATE proveedores
    SET nombre = ?, telefono = ?, correo = ?, direccion = ?
    WHERE id = ?
");
$stmt->bind_param("ssssi", $nombre, $telefono, $correo, $direccion, $id);

echo json_encode($stmt->execute()
    ? ["status" => "success"]
    : ["status" => "error", "msg" => "No se pudo actualizar"]);
