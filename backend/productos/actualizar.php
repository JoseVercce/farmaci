<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$id = $_POST["id"] ?? null;
$nombre = $_POST["nombre"] ?? null;
$descripcion = $_POST["descripcion"] ?? null;
$id_categoria = $_POST["id_categoria"] ?? null;
$precio = $_POST["precio"] ?? null;

// NUEVO: recibir límites de stock
$cantidad_minima = $_POST["cantidad_minima"] ?? null;
$cantidad_maxima = $_POST["cantidad_maxima"] ?? null;

// ================================
// ACTUALIZAR PRODUCTO
// ================================
$stmt = $conexion->prepare(
    "UPDATE productos SET nombre=?, descripcion=?, id_categoria=?, precio=? WHERE id=?"
);
$stmt->bind_param("ssidi", $nombre, $descripcion, $id_categoria, $precio, $id);

if (!$stmt->execute()) {
    echo json_encode(["ok" => false, "error" => "No se pudo actualizar el producto"]);
    exit;
}

// ================================
// ACTUALIZAR STOCK
// ================================
$sqlStock = "UPDATE stock 
             SET cantidad_minima = ?, cantidad_maxima = ?
             WHERE id_producto = ?";
$stmtStock = $conexion->prepare($sqlStock);
$stmtStock->bind_param("iii", $cantidad_minima, $cantidad_maxima, $id);
$stmtStock->execute();

echo json_encode(["ok" => true]);
?>
