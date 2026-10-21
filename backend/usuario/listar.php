<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$sql = "
    SELECT 
        u.id,
        u.nombre,
        u.usuario,
        u.correo,
        u.telefono,
        GROUP_CONCAT(r.nombre SEPARATOR ', ') AS roles
    FROM usuario u
    LEFT JOIN usuario_rol ur ON ur.id_usuario = u.id
    LEFT JOIN rol r ON r.id = ur.id_rol
    WHERE u.estado = 1
    GROUP BY u.id
    ORDER BY u.id DESC
";


$result = $conexion->query($sql);

$data = [];
while ($row = $result->fetch_assoc()) {
    $row["roles"] = $row["roles"] ?? "";
    $data[] = $row;
}

echo json_encode(["ok" => true, "data" => $data]);
?>
