<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$id = filter_var($_POST["id"] ?? null, FILTER_VALIDATE_INT);
if (!$id || $id < 1) {
    echo json_encode(["ok" => false, "error" => "ID de producto inválido."]);
    exit;
}

try {
    $conexion->begin_transaction();

    $stmt = $conexion->prepare("UPDATE productos SET estado = 1 WHERE id = ?");
    if (!$stmt) {
        throw new mysqli_sql_exception("No se pudo preparar la activación del producto.");
    }

    $stmt->bind_param("i", $id);
    if (!$stmt->execute()) {
        throw new mysqli_sql_exception("No se pudo activar el producto.");
    }

    if ($stmt->affected_rows === 0) {
        $check = $conexion->prepare("SELECT id FROM productos WHERE id = ?");
        if (!$check) {
            throw new mysqli_sql_exception("No se pudo verificar el producto.");
        }
        $check->bind_param("i", $id);
        if (!$check->execute()) {
            throw new mysqli_sql_exception("No se pudo verificar el producto.");
        }
        if ($check->get_result()->num_rows === 0) {
            $conexion->rollback();
            echo json_encode(["ok" => false, "error" => "Producto no encontrado."]);
            exit;
        }
    }

    $stmtStock = $conexion->prepare("UPDATE stock SET estado = 1 WHERE id_producto = ?");
    if (!$stmtStock) {
        throw new mysqli_sql_exception("No se pudo preparar la activación del stock.");
    }
    $stmtStock->bind_param("i", $id);
    if (!$stmtStock->execute()) {
        throw new mysqli_sql_exception("No se pudo activar el stock del producto.");
    }

    $conexion->commit();
    echo json_encode(["ok" => true, "msg" => "Producto y stock activados correctamente."]);
} catch (mysqli_sql_exception $e) {
    $conexion->rollback();
    error_log("Error al activar el producto $id y su stock: " . $e->getMessage());
    echo json_encode(["ok" => false, "error" => "No se pudo activar el producto y su stock asociado."]);
}
?>
