<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$id = $_POST["id"] ?? null;

if (!$id) {
    echo json_encode(["status" => "error", "msg" => "ID requerido"]);
    exit;
}

// eliminar relaciones en usuario_rol
$stmt = $conexion->prepare("DELETE FROM usuario_rol WHERE id_rol=?");
$stmt->bind_param("i", $id);
$stmt->execute();

// eliminar el rol
$stmt2 = $conexion->prepare("DELETE FROM rol WHERE id=?");
$stmt2->bind_param("i", $id);

if ($stmt2->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "msg" => "No se pudo eliminar"]);
}
?>
