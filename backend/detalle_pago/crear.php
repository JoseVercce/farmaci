<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$id_venta = $_POST["id_venta"];
$id_metodo = $_POST["id_metodo_pago"];
$monto = $_POST["monto"];

$stmt = $conn->prepare(
    "INSERT INTO detalle_pago (id_venta, id_metodo_pago, monto)
     VALUES (?, ?, ?)"
);
$stmt->bind_param("iid", $id_venta, $id_metodo, $monto);

echo json_encode($stmt->execute()
    ? ["status" => "ok"]
    : ["status" => "error", "msg" => $conn->error]
);
?>
