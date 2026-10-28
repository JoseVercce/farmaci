<?php
header("Content-Type: application/json");
require_once "../conexion.php";
require '../seguridad.php';
requireLogin();

try {
    $query = "
        SELECT
            p.id,
            p.nombre,
            p.descripcion,
            p.id_categoria,
            p.precio,
            p.estado,
            s.cantidad_actual AS stock
        FROM productos p
        INNER JOIN (
            SELECT s.id_producto, SUM(s.cantidad_actual) AS cantidad_actual
            FROM stock s
            WHERE s.id_almacen = (
                SELECT id
                FROM almacen
                WHERE nombre = 'Principal'
                ORDER BY id
                LIMIT 1
            )
            GROUP BY s.id_producto
            HAVING SUM(s.cantidad_actual) > 0
        ) s ON s.id_producto = p.id
        WHERE p.estado = 1
        ORDER BY p.nombre ASC
    ";
    $resultado = $conexion->query($query);
    
    $productos = [];
    while ($fila = $resultado->fetch_assoc()) {
        $productos[] = $fila;
    }

    echo json_encode(["ok" => true, "data" => $productos]);
} catch (Exception $e) {
    echo json_encode(["ok" => false, "msg" => "Error al obtener productos: " . $e->getMessage()]);
}
?>