<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$nombre = $_POST["nombre"] ?? null;
$telefono = $_POST["telefono"] ?? null;
$direccion = $_POST["direccion"] ?? null;

if (!$nombre) {
    echo json_encode(["status" => "error", "msg" => "Nombre requerido"]);
    exit;
}

$stmt = $conexion->prepare("INSERT INTO clientes (nombre, telefono, direccion) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $nombre, $telefono, $direccion);

echo json_encode($stmt->execute() ? ["status" => "ok"] : ["status" => "error"]);
?>
