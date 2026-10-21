<?php
header("Content-Type: application/json");
require "../conexion.php";

$id = $_POST["id"] ?? null;
$nombre = $_POST["nombre"] ?? "";
$ubicacion = $_POST["ubicacion"] ?? "";

if (!$id) {
    echo json_encode(["ok" => false, "msg" => "ID de almacén no recibido"]);
    exit;
}

$sql = "UPDATE almacen SET nombre = ?, ubicacion = ? WHERE id = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("ssi", $nombre, $ubicacion, $id);

if ($stmt->execute()) {
    echo json_encode(["ok" => true]);
} else {
    echo json_encode(["ok" => false, "msg" => $conexion->error]);
}
