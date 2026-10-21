<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$response = [];

try {
    if (!isset($_GET['id'])) {
        throw new Exception("ID no recibido");
    }

    $id = $_GET['id'];

    // OJO: tu tabla se llama "clientes" (plural)
    $sql = "SELECT * FROM clientes WHERE id = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();

    $result = $stmt->get_result();
    $cliente = $result->fetch_assoc();

    if (!$cliente) {
        throw new Exception("Cliente no encontrado");
    }

    $response["status"] = "success";
    $response["data"] = $cliente;

} catch (Exception $e) {
    $response["status"] = "error";
    $response["message"] = $e->getMessage();
}

echo json_encode($response);
?>
