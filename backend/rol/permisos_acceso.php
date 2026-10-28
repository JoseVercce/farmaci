<?php
require_once __DIR__ . '/../seguridad.php';

function requireAdminPermisosRol() {
    header("Content-Type: application/json; charset=utf-8");

    $usuario = usuarioActual();
    if (!$usuario) {
        http_response_code(401);
        echo json_encode(["ok" => false, "error" => "Debes iniciar sesión."]);
        exit;
    }

    foreach ($usuario["roles"] ?? [] as $rol) {
        if (isset($rol["nombre"]) && strtolower(trim($rol["nombre"])) === "administrador") {
            return;
        }
    }

    http_response_code(403);
    echo json_encode(["ok" => false, "error" => "Solo un administrador puede gestionar permisos de roles."]);
    exit;
}
