<?php
header("Content-Type: application/json");
require_once "../conexion.php";
require '../seguridad.php';
requireLogin();

try {
    // Buscamos las últimas 100 ventas, ordenadas de la más reciente a la más antigua
    $sql = $conexion->prepare("
        SELECT 
            v.id_venta, 
            v.numero_factura, 
            v.fecha, 
            v.total, 
            IFNULL(c.nombre, 'Consumidor Final') AS cliente
        FROM ventas v
        LEFT JOIN clientes c ON v.id_cliente = c.id_cliente
        ORDER BY v.fecha DESC
        LIMIT 100
    ");
    
    $sql->execute();
    $res = $sql->get_result();
    
    $historial = [];
    while ($row = $res->fetch_assoc()) {
        $historial[] = $row;
    }

    echo json_encode(["ok" => true, "data" => $historial]);

} catch (Exception $e) {
    echo json_encode(["ok" => false, "msg" => "Error al cargar el historial."]);
}
?>