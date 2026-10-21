<?php
header("Content-Type: application/json");
require "../conexion.php";

$id_stock   = $_POST["id_stock"]   ?? null;
$id_destino = $_POST["id_destino"] ?? null;
$cantidad   = $_POST["cantidad"]   ?? null;

if (!$id_stock || !$id_destino || !$cantidad) {
    echo json_encode(["ok" => false, "msg" => "Datos incompletos"]);
    exit;
}

/* ============================
   1. OBTENER STOCK ORIGEN
============================ */
$sql = "SELECT 
            id,
            id_producto,
            id_almacen,
            cantidad_actual,
            cantidad_minima,
            cantidad_maxima
        FROM stock
        WHERE id = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $id_stock);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows == 0) {
    echo json_encode(["ok" => false, "msg" => "Stock origen no encontrado"]);
    exit;
}

$origen = $res->fetch_assoc();

/* ============================
   VALIDAR CANTIDAD
============================ */
if ($cantidad <= 0) {
    echo json_encode(["ok" => false, "msg" => "Cantidad inválida"]);
    exit;
}

if ($cantidad > $origen["cantidad_actual"]) {
    echo json_encode(["ok" => false, "msg" => "Cantidad excede el stock disponible"]);
    exit;
}

$id_producto       = $origen["id_producto"];
$id_almacen_origen = $origen["id_almacen"];

/* ============================
   2. VERIFICAR STOCK DESTINO
============================ */
$sql2 = "SELECT id, cantidad_actual 
         FROM stock 
         WHERE id_producto = ? AND id_almacen = ?";
$stmt2 = $conexion->prepare($sql2);
$stmt2->bind_param("ii", $id_producto, $id_destino);
$stmt2->execute();
$res2 = $stmt2->get_result();

if ($res2->num_rows > 0) {

    /* ============================
       2.1 YA EXISTE → ACTUALIZAR
    ============================= */
    $destino        = $res2->fetch_assoc();
    $nuevo_destino  = $destino["cantidad_actual"] + $cantidad;

    $sql3 = "UPDATE stock SET cantidad_actual = ?, estado = 1 WHERE id = ?";
    $stmt3 = $conexion->prepare($sql3);
    $stmt3->bind_param("ii", $nuevo_destino, $destino["id"]);
    $stmt3->execute();

} else {

    /* ============================
       2.2 NO EXISTE → CREAR STOCK NUEVO
       (CORREGIDO: AHORA INCLUYE ESTADO)
    ============================= */
    $minima = $origen["cantidad_minima"];
    $maxima = $origen["cantidad_maxima"];

    $sql4 = "INSERT INTO stock 
             (id_producto, id_almacen, cantidad_actual, cantidad_minima, cantidad_maxima, estado) 
             VALUES (?, ?, ?, ?, ?, 1)";
    $stmt4 = $conexion->prepare($sql4);
    $stmt4->bind_param("iiiii", $id_producto, $id_destino, $cantidad, $minima, $maxima);
    $stmt4->execute();
}

/* ============================
   3. ACTUALIZAR STOCK ORIGEN
============================ */
$nuevo_origen = $origen["cantidad_actual"] - $cantidad;

$sql5 = "UPDATE stock SET cantidad_actual = ? WHERE id = ?";
$stmt5 = $conexion->prepare($sql5);
$stmt5->bind_param("ii", $nuevo_origen, $id_stock);
$stmt5->execute();

/* ============================
   4. INACTIVAR SI QUEDA EN 0
============================ */
if ($nuevo_origen <= 0) {
    $sqlInactivar = "UPDATE stock SET estado = 0 WHERE id = ?";
    $stmtInactivar = $conexion->prepare($sqlInactivar);
    $stmtInactivar->bind_param("i", $id_stock);
    $stmtInactivar->execute();
}

/* ============================
   5. REGISTRAR EN KARDEX (SI EXISTE)
============================ */
if ($conexion->query("SHOW TABLES LIKE 'kardex'")->num_rows > 0) {

    $sql6 = "INSERT INTO kardex 
             (id_producto, id_almacen_origen, id_almacen_destino, cantidad, fecha, tipo)
             VALUES (?, ?, ?, ?, NOW(), 'TRANSFERENCIA')";
    $stmt6 = $conexion->prepare($sql6);
    $stmt6->bind_param("iiii", $id_producto, $id_almacen_origen, $id_destino, $cantidad);
    $stmt6->execute();
}

echo json_encode(["ok" => true, "msg" => "Transferencia realizada con éxito"]);
?>
