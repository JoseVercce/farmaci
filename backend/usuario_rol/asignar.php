<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$id_usuario = $_POST["id_usuario"] ?? null;
$id_rol     = $_POST["id_rol"] ?? null;

if (!$id_usuario || !$id_rol) {
    echo json_encode(["status" => "error", "msg" => "Datos incompletos"]);
    exit;
}

$stmt = $conn->prepare(
    "INSERT INTO usuario_rol (id_usuario, id_rol) VALUES (?, ?)"
);
$stmt->bind_param("ii", $id_usuario, $id_rol);

if ($stmt->execute()) {
    echo json_encode(["status" => "ok"]);
} else {
    echo json_encode(["status" => "error", "msg" => $conn->error]);
}
?>
