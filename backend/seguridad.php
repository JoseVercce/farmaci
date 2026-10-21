<?php
session_name("farmacia_sesion");
session_start();

require_once __DIR__ . '/config.php';

function usuarioActual() {
    return $_SESSION['usuario'] ?? null;
}

function requireLogin() {
    if (!usuarioActual()) {
        header('Content-Type: application/json');
        echo json_encode(["ok" => false, "msg" => "No autenticado"]);
        exit;
    }
}

function normalizarRutaPagina(string $url): string {
    $map = [
        'dashboard/metricas.php' => '/berti2/frontend/dashboard/index.html',
        'productos/listar.php' => '/berti2/frontend/productos/index.html',
        'compras/listar.php' => '/berti2/frontend/compras/index.html',
        'stock/listar.php' => '/berti2/frontend/stock/index.html',
        'movimientos/listar.php' => '/berti2/frontend/movimientos/index.html',
        'ventas/listar.php' => '/berti2/frontend/facturas/index.html',
        'proveedores/listar.php' => '/berti2/frontend/proveedores/index.html',
        'clientes/listar.php' => '/berti2/frontend/clientes/index.html',
        'usuario/listar.php' => '/berti2/frontend/usuarios/index.html',
        'rol/listar.php' => '/berti2/frontend/roles/index.html',
        'categoria/listar.php' => '/berti2/frontend/categorias/index.html'
    ];

    if (isset($map[$url])) {
        return $map[$url];
    }

    $ruta = str_replace([
        'backend/',
        '/listar.php',
        '/crear.php',
        '/actualizar.php',
        '/eliminar.php',
        '/obtener.php',
        '/guardar.php',
        '/detalle.php',
        '/cargar.php'
    ], '', $url);

    $ruta = trim($ruta, '/');
    if ($ruta === '') {
        return '/berti2/frontend/dashboard/index.html';
    }

    return '/berti2/frontend/' . $ruta . '/index.html';
}

function obtenerPermisosUsuario(PDO $pdo) {
    $user = usuarioActual();
    if (!$user) {
        return [];
    }

$paginasBase = [
    'dashboard/metricas.php' => ['Dashboard', 'Inicio', ['Leer', 'Crear', 'Actualizar', 'Eliminar']],
    'productos/listar.php' => ['Productos', 'Productos', ['Leer', 'Crear', 'Actualizar', 'Eliminar']],
    'compras/listar.php' => ['Compras', 'Compras', ['Leer', 'Crear', 'Actualizar', 'Eliminar']],
    'stock/listar.php' => ['Stock', 'Stock', ['Leer', 'Crear', 'Actualizar', 'Eliminar']],
    'movimientos/listar.php' => ['Movimientos', 'Movimientos', ['Leer', 'Crear', 'Actualizar', 'Eliminar']],
    'ventas/listar.php' => ['Ventas', 'Ventas', ['Leer', 'Crear', 'Actualizar', 'Eliminar']],  // ✔ CORREGIDO
    'proveedores/listar.php' => ['Proveedores', 'Proveedores', ['Leer', 'Crear', 'Actualizar', 'Eliminar']],
    'clientes/listar.php' => ['Clientes', 'Clientes', ['Leer', 'Crear', 'Actualizar', 'Eliminar']],
    'usuario/listar.php' => ['Usuarios', 'Configuración', ['Leer', 'Crear', 'Actualizar', 'Eliminar']],
    'rol/listar.php' => ['Roles', 'Configuración', ['Leer', 'Crear', 'Actualizar', 'Eliminar']],
    'categoria/listar.php' => ['Categorías', 'Configuración', ['Leer', 'Crear', 'Actualizar', 'Eliminar']]
];


    $permisos = [];
    foreach ($paginasBase as $url => $datos) {
        $permisos[$url] = [
            'pagina' => $datos[0],
            'modulo' => $datos[1],
            'permisos' => $datos[2]
        ];
    }

    return $permisos;
}

function obtenerMenuUsuario(PDO $pdo) {
    $permisos = obtenerPermisosUsuario($pdo);

    $menu = [];
    foreach ($permisos as $url => $info) {
        $menu[] = [
            'url' => $url,
            'archivo' => normalizarRutaPagina($url),
            'nombre' => $info['pagina'],
            'modulo' => $info['modulo'],
            'permisos' => $info['permisos']
        ];
    }

    if (empty($menu)) {
        $menu[] = [
            'url' => 'dashboard/metricas.php',
            'archivo' => '/berti2/frontend/dashboard/index.html',
            'nombre' => 'Dashboard',
            'modulo' => 'Inicio',
            'permisos' => ['Leer']
        ];
    }

    return $menu;
}

function puedeAccederPagina(PDO $pdo, string $url) {
    return usuarioActual() !== null;
}

function tienePermiso(PDO $pdo, string $url, string $permiso) {
    return usuarioActual() !== null;
}
