<?php
header("Content-Type: application/json");
require_once "../conexion.php";

$id_rol = $_POST["id_rol"];
$id_pagina = $_POST["id_pagina"];
$id_modulo = $_POST["id_modulo"];

$stmt = $conn->prepare(
    "INSERT INTO rm_pagin (id_rol, id_pagina, id_modulo)
     VALUES (?, ?, ?)"
);
$stmt->bind_param("iii", $id_rol, $id_pagina, $id_modulo);

echo json_encode($stmt->execute() ? ["status"=>"ok"] : ["status"=>"error"]);
?>
