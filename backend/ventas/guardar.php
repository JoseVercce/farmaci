<?php
header("Content-Type: application/json");
require_once "../conexion.php";

try {

    $id_cliente = $_POST["id_cliente"] ?? null;
    $id_caja = $_POST["id_caja"] ?? null;
    $total = $_POST["total"] ?? null;
    $detalle = isset($_POST["detalle"]) ? json_decode($_POST["detalle"], true) : null;

    if (!$id_cliente || !$id_caja || !$total || !$detalle) {
        echo json_encode(["ok" => false, "msg" => "Datos incompletos"]);
        exit;
    }

    // ================================
    // VALIDAR STOCK ANTES DE VENDER
    // ================================
    foreach ($detalle as $item) {

        $id_producto = $item["id_producto"];
        $cantidad_vendida = $item["cantidad"];

        $sql_stock_check = "SELECT cantidad_actual FROM stock WHERE id_producto = ?";
        $stmt_check = $conexion->prepare($sql_stock_check);
        $stmt_check->bind_param("i", $id_producto);
        $stmt_check->execute();
        $res_check = $stmt_check->get_result();

        if ($res_check->num_rows == 0) {
            echo json_encode(["ok" => false, "msg" => "Producto sin registro de stock"]);
            exit;
        }

        $row_stock = $res_check->fetch_assoc();
        $stock_actual = $row_stock["cantidad_actual"];

       // obtener nombre del producto
$sql_nombre = "SELECT nombre FROM productos WHERE id_producto = ?";
$stmt_nombre = $conexion->prepare($sql_nombre);
$stmt_nombre->bind_param("i", $id_producto);
$stmt_nombre->execute();
$res_nombre = $stmt_nombre->get_result();
$nombre_producto = $res_nombre->fetch_assoc()["nombre"];

if ($cantidad_vendida > $stock_actual) {
    echo json_encode([
        "ok" => false,
        "msg" => "Stock insuficiente para $nombre_producto. Disponible: $stock_actual"
    ]);
    exit;
}

    }

    // ================================
    // GENERAR NÚMERO DE FACTURA
    // ================================
    $sql_last = "SELECT numero_factura FROM ventas ORDER BY id_venta DESC LIMIT 1";
    $res_last = $conexion->query($sql_last);

    if ($res_last->num_rows > 0) {
        $row = $res_last->fetch_assoc();
        $ultimo = $row["numero_factura"];
        $num = intval(substr($ultimo, 4));
        $nuevo_num = $num + 1;
        $numero_factura = "FAC-" . str_pad($nuevo_num, 6, "0", STR_PAD_LEFT);
    } else {
        $numero_factura = "FAC-000001";
    }

    // ================================
    // INSERTAR VENTA
    // ================================
    $id_usuario = 1;

    $sql = "INSERT INTO ventas (numero_factura, fecha, id_cliente, id_caja, total, id_usuario)
            VALUES (?, NOW(), ?, ?, ?, ?)";

    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("siidi", $numero_factura, $id_cliente, $id_caja, $total, $id_usuario);
    $stmt->execute();

    $id_venta = $stmt->insert_id;

    // ================================
    // INSERTAR DETALLE
    // ================================
    $sql_det = "INSERT INTO detalle_ventas (id_producto, id_venta, cantidad, precio_unitario)
                VALUES (?, ?, ?, ?)";

    $stmt_det = $conexion->prepare($sql_det);

    foreach ($detalle as $item) {
        $stmt_det->bind_param(
            "iiid",
            $item["id_producto"],
            $id_venta,
            $item["cantidad"],
            $item["precio_unitario"]
        );
        $stmt_det->execute();
    }

    // ================================
    // DESCONTAR STOCK
    // ================================
// ================================
// DESCONTAR STOCK + REGISTRAR MOVIMIENTO
// ================================
$sql_get_stock = "SELECT id_stock, cantidad_actual FROM stock WHERE id_producto = ?";
$stmt_get_stock = $conexion->prepare($sql_get_stock);

$sql_update_stock = "UPDATE stock SET cantidad_actual = cantidad_actual - ? WHERE id_producto = ?";
$stmt_update_stock = $conexion->prepare($sql_update_stock);

$sql_mov = "INSERT INTO movimientos 
            (id_stock, tipo, cantidad_inicio, cantidad_ingreso, cantidad_salida, cantidad_final, fecha, referencia)
            VALUES (?, 'SALIDA', ?, 0, ?, ?, NOW(), ?)";

$stmt_mov = $conexion->prepare($sql_mov);

foreach ($detalle as $item) {

    $id_producto = $item["id_producto"];
    $cantidad_vendida = $item["cantidad"];

    // obtener id_stock y cantidad actual
    $stmt_get_stock->bind_param("i", $id_producto);
    $stmt_get_stock->execute();
    $res_stock = $stmt_get_stock->get_result();
    $row_stock = $res_stock->fetch_assoc();

    $id_stock = $row_stock["id_stock"];
    $cantidad_inicio = $row_stock["cantidad_actual"];
    $cantidad_final = $cantidad_inicio - $cantidad_vendida;

    // actualizar stock
    $stmt_update_stock->bind_param("ii", $cantidad_vendida, $id_producto);
    $stmt_update_stock->execute();

    // registrar movimiento
    $referencia = "Venta factura " . $numero_factura;

    $stmt_mov->bind_param(
        "iiiis",
        $id_stock,
        $cantidad_inicio,
        $cantidad_vendida,
        $cantidad_final,
        $referencia
    );

    $stmt_mov->execute();
}


    echo json_encode(["ok" => true, "msg" => "Factura registrada", "numero" => $numero_factura]);

} catch (Exception $e) {
    echo json_encode(["ok" => false, "msg" => $e->getMessage()]);
}
?>
