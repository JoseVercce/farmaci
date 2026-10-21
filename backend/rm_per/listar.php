<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$sql = "SELECT rp.*, p.nombre AS permiso
        FROM rm_per rp
        INNER JOIN permisos p ON rp.id_permiso = p.id";

$result = $conexion->query($sql);

$data = [];
while ($row = $result->fetch_assoc()) $data[] = $row;

echo json_encode($data);
?>
