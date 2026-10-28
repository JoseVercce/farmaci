<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$estadoSolicitado = $_GET["estado"] ?? "1";
$estado = $estadoSolicitado === "todos"
    ? -1
    : (in_array($estadoSolicitado, ["0", "1"], true) ? intval($estadoSolicitado) : 1);

$sql = "
    SELECT 
        u.id,
        u.nombre,
        u.usuario,
        u.correo,
        u.telefono,
        u.estado,
        GROUP_CONCAT(r.nombre SEPARATOR ', ') AS roles
    FROM usuario u
    LEFT JOIN usuario_rol ur ON ur.id_usuario = u.id
    LEFT JOIN rol r ON r.id = ur.id_rol
    WHERE (? = -1 OR u.estado = ?)
    GROUP BY u.id
    ORDER BY u.id DESC
";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("ii", $estado, $estado);
$stmt->execute();
$result = $stmt->get_result();

$data = [];
while ($row = $result->fetch_assoc()) {
    $row["roles"] = $row["roles"] ?? "";
    $data[] = $row;
}

echo json_encode(["ok" => true, "data" => $data]);
?>
