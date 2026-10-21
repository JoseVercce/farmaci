<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$sql = "SELECT id, nombre FROM clientes ORDER BY nombre ASC";
$res = $conexion->query($sql);

$clientes = [];
while ($row = $res->fetch_assoc()) {
    $clientes[] = $row;
}

echo json_encode([
    "status" => "success",
    "data" => $clientes,
    "total" => count($clientes)
]);
?>
