<?php
session_name("farmacia_sesion");
session_start();

require_once __DIR__ . '/../config.php';

header("Content-Type: application/json");

$usuario = $_POST['usuario'] ?? '';
$clave   = $_POST['clave'] ?? '';

try {

    $stmt = $pdo->prepare("SELECT * FROM usuario WHERE usuario = ?");
    $stmt->execute([$usuario]);
    $user = $stmt->fetch();

    $claveValida = $user && (password_verify($clave, $user['clave']) || $user['clave'] === $clave);

    if ($user && $claveValida) {

        $stmtRoles = $pdo->prepare("
            SELECT r.id, r.nombre
            FROM usuario_rol ur
            JOIN rol r ON ur.id_rol = r.id
            WHERE ur.id_usuario = ?
        ");
        $stmtRoles->execute([$user['id']]);
        $roles = $stmtRoles->fetchAll();

        $_SESSION['usuario'] = [
            "id"       => $user['id'],
            "nombre"   => $user['nombre'],
            "usuario"  => $user['usuario'],
            "roles"    => $roles
        ];

        echo json_encode([
            "status" => "success",
            "message" => "Login correcto",
            "usuario" => $_SESSION['usuario']
        ]);
        exit;
    }

    echo json_encode([
        "status" => "error",
        "message" => "Usuario o clave incorrectos"
    ]);
    exit;

} catch (Exception $e) {

    echo json_encode([
        "status" => "error",
        "message" => "Error interno",
        "debug" => $e->getMessage()
    ]);
    exit;
}
