<?php
require_once '../seguridad.php';
header('Content-Type: application/json');

if (!usuarioActual()) {
    echo json_encode(["ok" => false, "msg" => "No autenticado"]);
    exit;
}

$usuario = usuarioActual();
$permisos = obtenerPermisosUsuario($pdo);
$menu = obtenerMenuUsuario($pdo);

$_SESSION['usuario']['permisos'] = $permisos;
$_SESSION['usuario']['menu'] = $menu;

echo json_encode([
    "ok" => true,
    "usuario" => $usuario,
    "permisos" => $permisos,
    "menu" => $menu
]);
