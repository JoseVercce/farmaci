<?php
header("Content-Type: application/json");
require_once "../conexion.php";
require '../seguridad.php';
requireLogin();

$pagina = 'productos/listar.php';

// Seguridad con PDO
if (!puedeAccederPagina($pdo, $pagina) || !tienePermiso($pdo, $pagina, 'Leer')) {
    echo json_encode(["ok" => false, "error" => "No tienes permiso para ver esta página."]);
    exit;
}

$buscar = $_GET["buscar"] ?? "";
$pagina = intval($_GET["pagina"] ?? 1);
$limite = intval($_GET["limite"] ?? 10);
$offset = ($pagina - 1) * $limite;

$like = "%$buscar%";

/* ============================
   TOTAL SOLO PRODUCTOS ACTIVOS
============================ */
$sqlTotal = $conexion->prepare("
    SELECT COUNT(*) AS total
    FROM productos p
    INNER JOIN categoria c ON p.id_categoria = c.id
    WHERE p.estado = 1
      AND (p.nombre LIKE ?
       OR p.descripcion LIKE ?
       OR c.nombre LIKE ?)
");
$sqlTotal->bind_param("sss", $like, $like, $like);
$sqlTotal->execute();
$total = $sqlTotal->get_result()->fetch_assoc()["total"];

/* ============================
   LISTADO PAGINADO SOLO ACTIVOS
============================ */
$sql = $conexion->prepare("
    SELECT 
        p.id,
        p.nombre,
        p.descripcion,
        p.precio,
        c.nombre AS categoria
    FROM productos p
    INNER JOIN categoria c ON p.id_categoria = c.id
    WHERE p.estado = 1
      AND (p.nombre LIKE ?
       OR p.descripcion LIKE ?
       OR c.nombre LIKE ?)
    ORDER BY p.id DESC
    LIMIT ? OFFSET ?
");

$sql->bind_param("sssii", $like, $like, $like, $limite, $offset);
$sql->execute();
$res = $sql->get_result();

$productos = [];
while ($row = $res->fetch_assoc()) {
    $productos[] = $row;
}

echo json_encode([
    "ok" => true,
    "data" => $productos,
    "total" => $total
]);
