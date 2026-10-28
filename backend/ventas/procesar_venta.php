<?php
header("Content-Type: application/json");
require_once "../conexion.php";
require '../seguridad.php';
requireLogin();

// Leer los datos JSON enviados desde JavaScript
$data = json_decode(file_get_contents("php://input"), true);

if (!is_array($data) || empty($data['items']) || !is_array($data['items'])) {
    echo json_encode(["ok" => false, "msg" => "La factura está vacía."]);
    exit;
}

$idCliente = !empty($data['cliente_id']) ? intval($data['cliente_id']) : 1; 
$idMetodoPago = filter_var($data['metodo_pago_id'] ?? null, FILTER_VALIDATE_INT);
if (!$idMetodoPago || $idMetodoPago < 1) {
    echo json_encode(["ok" => false, "msg" => "Selecciona un método de pago válido."]);
    exit;
}
$idUsuario = $_SESSION['id_usuario'] ?? 1; 
$idCaja = 1; 
$descuento = filter_var($data['descuento'] ?? 0, FILTER_VALIDATE_FLOAT);
if ($descuento === false || $descuento < 0 || $descuento > 100) {
    echo json_encode(["ok" => false, "msg" => "El descuento debe estar entre 0 y 100%."]);
    exit;
}

$tasaIva = 16.00;
$itemsValidados = [];
$totalVenta = 0.0;
foreach ($data['items'] as $item) {
    if (!is_array($item)) {
        echo json_encode(["ok" => false, "msg" => "Hay un producto con datos inválidos."]);
        exit;
    }

    $idProducto = filter_var($item['id'] ?? null, FILTER_VALIDATE_INT);
    $cantidad = filter_var($item['cantidad'] ?? null, FILTER_VALIDATE_INT);
    $precio = filter_var($item['precio'] ?? null, FILTER_VALIDATE_FLOAT);
    $aplicaIva = filter_var(
        $item['aplica_iva'] ?? true,
        FILTER_VALIDATE_BOOLEAN,
        FILTER_NULL_ON_FAILURE
    );
    if (!$idProducto || $idProducto < 1 || !$cantidad || $cantidad < 1
        || $precio === false || $precio < 0 || $aplicaIva === null) {
        echo json_encode(["ok" => false, "msg" => "Hay un producto con cantidad, precio o IVA inválido."]);
        exit;
    }

    $base = round($cantidad * $precio, 2);
    $baseConDescuento = round($base - round($base * ($descuento / 100), 2), 2);
    $iva = $aplicaIva ? round($baseConDescuento * ($tasaIva / 100), 2) : 0.0;
    $totalVenta += $baseConDescuento + $iva;
    $itemsValidados[] = [
        "id" => $idProducto,
        "cantidad" => $cantidad,
        "precio" => $precio,
        "aplica_iva" => $aplicaIva
    ];
}
$totalVenta = round($totalVenta, 2);

// Iniciamos la transacción
$conexion->begin_transaction();

