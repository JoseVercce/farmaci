<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$nombre = $_POST["nombre"] ?? "";
$cedula = $_POST["cedula"] ?? "";
$telefono = $_POST["telefono"] ?? "";
$direccion = $_POST["direccion"] ?? "";

if ($nombre === "") {
    echo json_encode(["status" => "error", "message" => "El nombre es obligatorio"]);
    exit;
}

$stmt = $conexion->prepare("
    INSERT INTO clientes (nombre, cedula, telefono, direccion)
    VALUES (?, ?, ?, ?)
");

$stmt->bind_param("ssss", $nombre, $cedula, $telefono, $direccion);

if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => $stmt->error]);
}
?>
