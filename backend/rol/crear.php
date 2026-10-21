<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$nombre = $_POST["nombre"] ?? null;
$descripcion = $_POST["descripcion"] ?? null;

if (!$nombre) {
    echo json_encode(["ok" => false, "error" => "Nombre requerido"]);
    exit;
}

$stmt = $conexion->prepare("
    INSERT INTO rol (nombre, descripcion)
    VALUES (?, ?)
");
$stmt->bind_param("ss", $nombre, $descripcion);

if (!$stmt->execute()) {
    echo json_encode(["ok" => false, "error" => "No se pudo crear el rol"]);
    exit;
}

echo json_encode(["ok" => true]);
?>
