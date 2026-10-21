<?php
header("Content-Type: application/json");
require "../conexion.php";

$id_stock = $_POST["id"] ?? null;
$id_destino = $_POST["id_destino"] ?? null;

if (!$id_stock || !$id_destino) {
    echo json_encode(["ok" => false, "msg" => "Datos incompletos"]);
    exit;
}

// Obtener almacén actual
$sql = "SELECT id_almacen FROM stock WHERE id = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $id_stock);
$stmt->execute();
$origen = $stmt->get_result()->fetch_assoc()["id_almacen"];

// Actualizar stock
$sql2 = "UPDATE stock SET id_almacen = ? WHERE id = ?";
$stmt2 = $conexion->prepare($sql2);
$stmt2->bind_param("ii", $id_destino, $id_stock);
$stmt2->execute();

// Registrar movimiento
$sql3 = "INSERT INTO movimientos (id_stock, id_almacen_origen, id_almacen_destino, cantidad, tipo, fecha)
         VALUES (?, ?, ?, 0, 'traslado', NOW())";

$stmt3 = $conexion->prepare($sql3);
$stmt3->bind_param("iii", $id_stock, $origen, $id_destino);
$stmt3->execute();

echo json_encode(["ok" => true, "msg" => "Producto movido correctamente"]);
