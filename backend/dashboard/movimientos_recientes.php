<?php
require_once "../conexion.php";

$sql = "
    SELECT 
        m.fecha,
        m.tipo,
        p.nombre AS producto,
        CASE 
            WHEN m.tipo = 'ENTRADA' THEN m.cantidad_ingreso
            WHEN m.tipo = 'SALIDA' THEN m.cantidad_salida
            ELSE 0
        END AS cantidad
    FROM movimientos m
    INNER JOIN stock s ON m.id_stock = s.id
    INNER JOIN productos p ON s.id_producto = p.id
    ORDER BY m.fecha DESC
    LIMIT 10
";

$stmt = $conexion->prepare($sql);
$stmt->execute();
$result = $stmt->get_result();

$movimientos = [];

while ($row = $result->fetch_assoc()) {
    $movimientos[] = $row;
}

echo json_encode([
    "ok" => true,
    "data" => $movimientos
]);
