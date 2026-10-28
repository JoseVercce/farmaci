<?php
require_once "../conexion.php";
session_start();

header("Content-Type: application/json");

$id = $_GET["id"] ?? null;

if (!$id) {
    echo json_encode([
        "status" => "error",
        "message" => "ID no recibido"
    ]);
    exit;
}

try {

    $sql = $conexion->prepare("DELETE FROM rol WHERE id = ?");
    $sql->bind_param("i", $id);
    $sql->execute();

    echo json_encode([
        "status" => "success",
        "message" => "Rol eliminado correctamente"
    ]);

} catch (Exception $e) {

    // Aquí enviamos el error a la consola
    echo json_encode([
        "status" => "error",
        "message" => "No se puede eliminar el rol porque está asignado a uno o más usuarios.",
        "debug" => $e->getMessage()
    ]);
}
