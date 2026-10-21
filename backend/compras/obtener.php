<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$id = $_GET["id"] ?? null;

if (!$id) {
    echo json_encode(["ok" => false, "error" => "ID no enviado"]);
    exit;
}

/* ============================
   OBTENER COMPRA
============================ */
$sqlCompra = "SELECT c.id, c.fecha, c.total,
                     p.nombre AS proveedor,
                     u.nombre AS usuario
              FROM compras c
              INNER JOIN proveedores p ON p.id = c.id_proveedor
              INNER JOIN usuario u ON u.id = c.id_usuario
              WHERE c.id = ?";

$stmtCompra = $conexion->prepare($sqlCompra);
$stmtCompra->bind_param("i", $id);
$stmtCompra->execute();
$compra = $stmtCompra->get_result()->fetch_assoc();

if (!$compra) {
    echo json_encode(["ok" => false, "error" => "Compra no encontrada"]);
    exit;
}

/* ============================
   OBTENER DETALLE
============================ */
$sqlDetalle = "SELECT dc.cantidad, dc.costo_unitario,
                      (dc.cantidad * dc.costo_unitario) AS subtotal,
                      a.nombre AS almacen,
                      p.nombre AS producto
               FROM detalle_compras dc
               INNER JOIN productos p ON p.id = dc.id_producto
               LEFT JOIN almacen a ON a.id = dc.id_almacen
               WHERE dc.id_compra = ?";

$stmtDetalle = $conexion->prepare($sqlDetalle);
$stmtDetalle->bind_param("i", $id);
$stmtDetalle->execute();
$detalle = $stmtDetalle->get_result()->fetch_all(MYSQLI_ASSOC) ?? [];


/* ============================
   RESPUESTA
============================ */
echo json_encode([
    "ok" => true,
    "compra" => $compra,
    "detalle" => $detalle
]);
?>
