<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$id_producto = intval($_POST["id_producto"]);
$min = intval($_POST["cantidad_minima"]);
$max = intval($_POST["cantidad_maxima"]);
$id_almacen = intval($_POST["id_almacen"] ?? 1); // almacén por defecto
$cantidad_actual = 0;
$estado = 1;

$stmt = $conexion->prepare(
    "INSERT INTO stock 
     (id_producto, id_almacen, cantidad_actual, cantidad_minima, cantidad_maxima, estado)
     VALUES (?, ?, ?, ?, ?, ?)"
);

$stmt->bind_param("iiiiii", $id_producto, $id_almacen, $cantidad_actual, $min, $max, $estado);

echo json_encode($stmt->execute() ? ["status" => "ok"] : ["status" => "error"]);
?>
