<?php
require_once "../conexion.php";

$id = $_POST["id"] ?? 0;
$nombre = $_POST["nombre"] ?? "";
$descripcion = $_POST["descripcion"] ?? "";

if ($id == 0 || $nombre === "") {
    echo json_encode(["ok" => false, "error" => "Datos incompletos"]);
    exit;
}

$sql = "UPDATE categoria SET nombre = ?, descripcion = ? WHERE id = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("ssi", $nombre, $descripcion, $id);

if ($stmt->execute()) {
    echo json_encode(["ok" => true]);
} else {
    echo json_encode(["ok" => false, "error" => "Error al actualizar categoría"]);
}
