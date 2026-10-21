<?php
require_once '../seguridad.php';
require_once '../config.php';

header('Content-Type: application/json');

// Validar sesión
if (!usuarioActual()) {
    echo json_encode(["ok" => false, "msg" => "No autenticado"]);
    exit;
}

// Validar parámetro ID
$id = $_GET['id'] ?? null;

if (!$id || !is_numeric($id)) {
    echo json_encode(["ok" => false, "msg" => "ID inválido"]);
    exit;
}

// Verificar permisos (rol o roles)
if (
    !tienePermiso($pdo, 'rol/listar.php', 'Leer') &&
    !tienePermiso($pdo, 'roles/listar.php', 'Leer')
) {
    echo json_encode(["ok" => false, "msg" => "No tienes permisos para ver roles"]);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT * FROM rol WHERE id = ?");
    $stmt->execute([$id]);
    $rol = $stmt->fetch();

    if (!$rol) {
        echo json_encode(["ok" => false, "msg" => "Rol no encontrado"]);
        exit;
    }

    echo json_encode([
        "ok" => true,
        "rol" => $rol
    ]);

} catch (Exception $e) {
    echo json_encode([
        "ok" => false,
        "msg" => "Error en el servidor",
        "error" => $e->getMessage()
    ]);
}
