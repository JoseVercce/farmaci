<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$id = $_GET["id"] ?? null;

if (!$id) {
    echo json_encode(["ok" => false, "msg" => "ID no recibido"]);
    exit;
}

// Obtener datos de la venta
$sql = "SELECT 
            v.id_venta,
            v.numero_factura,
            v.fecha,
            v.total,
            c.nombre AS cliente,
            u.nombre AS usuario
        FROM ventas v
        INNER JOIN clientes c ON v.id_cliente = c.id_cliente
        INNER JOIN usuario u ON v.id_usuario = u.id_usuario
        WHERE v.id_venta = ?";


$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$venta = $stmt->get_result()->fetch_assoc();

// Obtener detalle
$sql2 = "SELECT dv.id_producto, p.nombre, dv.cantidad, dv.precio_unitario,
                (dv.cantidad * dv.precio_unitario) AS subtotal
         FROM detalle_ventas dv
         INNER JOIN productos p ON dv.id_producto = p.id_producto
         WHERE dv.id_venta = ?";

$stmt2 = $conexion->prepare($sql2);
$stmt2->bind_param("i", $id);
$stmt2->execute();
$detalle = $stmt2->get_result()->fetch_all(MYSQLI_ASSOC);

echo json_encode([
    "ok" => true,
    "venta" => $venta,
    "detalle" => $detalle
]);
?>
