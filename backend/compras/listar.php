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
    FROM compras c
    INNER JOIN proveedores p ON p.id = c.id_proveedor
    LEFT JOIN usuario u ON u.id = c.id_usuario
    WHERE c.fecha LIKE ?
       OR p.nombre LIKE ?
       OR u.usuario LIKE ?
       OR c.total LIKE ?
");
$sqlTotal->bind_param("ssss", $like, $like, $like, $like);
$sqlTotal->execute();
$total = $sqlTotal->get_result()->fetch_assoc()["total"];

/* ============================
   LISTADO PAGINADO
============================ */
$sql = $conexion->prepare("
    SELECT 
        c.id,
        c.fecha,
        c.total,
        p.nombre AS proveedor,
        COALESCE(u.usuario, '-') AS usuario
    FROM compras c
    INNER JOIN proveedores p ON p.id = c.id_proveedor
    LEFT JOIN usuario u ON u.id = c.id_usuario
    WHERE c.fecha LIKE ?
       OR p.nombre LIKE ?
       OR u.usuario LIKE ?
       OR c.total LIKE ?
    ORDER BY c.id DESC
    LIMIT ? OFFSET ?
");

$sql->bind_param("ssssii", $like, $like, $like, $like, $limite, $offset);
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
