<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$id = $_POST["id"] ?? null;

if (!$id) {
    echo json_encode(["status" => "error", "msg" => "ID requerido"]);
    exit;
}

/* ============================
   VERIFICAR SI TIENE COMPRAS
============================ */
$sql = $conexion->prepare("SELECT COUNT(*) AS total FROM compras WHERE id_proveedor = ?");
$sql->bind_param("i", $id);
$sql->execute();
$total = $sql->get_result()->fetch_assoc()["total"];

/* ============================
   SI TIENE COMPRAS → INACTIVAR
============================ */
if ($total > 0) {
    $stmt = $conexion->prepare("UPDATE proveedores SET estado = 0 WHERE id = ?");
    $stmt->bind_param("i", $id);

    echo json_encode($stmt->execute()
        ? ["status" => "success", "msg" => "Proveedor desactivado (tiene compras)"]
        : ["status" => "error", "msg" => "No se pudo desactivar"]);
    exit;
}

/* ============================
   SI NO TIENE COMPRAS → ELIMINAR
============================ */
$stmt = $conexion->prepare("DELETE FROM proveedores WHERE id = ?");
$stmt->bind_param("i", $id);

echo json_encode($stmt->execute()
    ? ["status" => "success", "msg" => "Proveedor eliminado"]
    : ["status" => "error", "msg" => "No se pudo eliminar"]);
