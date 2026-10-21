<?php
header("Content-Type: application/json");
require "../conexion.php";

$id = $_GET["id"] ?? null;


if (!$id) {
    echo json_encode(["ok" => false, "msg" => "ID no recibido"]);
    exit;
}

try {
    $stmt = $conexion->prepare("DELETE FROM almacen WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(["ok" => true]);
    } else {
        echo json_encode(["ok" => false, "msg" => $conexion->error]);
    }

} catch (Exception $e) {
    echo json_encode(["ok" => false, "msg" => $e->getMessage()]);
}
