<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$nombre = $_POST["nombre"] ?? null;
$telefono = $_POST["telefono"] ?? "";
$correo = $_POST["correo"] ?? "";
$direccion = $_POST["direccion"] ?? "";

if (!$nombre) {
    echo json_encode(["status" => "error", "msg" => "Nombre requerido"]);
    exit;
}

$stmt = $conexion->prepare("
    INSERT INTO proveedores (nombre, telefono, correo, direccion)
    VALUES (?, ?, ?, ?)
");
$stmt->bind_param("ssss", $nombre, $telefono, $correo, $direccion);

echo json_encode($stmt->execute()
    ? ["status" => "success"]
    : ["status" => "error", "msg" => "No se pudo crear"]);
