<?php
header("Content-Type: application/json");
require_once "../conexion.php";

if (!isset($conexion)) {
    echo json_encode(["ok" => false, "msg" => "Error: conexión no establecida"]);
    exit;
}

try {

    $id = $_POST["id"] ?? null;

    if (!$id) {
        echo json_encode(["ok" => false, "msg" => "ID no recibido"]);
        exit;
    }

    // eliminar detalle primero
    $sql_det = "DELETE FROM detalle_ventas WHERE id_venta = ?";
    $stmt_det = $conexion->prepare($sql_det);
    $stmt_det->bind_param("i", $id);
    $stmt_det->execute();

    // eliminar venta
    $sql = "DELETE FROM ventas WHERE id_venta = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();

    echo json_encode(["ok" => true, "msg" => "Venta eliminada correctamente"]);

} catch (Exception $e) {
    echo json_encode(["ok" => false, "msg" => $e->getMessage()]);
}
?>
