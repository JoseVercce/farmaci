<?php
header("Content-Type: application/json");
require_once __DIR__ . "/../conexion.php";
require_once __DIR__ . "/../seguridad.php";
requireLogin();

$idVenta = filter_input(INPUT_GET, "id", FILTER_VALIDATE_INT);

if (!$idVenta || $idVenta < 1) {
    echo json_encode(["ok" => false, "msg" => "ID de venta inválido."]);
    exit;
}

try {
    $sqlEncabezado = $conexion->prepare("
        SELECT
            v.numero_factura,
            v.fecha,
            v.total,
            COALESCE(NULLIF(c.nombre, ''), 'Consumidor Final') AS cliente_nombre,
            COALESCE(NULLIF(c.cedula, ''), 'N/A') AS cliente_cedula,
            COALESCE(NULLIF(c.telefono, ''), 'N/A') AS cliente_telefono
        FROM ventas v
        LEFT JOIN clientes c ON c.id = v.id_cliente
        WHERE v.id = ?
    ");
    $sqlEncabezado->bind_param("i", $idVenta);
    $sqlEncabezado->execute();
    $resEncabezado = $sqlEncabezado->get_result();

    if ($resEncabezado->num_rows === 0) {
        echo json_encode(["ok" => false, "msg" => "Factura no encontrada."]);
        exit;
    }

    $encRaw = $resEncabezado->fetch_assoc();
    $sqlDetalles = $conexion->prepare("
        SELECT 
            d.cantidad,
            d.precio_unitario,
            d.aplica_iva,
            d.alicuota_iva,
            COALESCE(p.nombre, 'Producto no disponible') AS nombre,
            d.id_producto AS codigo
        FROM detalle_ventas d
        LEFT JOIN productos p ON d.id_producto = p.id
        WHERE d.id_venta = ?
        ORDER BY d.id
    ");
    $sqlDetalles->bind_param("i", $idVenta);
    $sqlDetalles->execute();
    $resDetalles = $sqlDetalles->get_result();

    $sqlPagos = $conexion->prepare("
        SELECT mp.nombre AS metodo, dp.monto
        FROM detalle_pago dp
        INNER JOIN metodo_pago mp ON mp.id = dp.id_metodo_pago
        WHERE dp.id_venta = ?
        ORDER BY dp.id
    ");
    if (!$sqlPagos) {
        throw new mysqli_sql_exception("No se pudo preparar la consulta de pagos: " . $conexion->error);
    }
    $sqlPagos->bind_param("i", $idVenta);
    if (!$sqlPagos->execute()) {
        throw new mysqli_sql_exception("No se pudo obtener los pagos: " . $sqlPagos->error);
    }
    $resPagos = $sqlPagos->get_result();

    echo json_encode([
        "ok" => true,
        "encabezado" => $encRaw,
        "data" => $resDetalles->fetch_all(MYSQLI_ASSOC),
        "pagos" => $resPagos->fetch_all(MYSQLI_ASSOC)
    ]);
} catch (mysqli_sql_exception $e) {
    error_log("Error al obtener el detalle de la venta $idVenta: " . $e->getMessage());
    echo json_encode(["ok" => false, "msg" => "Error al obtener el detalle de la venta."]);
}