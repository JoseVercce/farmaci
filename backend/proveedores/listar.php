<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$buscar = $_GET["buscar"] ?? "";
$pagina = intval($_GET["pagina"] ?? 1);
$limite = intval($_GET["limite"] ?? 10);
$offset = ($pagina - 1) * $limite;
$estadoSolicitado = $_GET["estado"] ?? "1";
$estado = $estadoSolicitado === "todos"
    ? -1
    : (in_array($estadoSolicitado, ["0", "1"], true) ? intval($estadoSolicitado) : 1);

$like = "%$buscar%";

/* TOTAL */
$sqlTotal = $conexion->prepare("
    SELECT COUNT(*) AS total
    FROM proveedores
    WHERE (? = -1 OR estado = ?)
      AND (nombre LIKE ? OR telefono LIKE ? OR correo LIKE ? OR direccion LIKE ?)
");
$sqlTotal->bind_param("iissss", $estado, $estado, $like, $like, $like, $like);
$sqlTotal->execute();
$total = $sqlTotal->get_result()->fetch_assoc()["total"];

/* LISTADO */
$sql = $conexion->prepare("
    SELECT id, nombre, telefono, correo, direccion, estado
    FROM proveedores
    WHERE (? = -1 OR estado = ?)
      AND (nombre LIKE ? OR telefono LIKE ? OR correo LIKE ? OR direccion LIKE ?)
    ORDER BY nombre ASC
    LIMIT ? OFFSET ?
");
$sql->bind_param("iissssii", $estado, $estado, $like, $like, $like, $like, $limite, $offset);
$sql->execute();
$res = $sql->get_result();

$data = [];
while ($row = $res->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode([
    "status" => "success",
    "data" => $data,
    "total" => $total
]);
