<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$id_rm_pagin = $_POST["id_rm_pagin"];
$id_permiso = $_POST["id_permiso"];

$stmt = $conn->prepare(
    "INSERT INTO rm_per (id_rm_pagin, id_permiso)
     VALUES (?, ?)"
);
$stmt->bind_param("ii", $id_rm_pagin, $id_permiso);

echo json_encode($stmt->execute() ? ["status"=>"ok"] : ["status"=>"error"]);
?>
