<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$id = filter_var($_POST["id"] ?? null, FILTER_VALIDATE_INT);
if (!$id || $id < 1) {
    echo json_encode(["ok" => false, "msg" => "ID de stock inválido."]);
    exit;
}

$check = $conexion->prepare("SELECT id FROM stock WHERE id = ?");
if (!$check) {
    error_log("Error preparando la consulta de stock: " . $conexion->error);
    echo json_encode(["ok" => false, "msg" => "No se pudo consultar el stock."]);
    exit;
}
$check->bind_param("i", $id);
$check->execute();
if ($check->get_result()->num_rows === 0) {
    echo json_encode(["ok" => false, "msg" => "Registro de stock no encontrado."]);
    exit;
}

$stmt = $conexion->prepare("UPDATE stock SET estado = 1 WHERE id = ?");
if (!$stmt) {
    error_log("Error preparando la activación del stock: " . $conexion->error);
    echo json_encode(["ok" => false, "msg" => "No se pudo activar el stock."]);
    exit;
}

$stmt->bind_param("i", $id);
if (!$stmt->execute()) {
    error_log("Error activando el registro de stock $id: " . $stmt->error);
    echo json_encode(["ok" => false, "msg" => "No se pudo activar el stock."]);
    exit;
}

echo json_encode(["ok" => true, "msg" => "Stock activado correctamente."]);
?>
