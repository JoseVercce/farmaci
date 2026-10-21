<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$id = $_POST["id"] ?? null;
$nombre = $_POST["nombre"] ?? null;
$usuario = $_POST["usuario"] ?? null;
$correo = $_POST["correo"] ?? null;
$telefono = $_POST["telefono"] ?? null;
$clave = $_POST["clave"] ?? null;
$roles = $_POST["roles"] ?? [];

if (!$id) {
    echo json_encode(["ok" => false, "error" => "ID faltante"]);
    exit;
}

if ($clave) {
    // actualizar con clave nueva
    $claveHash = password_hash($clave, PASSWORD_DEFAULT);
    $stmt = $conexion->prepare("
        UPDATE usuario 
        SET nombre=?, usuario=?, clave=?, correo=?, telefono=?
        WHERE id=?
    ");
    $stmt->bind_param("sssssi", $nombre, $usuario, $claveHash, $correo, $telefono, $id);
} else {
    // actualizar sin cambiar clave
    $stmt = $conexion->prepare("
        UPDATE usuario 
        SET nombre=?, usuario=?, correo=?, telefono=?
        WHERE id=?
    ");
    $stmt->bind_param("ssssi", $nombre, $usuario, $correo, $telefono, $id);
}

if (!$stmt->execute()) {
    echo json_encode(["ok" => false, "error" => "No se pudo actualizar usuario"]);
    exit;
}

// borrar roles anteriores
$stmt = $conexion->prepare("DELETE FROM usuario_rol WHERE id_usuario=?");
$stmt->bind_param("i", $id);
$stmt->execute();

// insertar roles nuevos
foreach ($roles as $id_rol) {
    $stmt2 = $conexion->prepare("INSERT INTO usuario_rol (id_usuario, id_rol) VALUES (?, ?)");
    $stmt2->bind_param("ii", $id, $id_rol);
    $stmt2->execute();
}

echo json_encode(["ok" => true]);
?>
