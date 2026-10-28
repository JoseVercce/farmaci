<?php
require_once __DIR__ . "/permisos_acceso.php";
requireAdminPermisosRol();
require_once __DIR__ . "/../conexion.php";

header("Content-Type: application/json; charset=utf-8");
$id_rol = filter_input(INPUT_POST, "id_rol", FILTER_VALIDATE_INT);
$id_modulo = filter_input(INPUT_POST, "id_modulo", FILTER_VALIDATE_INT);
$permisos = json_decode($_POST["permisos"] ?? "", true);

if (!$id_rol || !$id_modulo || !is_array($permisos)) {
    http_response_code(400);
    echo json_encode(["ok" => false, "error" => "Los datos del rol, módulo o permisos no son válidos."]);
    exit;
}

$permisosValidados = [];
foreach ($permisos as $p) {
    if (!is_array($p)) {
        http_response_code(400);
        echo json_encode(["ok" => false, "error" => "Hay un permiso con formato incorrecto."]);
        exit;
    }

    $id_pagina = filter_var($p["pagina"] ?? null, FILTER_VALIDATE_INT);
    $id_permiso = filter_var($p["permiso"] ?? null, FILTER_VALIDATE_INT);
    if (!$id_pagina || !$id_permiso) {
        http_response_code(400);
        echo json_encode(["ok" => false, "error" => "Hay un permiso o una página no válidos."]);
        exit;
    }
    $permisosValidados[$id_pagina . ":" . $id_permiso] = [$id_pagina, $id_permiso];
}

try {
    $conexion->begin_transaction();

    $sql = $conexion->prepare("SELECT id FROM rol WHERE id = ?");
    $sql->bind_param("i", $id_rol);
    $sql->execute();
    if (!$sql->get_result()->fetch_assoc()) {
        $conexion->rollback();
        http_response_code(404);
        echo json_encode(["ok" => false, "error" => "El rol seleccionado no existe."]);
        exit;
    }

    $sql = $conexion->prepare("SELECT id FROM modulo WHERE id = ?");
    $sql->bind_param("i", $id_modulo);
    $sql->execute();
    if (!$sql->get_result()->fetch_assoc()) {
        $conexion->rollback();
        http_response_code(404);
        echo json_encode(["ok" => false, "error" => "El módulo seleccionado no existe."]);
        exit;
    }

    foreach ($permisosValidados as [$id_pagina, $id_permiso]) {
        $sql = $conexion->prepare("SELECT id FROM pagina WHERE id = ?");
        $sql->bind_param("i", $id_pagina);
        $sql->execute();
        if (!$sql->get_result()->fetch_assoc()) {
            $conexion->rollback();
            http_response_code(400);
            echo json_encode(["ok" => false, "error" => "Una página seleccionada ya no existe."]);
            exit;
        }

        $sql = $conexion->prepare("SELECT id FROM permisos WHERE id = ?");
        $sql->bind_param("i", $id_permiso);
        $sql->execute();
        if (!$sql->get_result()->fetch_assoc()) {
            $conexion->rollback();
            http_response_code(400);
            echo json_encode(["ok" => false, "error" => "Un permiso seleccionado ya no existe."]);
            exit;
        }
    }

    $sql = $conexion->prepare(
        "SELECT id FROM rm_pagin WHERE id_rol = ? AND id_modulo = ? ORDER BY id ASC FOR UPDATE"
    );
    $sql->bind_param("ii", $id_rol, $id_modulo);
    $sql->execute();
    $relaciones = $sql->get_result()->fetch_all(MYSQLI_ASSOC);

    if ($relaciones) {
        $id_rm_pagin = (int)$relaciones[0]["id"];
        $sql = $conexion->prepare(
            "DELETE rm_per FROM rm_per
             INNER JOIN rm_pagin ON rm_per.id_rm_pagin = rm_pagin.id
             WHERE rm_pagin.id_rol = ? AND rm_pagin.id_modulo = ?"
        );
        $sql->bind_param("ii", $id_rol, $id_modulo);
        $sql->execute();

        $sql = $conexion->prepare(
            "DELETE FROM rm_pagin WHERE id_rol = ? AND id_modulo = ? AND id <> ?"
        );
        $sql->bind_param("iii", $id_rol, $id_modulo, $id_rm_pagin);
        $sql->execute();
    } else {
        $sql = $conexion->prepare("INSERT INTO rm_pagin (id_rol, id_modulo) VALUES (?, ?)");
        $sql->bind_param("ii", $id_rol, $id_modulo);
        $sql->execute();
        $id_rm_pagin = $conexion->insert_id;
    }

    $sql = $conexion->prepare(
        "INSERT INTO rm_per (id_rm_pagin, id_pagina, id_permiso) VALUES (?, ?, ?)"
    );
    foreach ($permisosValidados as [$id_pagina, $id_permiso]) {
        $sql->bind_param("iii", $id_rm_pagin, $id_pagina, $id_permiso);
        $sql->execute();
    }

    $conexion->commit();
    echo json_encode(["ok" => true, "mensaje" => "Permisos actualizados correctamente."]);
} catch (mysqli_sql_exception $error) {
    $conexion->rollback();
    error_log("Error guardando permisos del rol: " . $error->getMessage());
    http_response_code(500);
    echo json_encode(["ok" => false, "error" => "No se pudieron guardar los permisos."]);
}
