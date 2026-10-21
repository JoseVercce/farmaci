<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$sql = "SELECT id, nombre FROM metodo_pago";
$result = $conexion->query($sql);

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode([
    "status" => "success",
    "data" => $data,
    "total" => count($data)
]);
?>