try {
    // Las ventas siempre se descuentan del almacén principal.
    $nombreAlmacenPrincipal = "Principal";
    $sqlAlmacen = $conexion->prepare("
        SELECT id
        FROM almacen
        WHERE nombre = ?
        ORDER BY id
        LIMIT 1
    ");
    if (!$sqlAlmacen) {
        throw new Exception("Error preparando la consulta del almacén principal: " . $conexion->error);
    }
    $sqlAlmacen->bind_param("s", $nombreAlmacenPrincipal);
    $sqlAlmacen->execute();
    $almacenPrincipal = $sqlAlmacen->get_result()->fetch_assoc();
    if (!$almacenPrincipal) {
        throw new Exception("No existe un almacén llamado Principal.");
    }
    $idAlmacenPrincipal = intval($almacenPrincipal["id"]);

    // 1. Generar número de factura
    $resMax = $conexion->query("SELECT MAX(id) AS max_id FROM ventas");
    if (!$resMax) {
        throw new Exception("Error al generar factura: " . $conexion->error);
    }
    
    $rowMax = $resMax->fetch_assoc();
    $nextId = intval($rowMax['max_id']) + 1;
    $numeroFactura = sprintf("FACT-%06d", $nextId);

    // 2. Insertar en la tabla 'ventas'
    $sqlVenta = $conexion->prepare("INSERT INTO ventas (numero_factura, fecha, id_cliente, id_caja, total, id_usuario) VALUES (?, NOW(), ?, ?, ?, ?)");
    if (!$sqlVenta) {
        throw new Exception("Error preparando la venta: " . $conexion->error);
    }
    
    $sqlVenta->bind_param("siidi", $numeroFactura, $idCliente, $idCaja, $totalVenta, $idUsuario);
    
    if (!$sqlVenta->execute()) {
        throw new Exception("MySQL rechazó guardar la venta principal: " . $sqlVenta->error);
    }
    $idVenta = $conexion->insert_id; 

    $sqlMetodoPago = $conexion->prepare("SELECT id FROM metodo_pago WHERE id = ?");
    if (!$sqlMetodoPago) {
        throw new Exception("Error preparando la validación del método de pago: " . $conexion->error);
    }
    $sqlMetodoPago->bind_param("i", $idMetodoPago);
    if (!$sqlMetodoPago->execute() || !$sqlMetodoPago->get_result()->fetch_assoc()) {
        throw new Exception("El método de pago seleccionado no existe.");
    }

    $sqlDetallePago = $conexion->prepare("
        INSERT INTO detalle_pago (id_venta, id_metodo_pago, monto)
        VALUES (?, ?, ?)
    ");
    if (!$sqlDetallePago) {
        throw new Exception("Error preparando el registro del pago: " . $conexion->error);
    }
    $sqlDetallePago->bind_param("iid", $idVenta, $idMetodoPago, $totalVenta);
    if (!$sqlDetallePago->execute()) {
        throw new Exception("Error al registrar el método de pago: " . $sqlDetallePago->error);
    }

    // 3. Procesar cada producto del carrito
    $sqlDetalle = $conexion->prepare("
        INSERT INTO detalle_ventas
            (id_venta, id_producto, cantidad, precio_unitario, aplica_iva, alicuota_iva)
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    $sqlGetStock = $conexion->prepare("
        SELECT s.id, s.cantidad_actual
        FROM stock s
        INNER JOIN productos p ON p.id = s.id_producto
        WHERE s.id_producto = ?
          AND s.id_almacen = ?
          AND p.estado = 1
        ORDER BY s.id
        FOR UPDATE
    ");
    $sqlUpdateStock = $conexion->prepare("
        UPDATE stock
        SET cantidad_actual = cantidad_actual - ?
        WHERE id = ? AND cantidad_actual >= ?
    ");
    $sqlMovimiento = $conexion->prepare("INSERT INTO movimientos (id_stock, tipo, cantidad_inicio, cantidad_salida, cantidad_final, fecha, referencia) VALUES (?, 'SALIDA', ?, ?, ?, NOW(), ?)");

    if (!$sqlDetalle || !$sqlGetStock || !$sqlUpdateStock || !$sqlMovimiento) {
        throw new Exception("Error preparando consultas secundarias: " . $conexion->error);
    }

    foreach ($itemsValidados as $item) {
        $idProducto = $item["id"];
        $cantidad = $item["cantidad"];
        $precio = $item["precio"];
        $aplicaIva = $item["aplica_iva"] ? 1 : 0;

        // A. Guardar el detalle junto con el tratamiento de IVA aplicado.
        $sqlDetalle->bind_param("iiidid", $idVenta, $idProducto, $cantidad, $precio, $aplicaIva, $tasaIva);
        if (!$sqlDetalle->execute()) {
            throw new Exception("Error en detalle_ventas: " . $sqlDetalle->error);
        }

        // B. Consultar el stock actual
        $sqlGetStock->bind_param("ii", $idProducto, $idAlmacenPrincipal);
        if (!$sqlGetStock->execute()) {
            throw new Exception("Error consultando el inventario del almacén principal: " . $sqlGetStock->error);
        }
        $filasStock = $sqlGetStock->get_result()->fetch_all(MYSQLI_ASSOC);
        $stockDisponible = array_sum(array_map(
            static function ($fila) {
                return max(0, intval($fila["cantidad_actual"]));
            },
            $filasStock
        ));
        if ($stockDisponible < $cantidad) {
            throw new Exception("Stock insuficiente en el almacén Principal para el producto ID $idProducto. Disponible: $stockDisponible.");
        }

        // Si el almacén tiene más de un registro del mismo producto, descontar
        // entre ellos sin utilizar existencias de otros almacenes.
        $cantidadPendiente = $cantidad;
        foreach ($filasStock as $filaStock) {
            $cantidadInicio = intval($filaStock["cantidad_actual"]);
            if ($cantidadInicio <= 0) {
                continue;
            }

            $cantidadDescontar = min($cantidadInicio, $cantidadPendiente);
            $cantidadFinal = $cantidadInicio - $cantidadDescontar;
            $idStock = intval($filaStock["id"]);

            // C. Descontar del registro del almacén principal.
            $sqlUpdateStock->bind_param("iii", $cantidadDescontar, $idStock, $cantidadDescontar);
            if (!$sqlUpdateStock->execute()) {
                throw new Exception("Error al actualizar stock: " . $sqlUpdateStock->error);
            }
            if ($sqlUpdateStock->affected_rows !== 1) {
                throw new Exception("No se pudo descontar el stock del almacén Principal para el producto ID $idProducto.");
            }

            // D. Registrar el movimiento del registro descontado.
            $sqlMovimiento->bind_param("iiiis", $idStock, $cantidadInicio, $cantidadDescontar, $cantidadFinal, $numeroFactura);
            if (!$sqlMovimiento->execute()) {
                throw new Exception("Error en movimientos: " . $sqlMovimiento->error);
            }

            $cantidadPendiente -= $cantidadDescontar;
            if ($cantidadPendiente === 0) {
                break;
            }
        }
    }

    // Confirmamos los cambios en la base de datos
    $conexion->commit();

    echo json_encode([
        "ok" => true, 
        "msg" => "Venta procesada con éxito", 
        "numero_factura" => $numeroFactura
    ]);

} catch (Exception $e) {
    $conexion->rollback();
    echo json_encode(["ok" => false, "msg" => $e->getMessage()]);
}
?>