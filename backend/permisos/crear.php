<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$nombre = $_POST["nombre"];

$stmt = $conn->prepare("INSERT INTO permisos (nombre) VALUES (?)");
$stmt->bind_param("s", $nombre);

echo json_encode($stmt->execute() ? ["status"=>"ok"] : ["status"=>"error"]);
?>
