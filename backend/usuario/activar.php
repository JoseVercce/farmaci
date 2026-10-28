<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$id = filter_var($_POST["id"] ?? null, FILTER_VALIDATE_INT);
if (!$id || $id < 1) {
    echo json_encode(["ok" => false, "msg" => "ID de usuario inválido."]);
    exit;
}

$stmt = $conexion->prepare("UPDATE usuario SET estado = 1 WHERE id = ?");
if (!$stmt) {
    error_log("Error preparando la activación del usuario: " . $conexion->error);
    echo json_encode(["ok" => false, "msg" => "No se pudo activar el usuario."]);
    exit;
}

$stmt->bind_param("i", $id);
if (!$stmt->execute()) {
    error_log("Error activando el usuario $id: " . $stmt->error);
    echo json_encode(["ok" => false, "msg" => "No se pudo activar el usuario."]);
    exit;
}

if ($stmt->affected_rows === 0) {
    $check = $conexion->prepare("SELECT id FROM usuario WHERE id = ?");
    $check->bind_param("i", $id);
    $check->execute();
    if ($check->get_result()->num_rows === 0) {
        echo json_encode(["ok" => false, "msg" => "Usuario no encontrado."]);
        exit;
    }
}

echo json_encode(["ok" => true, "msg" => "Usuario activado correctamente."]);
?>
