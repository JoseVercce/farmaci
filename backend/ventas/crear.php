<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$id_cliente = $_POST["id_cliente"];
$id_caja = $_POST["id_caja"];
$total = $_POST["total"];

$stmt = $conn->prepare(
    "INSERT INTO ventas (fecha, id_cliente, id_caja, total)
     VALUES (NOW(), ?, ?, ?)"
);
$stmt->bind_param("iid", $id_cliente, $id_caja, $total);

echo json_encode($stmt->execute() ? ["status" => "ok", "id_venta" => $stmt->insert_id] : ["status" => "error"]);
?>
