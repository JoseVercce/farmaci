document.write(`
<aside class="sidebar">
<div class="sidebar-brand" id="sidebar-brand-btn">
    <img src="../assets/css/favicon.png" class="sidebar-logo" alt="Logo de la farmacia">
    <div class="sidebar-brand-info">
        <h3 id="farmacia-nombre">Farmacia Los Berti</h3>
    </div>
</div>

    <div id="sidebar-user-menu" class="sidebar-user-menu hidden">
      <button onclick="cerrarSesion()" class="logout-btn">Cerrar sesión</button>
    </div>

    <nav class="sidebar-nav">
      <a href="../dashboard/index.html" class="nav-item">Inicio</a>
      <a href="../productos/index.html" class="nav-item">Productos</a>
      <a href="../compras/index.html" class="nav-item">Compras</a>
      <a href="../stock/index.html" class="nav-item">Stock</a>
      <a href="../movimientos/index.html" class="nav-item">Movimientos</a>
      <a href="../facturas/index.html" class="nav-item">Facturas</a>
      <a href="../proveedores/index.html" class="nav-item">Proveedores</a>
      <a href="../clientes/index.html" class="nav-item">Clientes</a>
      <a href="../historial_ventas/index.html" class="nav-item">Historial de Ventas</a>

<div class="nav-dropdown">
  <button class="nav-item nav-dropdown-btn">Configuración<span class="arrow">▼</span></button>
    <div class="nav-dropdown-content">
      <a href="../usuarios/index.html" class="nav-subitem">Usuarios</a>
      <a href="../roles/index.html" class="nav-subitem">Roles</a>
      <a href="../almacenes/index.html" class="nav-subitem">Almacenes</a>
      <a href="../categorias/index.html" class="nav-subitem">Categorías</a>
      <button id="btn-mini-logout" class="nav-subitem logout-subitem" onclick="cerrarSesion()"> 
        <span class="logout-text">Cerrar sesión</span>
      </button>
    </div>
</div>
    </nav>
  </aside>
`);



