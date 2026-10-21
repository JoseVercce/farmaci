<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$id_compra = $_POST["id"] ?? null;

if (!$id_compra) {
    echo json_encode(["ok" => false, "error" => "ID no enviado"]);
    exit;
}

$conexion->begin_transaction();

try {

    /* ============================
       DEVOLVER STOCK
    ============================= */
    $sqlDetalles = "SELECT id_producto, cantidad FROM detalle_compras WHERE id_compra = ?";
    $stmt = $conexion->prepare($sqlDetalles);
    $stmt->bind_param("i", $id_compra);
    $stmt->execute();
    $res = $stmt->get_result();

    $sqlStock = "UPDATE stock SET cantidad_actual = cantidad_actual - ? WHERE id_producto = ?";
    $stmtStock = $conexion->prepare($sqlStock);

    while ($d = $res->fetch_assoc()) {
        $stmtStock->bind_param("ii", $d["cantidad"], $d["id_producto"]);
        $stmtStock->execute();
    }

    /* ============================
       ELIMINAR DETALLES
    ============================= */
    $conexion->query("DELETE FROM detalle_compras WHERE id_compra = $id_compra");

    /* ============================
       ELIMINAR COMPRA
    ============================= */
    $conexion->query("DELETE FROM compras WHERE id = $id_compra");

    $conexion->commit();

    echo json_encode(["ok" => true]);

} catch (Exception $e) {

    $conexion->rollback();
    echo json_encode(["ok" => false, "error" => $e->getMessage()]);
}
?>
