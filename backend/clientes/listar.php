<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$buscar = $_GET["buscar"] ?? "";
$pagina = intval($_GET["pagina"] ?? 1);
$limite = intval($_GET["limite"] ?? 10);

$offset = ($pagina - 1) * $limite;

// Total de registros
$sqlTotal = "SELECT COUNT(*) AS total FROM clientes 
             WHERE nombre LIKE '%$buscar%' 
             OR cedula LIKE '%$buscar%' 
             OR telefono LIKE '%$buscar%'";
$total = $conexion->query($sqlTotal)->fetch_assoc()["total"];

// Registros paginados
$sql = "SELECT * FROM clientes 
        WHERE nombre LIKE '%$buscar%' 
        OR cedula LIKE '%$buscar%' 
        OR telefono LIKE '%$buscar%'
        LIMIT $limite OFFSET $offset";

$res = $conexion->query($sql);

$clientes = [];
while ($row = $res->fetch_assoc()) {
    $clientes[] = $row;
}

echo json_encode([
    "status" => "success",
    "data" => $clientes,
    "total" => $total
]);
?>
