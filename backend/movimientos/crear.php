<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$id_stock = $_POST["id_stock"];
$tipo = $_POST["tipo"];
$inicio = $_POST["cantidad_inicio"];
$ingreso = $_POST["cantidad_ingreso"];
$salida = $_POST["cantidad_salida"];
$final = $_POST["cantidad_final"];
$ref = $_POST["referencia"];

$stmt = $conn->prepare(
    "INSERT INTO movimientos (id_stock, tipo, cantidad_inicio, cantidad_ingreso, cantidad_salida, cantidad_final, fecha, referencia)
     VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)"
);
$stmt->bind_param("isiiiis", $id_stock, $tipo, $inicio, $ingreso, $salida, $final, $ref);

echo json_encode($stmt->execute() ? ["status" => "ok"] : ["status" => "error"]);
?>
