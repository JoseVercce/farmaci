<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$id_modulo = $_GET["id_modulo"] ?? null;

if ($id_modulo) {
    $sql = $conexion->prepare("SELECT id, nombre, url FROM pagina WHERE id_modulo = ?");
    $sql->bind_param("i", $id_modulo);
    $sql->execute();
    $result = $sql->get_result();
} else {
    $result = $conexion->query("SELECT id, nombre, url FROM pagina");
}

$paginas = [];
while ($row = $result->fetch_assoc()) {
    $paginas[] = $row;
}

echo json_encode($paginas);
?>
