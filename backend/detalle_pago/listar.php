<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$id_venta = $_GET["id_venta"] ?? null;

$sql = "SELECT dp.*, mp.nombre AS metodo
        FROM detalle_pago dp
        INNER JOIN metodo_pago mp ON dp.id_metodo_pago = mp.id
        WHERE dp.id_venta = $id_venta";

$result = $conn->query($sql);

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
?>
