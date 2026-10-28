<?php
require_once "../conexion.php";

$sql = $conexion->query("SELECT * FROM rol ORDER BY nombre ASC");

$data = [];
while ($row = $sql->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode(["data" => $data]);
?>
