<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$nombre = $_POST["nombre"];
$url = $_POST["url"];

$stmt = $conn->prepare("INSERT INTO pagina (nombre, url) VALUES (?, ?)");
$stmt->bind_param("ss", $nombre, $url);

echo json_encode($stmt->execute() ? ["status"=>"ok"] : ["status"=>"error"]);
?>
