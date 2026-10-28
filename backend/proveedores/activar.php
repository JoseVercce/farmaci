<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$id = filter_var($_POST["id"] ?? null, FILTER_VALIDATE_INT);
if (!$id || $id < 1) {
    echo json_encode(["status" => "error", "msg" => "ID de proveedor inválido."]);
    exit;
}

$stmt = $conexion->prepare("UPDATE proveedores SET estado = 1 WHERE id = ?");
if (!$stmt) {
    error_log("Error preparando la activación del proveedor: " . $conexion->error);
    echo json_encode(["status" => "error", "msg" => "No se pudo activar el proveedor."]);
    exit;
}

$stmt->bind_param("i", $id);
if (!$stmt->execute()) {
    error_log("Error activando el proveedor $id: " . $stmt->error);
    echo json_encode(["status" => "error", "msg" => "No se pudo activar el proveedor."]);
    exit;
}

if ($stmt->affected_rows === 0) {
    $check = $conexion->prepare("SELECT id FROM proveedores WHERE id = ?");
    $check->bind_param("i", $id);
    $check->execute();
    if ($check->get_result()->num_rows === 0) {
        echo json_encode(["status" => "error", "msg" => "Proveedor no encontrado."]);
        exit;
    }
}

echo json_encode(["status" => "success", "msg" => "Proveedor activado correctamente."]);
?>
