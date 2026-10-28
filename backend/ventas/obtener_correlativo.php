<?php
header("Content-Type: application/json");
require_once "../conexion.php";
require '../seguridad.php';
requireLogin();

try {
    // CORREGIDO: Cambiamos 'id_venta' por 'id' para que coincida con tu tabla
    $resMax = $conexion->query("SELECT MAX(id) AS max_id FROM ventas");
    $rowMax = $resMax->fetch_assoc();
    $nextId = intval($rowMax['max_id']) + 1;
    
    // Lo formateamos con 6 ceros
    $numeroSiguiente = sprintf("#%06d", $nextId);

    echo json_encode(["ok" => true, "correlativo" => $numeroSiguiente]);
} catch (Exception $e) {
    echo json_encode(["ok" => false, "msg" => "Error al consultar."]);
}
?>