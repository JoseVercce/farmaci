<?php
require_once "../conexion.php";

$nombre = $_POST["nombre"] ?? "";
$ubicacion = $_POST["ubicacion"] ?? "";

if (empty($nombre)) {
    echo json_encode(["ok" => false, "msg" => "El nombre del almacén es obligatorio"]);
    exit;
}

$sql = "INSERT INTO almacen (nombre, ubicacion) VALUES (?, ?)";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("ss", $nombre, $ubicacion);

if ($stmt->execute()) {
    echo json_encode(["ok" => true, "msg" => "Almacén creado correctamente"]);
} else {
    echo json_encode(["ok" => false, "msg" => "Error al crear almacén"]);
}
