<?php
require "../conexion.php";

$cedula = $_GET['cedula'] ?? '';

$sql = $conexion->prepare("SELECT id, nombre FROM clientes WHERE cedula = ?");
$sql->bind_param("s", $cedula);
$sql->execute();
$result = $sql->get_result();
$cli = $result->fetch_assoc();

echo json_encode([
    "ok" => $cli ? true : false,
    "data" => $cli
]);
