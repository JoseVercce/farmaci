<?php
require "../conexion.php";


$buscar = $_GET["buscar"] ?? "";
$pagina = intval($_GET["pagina"] ?? 1);
$limite = intval($_GET["limite"] ?? 10);
$offset = ($pagina - 1) * $limite;

$like = "%$buscar%";

/* ============================
   TOTAL
============================ */
$sqlTotal = $conexion->prepare("
    SELECT COUNT(*) AS total
    FROM stock s
    INNER JOIN productos p ON p.id = s.id_producto
    WHERE p.estado = 1
      AND (
            p.nombre LIKE ?
         OR s.cantidad_actual LIKE ?
         OR s.cantidad_minima LIKE ?
         OR s.cantidad_maxima LIKE ?
         OR (
                CASE
                    WHEN s.cantidad_actual <= s.cantidad_minima THEN 'Bajo'
                    WHEN s.cantidad_actual >= s.cantidad_maxima THEN 'Excedido'
                    ELSE 'Normal'
                END
            ) LIKE ?
      )
");

$sqlTotal->bind_param("sssss", $like, $like, $like, $like, $like);
$sqlTotal->execute();
$total = $sqlTotal->get_result()->fetch_assoc()["total"];

/* ============================
   LISTADO PAGINADO
============================ */
$sql = $conexion->prepare("
    SELECT 
        s.id,
        p.nombre,
        s.cantidad_actual,
        s.cantidad_minima AS minima,
        s.cantidad_maxima AS maxima,
        s.id_almacen,
        a.nombre AS almacen,   -- ✔ NOMBRE DEL ALMACÉN
        CASE
            WHEN s.cantidad_actual <= s.cantidad_minima THEN 'Bajo'
            WHEN s.cantidad_actual >= s.cantidad_maxima THEN 'Excedido'
            ELSE 'Normal'
        END AS estado
    FROM stock s
    INNER JOIN productos p ON p.id = s.id_producto
    LEFT JOIN almacen a ON a.id = s.id_almacen   -- ✔ JOIN AGREGADO
    WHERE p.estado = 1
      AND (
            p.nombre LIKE ?
         OR s.cantidad_actual LIKE ?
         OR s.cantidad_minima LIKE ?
         OR s.cantidad_maxima LIKE ?
         OR (
                CASE
                    WHEN s.cantidad_actual <= s.cantidad_minima THEN 'Bajo'
                    WHEN s.cantidad_actual >= s.cantidad_maxima THEN 'Excedido'
                    ELSE 'Normal'
                END
            ) LIKE ?
      )
    ORDER BY p.nombre ASC
    LIMIT ? OFFSET ?
");


$sql->bind_param("ssssssi", $like, $like, $like, $like, $like, $limite, $offset);
$sql->execute();
$res = $sql->get_result();

$data = [];
while ($row = $res->fetch_assoc()) {

    $data[] = [
        "id" => $row["id"],
        "nombre" => $row["nombre"],
        "cantidad_actual" => $row["cantidad_actual"],
        "minima" => $row["minima"],
        "maxima" => $row["maxima"],
        "estado" => $row["estado"],
        "almacen" => $row["almacen"] ?? "Sin asignar"
    ];
}


echo json_encode([
    "ok" => true,
    "data" => $data,
    "total" => $total
]);
?>
