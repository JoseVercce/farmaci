<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$nombre = $_POST["nombre"];
$ubicacion = $_POST["ubicacion"];

$stmt = $conn->prepare("INSERT INTO caja (nombre, ubicacion) VALUES (?, ?)");
$stmt->bind_param("ss", $nombre, $ubicacion);

echo json_encode($stmt->execute() ? ["status"=>"ok"] : ["status"=>"error"]);
?>
