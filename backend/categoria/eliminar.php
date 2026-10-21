<?php
require_once "../conexion.php";

$id = $_POST["id"] ?? 0;

if ($id == 0) {
    echo json_encode(["status" => "error", "msg" => "ID inválido"]);
    exit;
}

$sql = "DELETE FROM categoria WHERE id = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "msg" => "No se pudo eliminar"]);
}
