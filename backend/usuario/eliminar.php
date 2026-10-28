<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$id = filter_var($_POST["id"] ?? null, FILTER_VALIDATE_INT);

if (!$id || $id < 1) {
    echo json_encode(["ok" => false, "msg" => "ID requerido"]);
    exit;
}

$checkCompras = $conexion->prepare("SELECT id FROM compras WHERE id_usuario = ? LIMIT 1");
$checkCompras->bind_param("i", $id);
$checkCompras->execute();
$tieneCompras = $checkCompras->get_result()->num_rows > 0;

$checkVentas = $conexion->prepare("SELECT id FROM ventas WHERE id_usuario = ? LIMIT 1");
$checkVentas->bind_param("i", $id);
$checkVentas->execute();
$tieneVentas = $checkVentas->get_result()->num_rows > 0;

if ($tieneCompras || $tieneVentas) {
    $stmt = $conexion->prepare("UPDATE usuario SET estado = 0 WHERE id = ?");
    $stmt->bind_param("i", $id);
    if ($stmt->execute()) {
        echo json_encode([
            "ok" => true,
            "msg" => "Usuario inactivado porque tiene compras o ventas asociadas"
        ]);
    } else {
        echo json_encode(["ok" => false, "msg" => "No se pudo inactivar el usuario"]);
    }
    exit;
}

// Eliminar dependencias solo cuando no hay compras ni ventas asociadas.
$stmtDireccion = $conexion->prepare("DELETE FROM direccion WHERE id_usuario = ?");
$stmtDireccion->bind_param("i", $id);
$stmtDireccion->execute();

$stmtRoles = $conexion->prepare("DELETE FROM usuario_rol WHERE id_usuario = ?");
$stmtRoles->bind_param("i", $id);
$stmtRoles->execute();

$stmt = $conexion->prepare("DELETE FROM usuario WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(["ok" => true, "msg" => "Usuario eliminado"]);
} else {
    echo json_encode(["ok" => false, "msg" => $stmt->error]);
}
?>
