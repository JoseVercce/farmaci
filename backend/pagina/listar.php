<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$sql = "SELECT * FROM pagina";
$result = $conn->query($sql);

$data = [];
while ($row = $result->fetch_assoc()) $data[] = $row;

echo json_encode($data);
?>
