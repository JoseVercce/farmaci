<?php
header("Content-Type: application/json");
require_once __DIR__ . "/../conexion.php";
require_once __DIR__ . "/../seguridad.php";
requireLogin();

try {
    $sql = $conexion->prepare("
        SELECT 
            v.id AS id_venta,
            v.numero_factura, 
            v.fecha, 
            v.total, 
            COALESCE(NULLIF(c.nombre, ''), 'Consumidor Final') AS cliente
        FROM ventas v
        LEFT JOIN clientes c ON c.id = v.id_cliente
        ORDER BY v.fecha DESC, v.id DESC
        LIMIT 100
    ");
    $sql->execute();
    $resultado = $sql->get_result();
    $resultados = $resultado->fetch_all(MYSQLI_ASSOC);

    echo json_encode([
        "ok" => true,
        "data" => $resultados
    ]);

} catch (mysqli_sql_exception $e) {
    error_log("Error al obtener el historial de ventas: " . $e->getMessage());
    echo json_encode([
        "ok" => false,
        "msg" => "Error al obtener el historial de ventas."
    ]);
}