<?php
require_once "../conexion.php";

$buscar = $_GET["buscar"] ?? "";
$pagina = intval($_GET["pagina"] ?? 1);
$limite = intval($_GET["limite"] ?? 10);
$offset = ($pagina - 1) * $limite;

$sql = "SELECT * FROM categoria 
        WHERE nombre LIKE ? 
        ORDER BY id DESC
        LIMIT ? OFFSET ?";

$stmt = $conexion->prepare($sql);
$like = "%$buscar%";
$stmt->bind_param("sii", $like, $limite, $offset);
$stmt->execute();
$result = $stmt->get_result();

$categorias = [];
while ($row = $result->fetch_assoc()) {
    $categorias[] = $row;
}

$sqlTotal = "SELECT COUNT(*) AS total FROM categoria WHERE nombre LIKE ?";
$stmtTotal = $conexion->prepare($sqlTotal);
$stmtTotal->bind_param("s", $like);
$stmtTotal->execute();
$total = $stmtTotal->get_result()->fetch_assoc()["total"];

echo json_encode([
    "ok" => true,
    "data" => $categorias,
    "total" => $total
]);
