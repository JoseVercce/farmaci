<?php
require "../conexion.php";

$nombre        = $_POST["nombre"] ?? "";
$descripcion   = $_POST["descripcion"] ?? "";
$id_categoria  = intval($_POST["id_categoria"] ?? 0);
$precio        = floatval($_POST["precio"] ?? 0);

$cant_min      = intval($_POST["cantidad_minima"] ?? 0);
$cant_max      = intval($_POST["cantidad_maxima"] ?? 0);

if ($nombre == "" || $id_categoria == 0) {
    echo json_encode(["ok" => false, "error" => "Datos incompletos"]);
    exit;
}

$conexion->begin_transaction();

try {

    /* ============================
       1. CREAR PRODUCTO
    ============================= */
    $sql = "INSERT INTO productos (nombre, descripcion, id_categoria, precio, estado)
            VALUES (?, ?, ?, ?, ?)";

    $stmt = $conexion->prepare($sql);
    $estado = 1;
    $stmt->bind_param("ssidi", $nombre, $descripcion, $id_categoria, $precio, $estado);
    $stmt->execute();

    $id_producto = $conexion->insert_id;

    /* ============================
       2. CREAR STOCK INICIAL
    ============================= */
$sqlStock = "INSERT INTO stock 
(id_producto, cantidad_actual, cantidad_minima, cantidad_maxima, id_almacen, estado)
VALUES (?, 0, ?, ?, NULL, 1)";


    $stmtStock = $conexion->prepare($sqlStock);
    $stmtStock->bind_param("iii", $id_producto, $cant_min, $cant_max);
    $stmtStock->execute();

    $conexion->commit();

    echo json_encode(["ok" => true]);

} catch (Exception $e) {

    $conexion->rollback();
    echo json_encode(["ok" => false, "error" => $e->getMessage()]);
}
?>
