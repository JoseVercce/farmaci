<?php
header("Content-Type: application/json");
require "../conexion.php";

$id = $_POST["id"] ?? 0;

if ($id == 0) {
    echo json_encode(["ok" => false, "error" => "ID inválido"]);
    exit;
}

/* ============================================================
   VERIFICAR TODAS LAS RESTRICCIONES DEL PRODUCTO
============================================================ */

$tablas = [
    "detalle_ventas"   => "id_producto",
    "detalle_compras"  => "id_producto",
    "stock"            => "id_producto",
    "movimientos"      => "id_stock", // movimientos depende de stock
    "facturas_detalle" => "id_producto"
];

$tieneRestriccion = false;

/* ============================
   REVISAR DETALLE VENTAS / COMPRAS / STOCK / FACTURAS
============================ */
foreach ($tablas as $tabla => $campo) {

    // movimientos usa id_stock, así que requiere consulta especial
    if ($tabla === "movimientos") {
        $sql = $conexion->prepare("
            SELECT COUNT(*) AS total
            FROM movimientos
            WHERE id_stock IN (SELECT id FROM stock WHERE id_producto = ?)
        ");
        $sql->bind_param("i", $id);
    } else {
        $sql = $conexion->prepare("SELECT COUNT(*) AS total FROM $tabla WHERE $campo = ?");
        $sql->bind_param("i", $id);
    }

    $sql->execute();
    $total = $sql->get_result()->fetch_assoc()["total"];

    if ($total > 0) {
        $tieneRestriccion = true;
        break;
    }
}

/* ============================================================
   SI TIENE RESTRICCIONES → DESACTIVAR
============================================================ */
if ($tieneRestriccion) {
    try {
        $conexion->begin_transaction();

        $stmtStock = $conexion->prepare("UPDATE stock SET estado = 0 WHERE id_producto = ?");
        if (!$stmtStock) {
            throw new mysqli_sql_exception("No se pudo preparar la actualización del stock.");
        }
        $stmtStock->bind_param("i", $id);
        if (!$stmtStock->execute()) {
            throw new mysqli_sql_exception("No se pudo inactivar el stock del producto.");
        }

        $stmtDes = $conexion->prepare("UPDATE productos SET estado = 0 WHERE id = ?");
        if (!$stmtDes) {
            throw new mysqli_sql_exception("No se pudo preparar la desactivación del producto.");
        }
        $stmtDes->bind_param("i", $id);
        if (!$stmtDes->execute()) {
            throw new mysqli_sql_exception("No se pudo desactivar el producto.");
        }

        $conexion->commit();
        echo json_encode([
            "ok" => true,
            "msg" => "Producto desactivado y stock asociado inactivado"
        ]);
    } catch (mysqli_sql_exception $e) {
        $conexion->rollback();
        error_log("Error al desactivar el producto $id y su stock: " . $e->getMessage());
        echo json_encode([
            "ok" => false,
            "error" => "No se pudo desactivar el producto y su stock asociado."
        ]);
    }
    exit;
}

/* ============================================================
   SI NO TIENE RESTRICCIONES → ELIMINAR FÍSICAMENTE
============================================================ */

$sqlDet = "DELETE FROM detalle_compras WHERE id_producto = ?";
$stmtDet = $conexion->prepare($sqlDet);
$stmtDet->bind_param("i", $id);
$stmtDet->execute();

$sqlMov = "DELETE FROM movimientos WHERE id_stock IN (
              SELECT id FROM stock WHERE id_producto = ?
          )";
$stmtMov = $conexion->prepare($sqlMov);
$stmtMov->bind_param("i", $id);
$stmtMov->execute();

$sqlStock = "DELETE FROM stock WHERE id_producto = ?";
$stmtStock = $conexion->prepare($sqlStock);
$stmtStock->bind_param("i", $id);
$stmtStock->execute();

$sqlProd = "DELETE FROM productos WHERE id = ?";
$stmtProd = $conexion->prepare($sqlProd);
$stmtProd->bind_param("i", $id);

if ($stmtProd->execute()) {
    echo json_encode(["ok" => true, "msg" => "Producto eliminado"]);
} else {
    echo json_encode(["ok" => false, "error" => "No se pudo eliminar"]);
}
?>
