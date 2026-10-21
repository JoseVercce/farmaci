<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$id = $_POST["id"];
$min = $_POST["cantidad_minima"];
$max = $_POST["cantidad_maxima"];

$stmt = $conn->prepare(
    "UPDATE stock SET cantidad_minima=?, cantidad_maxima=? WHERE id=?"
);
$stmt->bind_param("iii", $min, $max, $id);

echo json_encode($stmt->execute() ? ["status" => "ok"] : ["status" => "error"]);
?>
