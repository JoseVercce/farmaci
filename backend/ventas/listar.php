<?php
require "../conexion.php";

$buscar = $_GET["buscar"] ?? "";
$pagina = intval($_GET["pagina"] ?? 1);
$limite = intval($_GET["limite"] ?? 10);
$offset = ($pagina - 1) * $limite;

$like = "%$buscar%";

/* ============================
   TOTAL
============================ */
$sqlTotal = $conexion->prepare("
    SELECT COUNT(*) AS total
    FROM ventas v
    INNER JOIN clientes c ON c.id_cliente = v.id_cliente
    WHERE v.numero_factura LIKE ?
       OR c.nombre LIKE ?
");
$sqlTotal->bind_param("ss", $like, $like);
$sqlTotal->execute();
$total = $sqlTotal->get_result()->fetch_assoc()["total"];

/* ============================
   LISTADO PAGINADO
============================ */
$sql = $conexion->prepare("
    SELECT 
        v.id_venta,
        v.numero_factura,
        v.fecha,
        v.total,
        c.nombre AS cliente
    FROM ventas v
    INNER JOIN clientes c ON c.id_cliente = v.id_cliente
    WHERE v.numero_factura LIKE ?
       OR c.nombre LIKE ?
    ORDER BY v.id_venta DESC
    LIMIT ? OFFSET ?
");
$sql->bind_param("ssii", $like, $like, $limite, $offset);
$sql->execute();
$res = $sql->get_result();

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
