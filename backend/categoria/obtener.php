<?php
require_once "../conexion.php";

$id = $_GET["id"] ?? 0;

$sql = "SELECT * FROM categoria WHERE id = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows === 0) {
    echo json_encode(["ok" => false, "error" => "Categoría no encontrada"]);
    exit;
}

echo json_encode([
    "ok" => true,
    "data" => $res->fetch_assoc()
]);
