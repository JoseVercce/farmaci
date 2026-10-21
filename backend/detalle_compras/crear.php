<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$id_producto = $_POST["id_producto"];
$id_compra   = $_POST["id_compra"];
$cantidad    = $_POST["cantidad"];
$costo       = $_POST["costo_unitario"];
$id_almacen  = $_POST["id_almacen"];

$stmt = $conexion->prepare(
    "INSERT INTO detalle_compras (id_producto, id_compra, cantidad, costo_unitario, id_almacen)
     VALUES (?, ?, ?, ?, ?)"
);

$stmt->bind_param("iiidi", $id_producto, $id_compra, $cantidad, $costo, $id_almacen);

echo json_encode(
    $stmt->execute()
        ? ["status" => "ok"]
        : ["status" => "error", "msg" => $conexion->error]
);
?>
