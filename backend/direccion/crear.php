<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$calle = $_POST["calle"];
$avenida = $_POST["avenida"];
$sector = $_POST["sector"];
$numero = $_POST["numero_casa"];
$status = $_POST["status"];
$id_usuario = $_POST["id_usuario"];

$stmt = $conn->prepare(
    "INSERT INTO direccion (calle, avenida, sector, numero_casa, status, id_usuario)
     VALUES (?, ?, ?, ?, ?, ?)"
);
$stmt->bind_param("sssssi", $calle, $avenida, $sector, $numero, $status, $id_usuario);

echo json_encode($stmt->execute() ? ["status"=>"ok"] : ["status"=>"error"]);
?>
