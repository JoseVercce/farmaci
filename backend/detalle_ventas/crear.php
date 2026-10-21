<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$id_producto = $_POST["id_producto"];
$id_venta = $_POST["id_venta"];
$cantidad = $_POST["cantidad"];
$precio = $_POST["precio_unitario"];

$stmt = $conn->prepare(
    "INSERT INTO detalle_ventas (id_producto, id_venta, cantidad, precio_unitario)
     VALUES (?, ?, ?, ?)"
);
$stmt->bind_param("iiid", $id_producto, $id_venta, $cantidad, $precio);

echo json_encode($stmt->execute() ? ["status" => "ok"] : ["status" => "error"]);
?>
