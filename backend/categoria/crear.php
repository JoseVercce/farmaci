<?php
require_once "../conexion.php";

$nombre = $_POST["nombre"] ?? "";
$descripcion = $_POST["descripcion"] ?? "";

if ($nombre === "") {
    echo json_encode(["ok" => false, "error" => "El nombre es obligatorio"]);
    exit;
}

$sql = "INSERT INTO categoria (nombre, descripcion) VALUES (?, ?)";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("ss", $nombre, $descripcion);

if ($stmt->execute()) {
    echo json_encode(["ok" => true]);
} else {
    echo json_encode(["ok" => false, "error" => "Error al crear categoría"]);
}
