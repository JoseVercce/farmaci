<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$buscar = $_GET["buscar"] ?? "";
$pagina = intval($_GET["pagina"] ?? 1);
$limite = intval($_GET["limite"] ?? 10);
$offset = ($pagina - 1) * $limite;

$like = "%$buscar%";

/* TOTAL */
$sqlTotal = $conexion->prepare("
    SELECT COUNT(*) AS total
    FROM rol
    WHERE nombre LIKE ?
       OR descripcion LIKE ?
");
$sqlTotal->bind_param("ss", $like, $like);
$sqlTotal->execute();
$total = $sqlTotal->get_result()->fetch_assoc()["total"];

/* LISTADO */
$sql = $conexion->prepare("
    SELECT id, nombre, descripcion
    FROM rol
    WHERE nombre LIKE ?
       OR descripcion LIKE ?
    ORDER BY id DESC
    LIMIT ? OFFSET ?
");
$sql->bind_param("ssii", $like, $like, $limite, $offset);
$sql->execute();
$res = $sql->get_result();

$roles = [];
while ($row = $res->fetch_assoc()) {
    // si descripcion es NULL, devolver cadena vacía
    $row["descripcion"] = $row["descripcion"] ?? "";
    $roles[] = $row;
}

echo json_encode([
    "ok" => true,
    "data" => $roles,
    "total" => $total
]);
?>
