<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$id         = $_POST["id"] ?? null;
$nombre     = $_POST["nombre"] ?? null;
$descripcion = $_POST["descripcion"] ?? null;

if (!$id) {
    echo json_encode(["status" => "error", "msg" => "ID requerido"]);
    exit;
}

$stmt = $conexion->prepare("UPDATE rol SET nombre=?, descripcion=? WHERE id=?");
$stmt->bind_param("ssi", $nombre, $descripcion, $id);

if ($stmt->execute()) {
    echo json_encode(["status" => "ok"]);
} else {
    echo json_encode(["status" => "error", "msg" => $conexion->error]);
}
?>
