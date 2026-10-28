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
$estadoSolicitado = $_GET["estado"] ?? "1";
$estado = $estadoSolicitado === "todos"
    ? -1
    : (in_array($estadoSolicitado, ["0", "1"], true) ? intval($estadoSolicitado) : 1);

$like = "%$buscar%";

/* ============================
   TOTAL SEGÚN ESTADO SELECCIONADO
============================ */
$sqlTotal = $conexion->prepare("
    SELECT COUNT(*) AS total
    FROM productos p
    INNER JOIN categoria c ON p.id_categoria = c.id
    WHERE (? = -1 OR p.estado = ?)
      AND (p.nombre LIKE ?
       OR p.descripcion LIKE ?
       OR c.nombre LIKE ?)
");
$sqlTotal->bind_param("iisss", $estado, $estado, $like, $like, $like);
$sqlTotal->execute();
$total = $sqlTotal->get_result()->fetch_assoc()["total"];

/* ============================
   LISTADO PAGINADO SEGÚN ESTADO
============================ */
$sql = $conexion->prepare("
    SELECT 
        p.id,
        p.nombre,
        p.descripcion,
        p.precio,
        p.estado,
        c.nombre AS categoria
    FROM productos p
    INNER JOIN categoria c ON p.id_categoria = c.id
    WHERE (? = -1 OR p.estado = ?)
      AND (p.nombre LIKE ?
       OR p.descripcion LIKE ?
       OR c.nombre LIKE ?)
    ORDER BY p.id DESC
    LIMIT ? OFFSET ?
");

$sql->bind_param("iisssii", $estado, $estado, $like, $like, $like, $limite, $offset);
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
