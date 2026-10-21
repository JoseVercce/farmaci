<?php
require_once '../seguridad.php';
header('Content-Type: application/json');

if (!usuarioActual()) {
    echo json_encode([]);
    exit;
}

echo json_encode(obtenerMenuUsuario($pdo));
