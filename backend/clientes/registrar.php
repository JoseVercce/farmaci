<?php
require_once "../conexion.php";

$cedula = $_POST["cedula"] ?? null;
$nombre = $_POST["nombre"] ?? null;
$telefono = $_POST["telefono"] ?? null;
$direccion = $_POST["direccion"] ?? null;

if (!$cedula || !$nombre) {
    echo json_encode(["ok" => false, "msg" => "Cédula y nombre son obligatorios"]);
    exit;
}

$sql = $conexion->prepare("
    INSERT INTO clientes (cedula, nombre, telefono, direccion)
    VALUES (?, ?, ?, ?)
");
$sql->bind_param("ssss", $cedula, $nombre, $telefono, $direccion);

if ($sql->execute()) {
    echo json_encode([
        "ok" => true,
        "id" => $conexion->insert_id
    ]);
} else {
    echo json_encode([
        "ok" => false,
        "msg" => "No se pudo registrar el cliente"
    ]);
}
