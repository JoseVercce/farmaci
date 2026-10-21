<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$sql = "SELECT d.*, u.nombre AS usuario
        FROM direccion d
        INNER JOIN usuario u ON d.id_usuario = u.id";

$result = $conn->query($sql);

$data = [];
while ($row = $result->fetch_assoc()) $data[] = $row;

echo json_encode($data);
?>
