<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$nombre   = $_POST["nombre"]   ?? null;
$usuario  = $_POST["usuario"]  ?? null;
$clave    = $_POST["clave"]    ?? null;
$correo   = $_POST["correo"]   ?? null;
$telefono = $_POST["telefono"] ?? null;
$estado   = $_POST["estado"]   ?? 1;

if (!$nombre || !$usuario || !$clave) {
    echo json_encode(["ok" => false, "msg" => "Campos incompletos"]);
    exit;
}

// Encriptar clave
$claveHash = password_hash($clave, PASSWORD_DEFAULT);

$stmt = $conexion->prepare("
    INSERT INTO usuario (nombre, usuario, clave, correo, telefono)
    VALUES (?, ?, ?, ?, ?)
");

$stmt->bind_param("sssss", $nombre, $usuario, $claveHash, $correo, $telefono);

echo json_encode(["ok" => $stmt->execute()]);

$id_usuario = $conexion->insert_id;

$stmt2 = $conexion->prepare("INSERT INTO usuario_rol (id_usuario, id_rol) VALUES (?, ?)");
$stmt2->bind_param("ii", $id_usuario, $id_rol);
$stmt2->execute();

?>
