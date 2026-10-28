<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$sql = $conexion->query("SELECT id, nombre FROM permisos ORDER BY id ASC");

$permisos = [];
while ($row = $sql->fetch_assoc()) {
    $permisos[] = $row;
}

echo json_encode($permisos);
?>
