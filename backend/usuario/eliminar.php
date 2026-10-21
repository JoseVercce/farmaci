<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$id = $_POST["id"] ?? null;

if (!$id) {
    echo json_encode(["ok" => false, "msg" => "ID requerido"]);
    exit;
}

// 1️⃣ Verificar si el usuario tiene compras
$check = $conexion->query("SELECT id FROM compras WHERE id_usuario = $id LIMIT 1");

if ($check->num_rows > 0) {
    // 2️⃣ Si tiene compras → inactivar usuario
    $conexion->query("UPDATE usuario SET estado = 0 WHERE id = $id");
    echo json_encode(["ok" => true, "msg" => "Usuario inactivado (tiene compras asociadas)"]);
    exit;
}

// 3️⃣ Si NO tiene compras → eliminar dependencias y luego el usuario
$conexion->query("DELETE FROM direccion WHERE id_usuario = $id");
$conexion->query("DELETE FROM usuario_rol WHERE id_usuario = $id");

$stmt = $conexion->prepare("DELETE FROM usuario WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(["ok" => true, "msg" => "Usuario eliminado"]);
} else {
    echo json_encode(["ok" => false, "msg" => $stmt->error]);
}
?>
