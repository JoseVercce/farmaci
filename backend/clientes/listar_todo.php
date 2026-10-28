<?php
header("Content-Type: application/json");
require_once "../conexion.php";
require '../seguridad.php';
requireLogin();

try {
    // Aseguramos que extraiga la cédula (y todas las columnas) de la base de datos
    $query = "SELECT * FROM clientes ORDER BY nombre ASC";
    $resultado = $conexion->query($query);
    
    $clientes = [];
    while ($fila = $resultado->fetch_assoc()) {
        $clientes[] = $fila;
    }

    echo json_encode(["ok" => true, "data" => $clientes]);
} catch (Exception $e) {
    echo json_encode(["ok" => false, "msg" => "Error al obtener clientes: " . $e->getMessage()]);
}
?>