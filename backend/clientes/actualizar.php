<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$id = $_POST["id"] ?? null;
$nombre = $_POST["nombre"] ?? null;
$cedula = $_POST["cedula"] ?? null;
$telefono = $_POST["telefono"] ?? null;
$direccion = $_POST["direccion"] ?? null;

if (!$id) {
    echo json_encode(["status" => "error", "message" => "ID requerido"]);
    exit;
}

$stmt = $conexion->prepare("UPDATE clientes 
    SET nombre=?, cedula=?, telefono=?, direccion=? 
    WHERE id=?");

$stmt->bind_param("ssssi", $nombre, $cedula, $telefono, $direccion, $id);

echo json_encode(
    $stmt->execute()
        ? ["status" => "success"]
        : ["status" => "error", "message" => $stmt->error]
);
?>
