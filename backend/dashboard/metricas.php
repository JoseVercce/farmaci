<?php
require_once '../seguridad.php';
header("Content-Type: application/json; charset=utf-8");

if (!usuarioActual()) {
    echo json_encode(["ok" => false, "error" => "No autorizado"]);
    exit;
}

require "../conexion.php";

function safeQuery($conexion, $sql, $campo) {
    $res = $conexion->query($sql);

    if (!$res) {
        return ["ok" => false, "error" => $conexion->error];
    }

    $row = $res->fetch_assoc();
    return intval($row[$campo] ?? 0);
}

$productos = safeQuery($conexion, "SELECT COUNT(*) AS total FROM productos WHERE estado = 1;", "total");
$stock = safeQuery($conexion, "SELECT SUM(cantidad_actual) AS total FROM stock", "total");
$facturas = safeQuery($conexion, "SELECT COUNT(*) AS total FROM ventas", "total");
$proveedores = safeQuery($conexion, "SELECT COUNT(*) AS total FROM proveedores WHERE estado = 1;", "total");

echo json_encode([
    "ok" => true,
    "productos" => $productos,
    "stock" => $stock,
    "facturas" => $facturas,
    "proveedores" => $proveedores
]);
