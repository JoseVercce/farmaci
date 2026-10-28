<?php
header("Content-Type: application/json");
require_once "../conexion.php";

/* ============================
   SESIÓN
============================ */
session_name("farmacia_sesion");
session_start();

if (!isset($_SESSION["usuario"]["id"])) {
    echo json_encode(["ok" => false, "error" => "Sesión no iniciada"]);
    exit;
}

$id_usuario = $_SESSION["usuario"]["id"];

/* ============================
   VALIDAR CAMPOS
============================ */
$fecha        = $_POST["fecha"]        ?? null;
$id_proveedor = $_POST["id_proveedor"] ?? null;
$total        = $_POST["total"]        ?? null;
$detalles     = $_POST["detalles"]     ?? null;

if (!$fecha || !$id_proveedor || !$total || !$detalles) {
    echo json_encode(["ok" => false, "error" => "Datos incompletos"]);
    exit;
}

$detalles = json_decode($detalles, true);

if (!is_array($detalles) || count($detalles) === 0) {
    echo json_encode(["ok" => false, "error" => "No hay detalles"]);
    exit;
}

/* ============================
   INICIAR TRANSACCIÓN
============================ */
$conexion->begin_transaction();

try {

    /* ============================
       INSERTAR COMPRA
    ============================= */
    $sqlCompra = "INSERT INTO compras (fecha, id_proveedor, total, id_usuario)
                  VALUES (?, ?, ?, ?)";

    $stmt = $conexion->prepare($sqlCompra);
    $stmt->bind_param("sidi", $fecha, $id_proveedor, $total, $id_usuario);
    $stmt->execute();

    $id_compra = $conexion->insert_id;

    /* ============================
       PREPARAR QUERIES
    ============================= */

    // INSERTAR DETALLE
    $sqlDetalle = "INSERT INTO detalle_compras 
                   (id_compra, id_producto, cantidad, costo_unitario, id_almacen)
                   VALUES (?, ?, ?, ?, ?)";
    $stmtDetalle = $conexion->prepare($sqlDetalle);

    // MOVIMIENTO
    $sqlMov = "INSERT INTO movimientos 
               (id_stock, id_almacen, tipo, cantidad_inicio, cantidad_ingreso, cantidad_salida, cantidad_final, fecha, referencia)
               VALUES (?, ?, 'ENTRADA', ?, ?, 0, ?, NOW(), ?)";
    $stmtMov = $conexion->prepare($sqlMov);

    /* ============================
       PROCESAR DETALLES
    ============================= */
    foreach ($detalles as $d) {

        $id_producto       = intval($d["id_producto"]);
        $cantidad_comprada = intval($d["cantidad"]);
        $id_almacen        = intval($d["id_almacen"]);
        $costo_unitario    = floatval($d["costo_unitario"]);

        /* ============================
           1. OBTENER STOCK DEL PRODUCTO
           (INCLUYE SIN ASIGNAR)
        ============================= */
        $sqlGetFull = "SELECT id, cantidad_actual, cantidad_minima, cantidad_maxima, estado, id_almacen
                       FROM stock 
                       WHERE id_producto = ?
                         AND (id_almacen = ? OR id_almacen IS NULL OR id_almacen = 0)
                       LIMIT 1";

        $stmtGetFull = $conexion->prepare($sqlGetFull);
        $stmtGetFull->bind_param("ii", $id_producto, $id_almacen);
        $stmtGetFull->execute();
        $resFull = $stmtGetFull->get_result();
        $rowFull = $resFull->fetch_assoc();

        /* ============================
           1.1 SI EXISTE STOCK → ACTUALIZAR
           (INCLUYE SIN ASIGNAR)
        ============================= */
        if ($rowFull) {

            $id_stock        = intval($rowFull["id"]);
            $cantidad_actual = intval($rowFull["cantidad_actual"]);
            $cant_min        = intval($rowFull["cantidad_minima"]);
            $cant_max        = intval($rowFull["cantidad_maxima"]);

            $cantidad_inicio  = $cantidad_actual;
            $cantidad_ingreso = $cantidad_comprada;
            $cantidad_final   = $cantidad_inicio + $cantidad_ingreso;

        } else {

            /* ============================
               1.2 NO EXISTE STOCK → CREARLO
               (COPIAR MIN/MAX DEL STOCK ORIGINAL)
            ============================= */

            $sqlProd = "SELECT cantidad_minima, cantidad_maxima 
                        FROM stock 
                        WHERE id_producto = ?
                        ORDER BY id_almacen ASC
                        LIMIT 1";

            $stmtProd = $conexion->prepare($sqlProd);
            $stmtProd->bind_param("i", $id_producto);
            $stmtProd->execute();
            $resProd = $stmtProd->get_result();
            $rowProd = $resProd->fetch_assoc();

            $cant_min = $rowProd ? intval($rowProd["cantidad_minima"]) : 0;
            $cant_max = $rowProd ? intval($rowProd["cantidad_maxima"]) : 0;

            $sqlInsert = "INSERT INTO stock 
                          (id_producto, id_almacen, cantidad_actual, cantidad_minima, cantidad_maxima, estado)
                          VALUES (?, ?, ?, ?, ?, 1)";
            $stmtInsert = $conexion->prepare($sqlInsert);
            $stmtInsert->bind_param("iiiii", $id_producto, $id_almacen, $cantidad_comprada, $cant_min, $cant_max);
            $stmtInsert->execute();

            $id_stock = intval($stmtInsert->insert_id);

            $cantidad_inicio  = 0;
            $cantidad_ingreso = $cantidad_comprada;
            $cantidad_final   = $cantidad_ingreso;
        }

        /* ============================
   1.1 SI EXISTE STOCK → ACTUALIZAR
============================ */
if ($rowFull) {

    $id_stock        = intval($rowFull["id"]);
    $cantidad_actual = intval($rowFull["cantidad_actual"]);
    $cant_min        = intval($rowFull["cantidad_minima"]);
    $cant_max        = intval($rowFull["cantidad_maxima"]);

    $cantidad_inicio  = $cantidad_actual;
    $cantidad_ingreso = $cantidad_comprada;
    $cantidad_final   = $cantidad_inicio + $cantidad_ingreso;

    // Actualizar stock
    $sqlUpdate = "UPDATE stock 
                  SET cantidad_actual = cantidad_actual + ?, 
                      estado = 1,
                      id_almacen = ?
                  WHERE id = ?";
    $stmtUpdate = $conexion->prepare($sqlUpdate);
    $stmtUpdate->bind_param("iii", $cantidad_ingreso, $id_almacen, $id_stock);
    $stmtUpdate->execute();

    /* ============================
       SI QUEDA EN 0 → INACTIVAR
============================ */
    if ($cantidad_final <= 0) {
        $sqlInactivar = "UPDATE stock SET estado = 0 WHERE id = ?";
        $stmtInactivar = $conexion->prepare($sqlInactivar);
        $stmtInactivar->bind_param("i", $id_stock);
        $stmtInactivar->execute();
    }
}

        /* ============================
           2. REGISTRAR MOVIMIENTO
        ============================= */
        $referencia = "Compra #$id_compra";

        $stmtMov->bind_param(
            "iiiiss",
            $id_stock,
            $id_almacen,
            $cantidad_inicio,
            $cantidad_ingreso,
            $cantidad_final,
            $referencia
        );
        $stmtMov->execute();

        /* ============================
           3. INSERTAR DETALLE
        ============================= */
        $stmtDetalle->bind_param(
            "iiidi",
            $id_compra,
            $id_producto,
            $cantidad_comprada,
            $costo_unitario,
            $id_almacen
        );
        $stmtDetalle->execute();
    }

    /* ============================
       FINALIZAR
    ============================= */
    $conexion->commit();
    echo json_encode(["ok" => true, "id" => $id_compra]);

} catch (Exception $e) {

    $conexion->rollback();
    echo json_encode(["ok" => false, "error" => $e->getMessage()]);
}
?>
