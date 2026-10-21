<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$id_compra = $_GET["id_compra"] ?? null;

$sql = "SELECT dc.*, p.nombre AS producto
        FROM detalle_compras dc
        INNER JOIN productos p ON dc.id_producto = p.id
        WHERE dc.id_compra = $id_compra";

$result = $conn->query($sql);

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
?>
