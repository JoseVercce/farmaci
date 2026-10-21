<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$buscar = $_GET["buscar"] ?? "";
$pagina = intval($_GET["pagina"] ?? 1);
$limite = intval($_GET["limite"] ?? 10);
$offset = ($pagina - 1) * $limite;

/* ============================
   FILTRO
============================ */
$where = "";
if ($buscar !== "") {
    $buscar = $conexion->real_escape_string($buscar);
    $where = "WHERE 
        p.nombre LIKE '%$buscar%' OR
        m.tipo LIKE '%$buscar%' OR
        m.referencia LIKE '%$buscar%'";
}

/* ============================
   TOTAL
============================ */
$sqlTotal = "
SELECT COUNT(*) AS total
FROM movimientos m
INNER JOIN stock s ON s.id = m.id_stock
INNER JOIN productos p ON p.id = s.id_producto
$where
";

$resTotal = $conexion->query($sqlTotal);
$total = $resTotal->fetch_assoc()["total"];

/* ============================
   LISTADO
============================ */
$sql = "
SELECT 
    m.fecha,
    p.nombre AS producto,
    m.tipo,
    m.cantidad_inicio,
    m.cantidad_ingreso,
    m.cantidad_salida,
    m.cantidad_final,
    m.referencia
FROM movimientos m
INNER JOIN stock s ON s.id = m.id_stock
INNER JOIN productos p ON p.id = s.id_producto
$where
ORDER BY m.fecha DESC
LIMIT $limite OFFSET $offset
";

$res = $conexion->query($sql);

$data = [];
while ($row = $res->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode([
    "ok" => true,
    "data" => $data,
    "total" => $total
]);
?>
