<?php
require_once "../conexion.php";

$id = $_POST["id"];
$nombre = $_POST["nombre"];
$descripcion = $_POST["descripcion"];

if ($id == "") {
    $sql = $conexion->prepare("INSERT INTO rol (nombre, descripcion) VALUES (?, ?)");
    $sql->bind_param("ss", $nombre, $descripcion);
    $sql->execute();
    echo json_encode(["mensaje" => "Rol creado"]);
} else {
    $sql = $conexion->prepare("UPDATE rol SET nombre=?, descripcion=? WHERE id=?");
    $sql->bind_param("ssi", $nombre, $descripcion, $id);
    $sql->execute();
    echo json_encode(["mensaje" => "Rol actualizado"]);
}
?>
