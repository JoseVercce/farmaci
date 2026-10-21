<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$nombre = $_POST["nombre"] ?? null;
$usuario = $_POST["usuario"] ?? null;
$clave = $_POST["clave"] ?? null;
$correo = $_POST["correo"] ?? null;
$telefono = $_POST["telefono"] ?? null;

if (!$nombre || !$usuario || !$clave) {
    echo json_encode(["ok" => false, "error" => "Campos incompletos"]);
    exit;
}

$claveHash = password_hash($clave, PASSWORD_DEFAULT);

$stmt = $conexion->prepare("
    INSERT INTO usuario (nombre, usuario, clave, correo, telefono)
    VALUES (?, ?, ?, ?, ?)
");
$stmt->bind_param("sssss", $nombre, $usuario, $claveHash, $correo, $telefono);

if (!$stmt->execute()) {
    echo json_encode(["ok" => false, "error" => "No se pudo crear usuario"]);
    exit;
}

echo json_encode(["ok" => true]);
?>
