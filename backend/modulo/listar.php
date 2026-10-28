<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$sql = $conexion->query("SELECT id, nombre FROM modulo ORDER BY nombre ASC");

$modulos = [];
while ($row = $sql->fetch_assoc()) {
    $modulos[] = $row;
}

echo json_encode($modulos);
?>
