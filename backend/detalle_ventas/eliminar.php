<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$id = $_POST["id"] ?? null;

$stmt = $conn->prepare("DELETE FROM detalle_ventas WHERE id=?");
$stmt->bind_param("i", $id);

echo json_encode($stmt->execute() ? ["status" => "ok"] : ["status" => "error"]);
?>
