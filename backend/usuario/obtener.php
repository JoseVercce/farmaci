<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$id = $_GET["id"];

$stmt = $conexion->prepare("
    SELECT id, nombre, usuario, correo, telefono
    FROM usuario
    WHERE id=?
");
$stmt->bind_param("i", $id);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();

// obtener roles
$stmt2 = $conexion->prepare("SELECT id_rol FROM usuario_rol WHERE id_usuario=?");
$stmt2->bind_param("i", $id);
$stmt2->execute();
$res = $stmt2->get_result();

$roles = [];
while ($r = $res->fetch_assoc()) {
    $roles[] = intval($r["id_rol"]);
}

$user["roles"] = $roles;

echo json_encode(["ok" => true, "data" => $user]);
?>
