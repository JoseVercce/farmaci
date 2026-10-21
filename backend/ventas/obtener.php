<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$id = $_GET["id"] ?? null;

$stmt = $conexion->prepare("SELECT * FROM ventas WHERE id_venta=?");
$stmt->bind_param("i", $id);
$stmt->execute();

echo json_encode($stmt->get_result()->fetch_assoc());
?>
