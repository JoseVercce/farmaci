<?php
header("Content-Type: application/json");
require_once "../conexion.php";
require '../seguridad.php';
requireLogin();

// Leer los datos JSON enviados desde JavaScript
$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty($data['items'])) {
    echo json_encode(["ok" => false, "msg" => "La factura está vacía."]);
    exit;
}

$idCliente = !empty($data['cliente_id']) ? intval($data['cliente_id']) : 1; 
$totalVenta = floatval($data['total']);
$idUsuario = $_SESSION['id_usuario'] ?? 1; 
$idCaja = 1; 

// Iniciamos la transacción
$conexion->begin_transaction();

try {
    // 1. Generar número de factura
    $resMax = $conexion->query("SELECT MAX(id_venta) AS max_id FROM ventas");
    $rowMax = $resMax->fetch_assoc();
    $nextId = intval($rowMax['max_id']) + 1;
    $numeroFactura = sprintf("FACT-%06d", $nextId);

    // 2. Insertar en la tabla 'ventas'
    $sqlVenta = $conexion->prepare("INSERT INTO ventas (numero_factura, fecha, id_cliente, id_caja, total, id_usuario) VALUES (?, NOW(), ?, ?, ?, ?)");
    $sqlVenta->bind_param("siidi", $numeroFactura, $idCliente, $idCaja, $totalVenta, $idUsuario);
    $sqlVenta->execute();
    $idVenta = $conexion->insert_id; 

    // 3. Procesar cada producto del carrito
    $sqlDetalle = $conexion->prepare("INSERT INTO detalle_ventas (id_venta, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)");
    $sqlGetStock = $conexion->prepare("SELECT cantidad_actual, id_stock FROM stock WHERE id_producto = ?");
    $sqlUpdateStock = $conexion->prepare("UPDATE stock SET cantidad_actual = cantidad_actual - ? WHERE id_producto = ?");
    
    // CORRECCIÓN: Cambiamos id_producto por id_stock según tu diagrama
    $sqlMovimiento = $conexion->prepare("INSERT INTO movimientos (id_stock, tipo, cantidad_inicio, cantidad_salida, cantidad_final, fecha, referencia) VALUES (?, 'SALIDA', ?, ?, ?, NOW(), ?)");

    if (!$sqlMovimiento) {
        throw new Exception("Error SQL en la tabla movimientos: " . $conexion->error);
    }

    foreach ($data['items'] as $item) {
        $idProducto = intval($item['id']);
        $cantidad = intval($item['cantidad']);
        $precio = floatval($item['precio']);

        // A. Guardar en detalle_ventas
        $sqlDetalle->bind_param("iiid", $idVenta, $idProducto, $cantidad, $precio);
        $sqlDetalle->execute();

        // B. Consultar el stock actual y obtener el id_stock
        $sqlGetStock->bind_param("i", $idProducto);
        $sqlGetStock->execute();
        $resStock = $sqlGetStock->get_result();
        
        if ($rowStock = $resStock->fetch_assoc()) {
            $cantidadInicio = intval($rowStock['cantidad_actual']);
            $idStock = intval($rowStock['id_stock']); // Extraemos el id_stock de la base de datos
            $cantidadFinal = $cantidadInicio - $cantidad;

            // C. Descontar del stock
            $sqlUpdateStock->bind_param("ii", $cantidad, $idProducto);
            $sqlUpdateStock->execute();

            // D. Registrar el movimiento de salida (usando el id_stock)
            $sqlMovimiento->bind_param("iiiis", $idStock, $cantidadInicio, $cantidad, $cantidadFinal, $numeroFactura);
            $sqlMovimiento->execute();
        } else {
            throw new Exception("El producto ID $idProducto no tiene registro de stock.");
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
    // Si hubo error, deshacemos todo
    $conexion->rollback();
    echo json_encode(["ok" => false, "msg" => "Error al procesar la venta: " . $e->getMessage()]);
}
?>