<?php
header("Content-Type: application/json");
require "../conexion.php";

$id = $_GET["id"] ?? null;

if (!$id) {
    echo json_encode(["ok" => false, "msg" => "ID no recibido"]);
    exit;
}

// Obtener datos del stock
$sql = "SELECT 
            s.id AS id_stock,
            s.id_producto,
            s.id_almacen,
            s.cantidad_actual,
            s.cantidad_minima,
            s.cantidad_maxima,
            p.nombre AS producto,
            a.nombre AS almacen
        FROM stock s
        INNER JOIN productos p ON p.id = s.id_producto
        INNER JOIN almacen a ON a.id = s.id_almacen
        WHERE s.id = ?";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows == 0) {
    echo json_encode(["ok" => false, "msg" => "Stock no encontrado"]);
    exit;
}

$stock = $res->fetch_assoc();

// Obtener lista de almacenes
$sql2 = "SELECT id, nombre FROM almacen";
$res2 = $conexion->query($sql2);

$almacenes = [];
while ($row = $res2->fetch_assoc()) {
    $almacenes[] = [
        "id_almacen" => $row["id"],
        "nombre" => $row["nombre"]
    ];
}

echo json_encode([
    "ok" => true,
    "producto" => $stock["producto"],
    "almacen" => $stock["almacen"],
    "cantidad" => $stock["cantidad_actual"],
    "id_almacen" => $stock["id_almacen"],
    "almacenes" => $almacenes
]);
