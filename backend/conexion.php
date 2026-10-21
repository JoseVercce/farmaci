<?php
$conexion = new mysqli("localhost", "root", "", "berti2");

if ($conexion->connect_errno) {
    die("Error de conexión: " . $conexion->connect_error);
}

$conexion->set_charset("utf8");
