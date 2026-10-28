<?php
require_once "../conexion.php";

$id = $_GET["id"];

$sql = $conexion->prepare("SELECT * FROM rol WHERE id = ?");
$sql->bind_param("i", $id);
$sql->execute();
$res = $sql->get_result();

echo json_encode($res->fetch_assoc());
?>
