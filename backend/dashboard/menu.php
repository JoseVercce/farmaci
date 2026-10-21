<?php
require '../seguridad.php';
requireLogin();

$permisos = obtenerPermisosUsuario($pdo);
?>

<ul>
<?php foreach ($permisos as $url => $info): ?>
    <li>
        <a href="../<?php echo $url; ?>">
            <?php echo $info['modulo'] . ' - ' . $info['pagina']; ?>
        </a>
    </li>
<?php endforeach; ?>
</ul>
