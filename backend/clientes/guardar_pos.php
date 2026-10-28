<?php
header("Content-Type: application/json");
require_once "../conexion.php";
require '../seguridad.php';
requireLogin();

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty($data['nombre']) || empty($data['cedula'])) {
    echo json_encode(["ok" => false, "msg" => "Faltan datos obligatorios (Nombre y Cédula)."]);
    exit;
}

$nombre = $data['nombre'];
$cedula = $data['cedula'];
$telefono = $data['telefono'] ?? '';
$direccion = $data['direccion'] ?? '';

try {
    // Inserta al cliente directamente sin salir del POS
    $sql = $conexion->prepare("INSERT INTO clientes (nombre, cedula, telefono, direccion) VALUES (?, ?, ?, ?)");
    $sql->bind_param("ssss", $nombre, $cedula, $telefono, $direccion);

    if ($sql->execute()) {
        $nuevoId = $conexion->insert_id;
        echo json_encode(["ok" => true, "id" => $nuevoId, "msg" => "Cliente guardado."]);
    } else {
        throw new Exception("Error al guardar en la base de datos: " . $sql->error);
    }
} catch (Exception $e) {
    echo json_encode(["ok" => false, "msg" => $e->getMessage()]);
}
?>