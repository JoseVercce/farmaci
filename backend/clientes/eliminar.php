<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$response = [];

try {
    if (!isset($_POST['id'])) {
        throw new Exception("ID no recibido");
    }

    $id = $_POST['id'];

    $sql = "DELETE FROM clientes WHERE id = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        $response["status"] = "success";
        $response["message"] = "Cliente eliminado correctamente";
    } else {
        throw new Exception("Error al eliminar: " . $stmt->error);
    }

} catch (Exception $e) {
    $response["status"] = "error";
    $response["message"] = $e->getMessage();
}

echo json_encode($response);
?>
