<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$sql = "SELECT rp.*, r.nombre AS rol, p.nombre AS pagina, m.nombre AS modulo
        FROM rm_pagin rp
        INNER JOIN rol r ON rp.id_rol = r.id
        INNER JOIN pagina p ON rp.id_pagina = p.id
        INNER JOIN modulo m ON rp.id_modulo = m.id";

$result = $conn->query($sql);

$data = [];
while ($row = $result->fetch_assoc()) $data[] = $row;

echo json_encode($data);
?>
