<?php
require_once "../conexion.php";

$sql = "SELECT numero_factura FROM ventas ORDER BY id DESC LIMIT 1";
$res = $conexion->query($sql);

if ($res && $res->num_rows > 0) {
    $row = $res->fetch_assoc();
    $ultimo = $row["numero_factura"];
    $num = intval(substr($ultimo, 4)) + 1;
} else {
    $num = 1;
}

echo json_encode([
    "ok" => true,
    "numero" => "FAC-" . str_pad($num, 6, "0", STR_PAD_LEFT)
]);
