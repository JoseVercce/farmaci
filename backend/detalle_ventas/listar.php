<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$id_venta = $_GET["id_venta"] ?? null;

$sql = "SELECT dv.*, p.nombre AS producto
        FROM detalle_ventas dv
        INNER JOIN productos p ON dv.id_producto = p.id
        WHERE dv.id_venta = $id_venta";

$result = $conn->query($sql);

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
?>
