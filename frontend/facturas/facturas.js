const API_FACT = "/berti/backend/ventas/";
const API_CLI = "/berti/backend/clientes/";
const API_PROD = "/berti/backend/productos/";
const TASA_IVA = 0.16; // 16% de IVA

let modalData = []; 
let modalTipo = ''; 

document.addEventListener("DOMContentLoaded", () => {
    // 1. Cargar datos iniciales
    actualizarCorrelativo();
    cargarCarritoDeStorage();

    // 2. Conectar botones del panel lateral
    document.querySelector('.btn-guardar').addEventListener('click', guardarFacturaEnEspera);
    document.querySelector('.btn-cargar').addEventListener('click', abrirModalCargar);
    document.querySelector('.pos-actions .btn-eliminar').addEventListener('click', abrirModalEliminar);

    // 3. Conectar botón Totalizar (APUNTANDO SOLO A PROCESAR VENTA, SIN ALERTAS VIEJAS)
    document.querySelector('.btn-totalizar').addEventListener('click', procesarVenta);

    // 4. Configurar tecla Enter para los buscadores
    document.getElementById('pos-buscar-producto').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            abrirModalBusqueda('Producto');
        }
    });

    document.getElementById('pos-buscar-cliente').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            abrirModalBusqueda('Cliente');
        }
    });

    // 5. Filtro en tiempo real del modal
    document.getElementById('input-filtro-modal').addEventListener('input', (e) => {
        renderizarTablaModal(e.target.value);
    });
});

async function abrirModalBusqueda(tipo) {
  const inputCliente = document.getElementById('pos-buscar-cliente');
  const filasActuales = document.querySelectorAll('#pos-detalle-body tr').length;
  
  if (tipo === 'Producto' && inputCliente.value.trim() === '') {
      mostrarAlertaPersonalizada("Primero debes buscar y seleccionar un cliente para iniciar la factura.");
      return;
  }

  if (tipo === 'Cliente' && filasActuales > 0) {
      mostrarAlertaPersonalizada("Ya tienes productos cargados. Para cambiar el cliente, primero debes eliminar los productos o vaciar la factura.");
      return;
  }

  const modal = document.getElementById('modal-busqueda-pos');
  const titulo = document.getElementById('modal-busqueda-titulo');
  const thead = document.getElementById('modal-busqueda-head'); // Seleccionamos la cabecera
  const tbody = document.getElementById('modal-busqueda-body');
  const inputFiltro = document.getElementById('input-filtro-modal');
  
  modalTipo = tipo;
  titulo.textContent = `Buscar ${tipo}`;
  
  // Cambiamos las columnas dinámicamente
  if (tipo === 'Producto') {
      thead.innerHTML = `
          <tr>
              <th>Código</th>
              <th>Producto</th>
              <th class="text-center">Stock</th>
              <th class="text-right">Precio</th>
          </tr>
      `;
  } else {
      thead.innerHTML = `
          <tr>
              <th>Cédula / RIF</th>
              <th>Nombre del Cliente</th>
          </tr>
      `;
  }

  tbody.innerHTML = '<tr><td colspan="4" class="text-center">Cargando datos... ⏳</td></tr>';
  
  let textoPrevio = "";
  if (tipo === 'Producto') {
      textoPrevio = document.getElementById('pos-buscar-producto').value.trim();
  } else if (tipo === 'Cliente') {
      textoPrevio = inputCliente.value.trim();
  }
  
  inputFiltro.value = textoPrevio;
  modal.classList.remove('hidden');
  modal.style.display = 'flex';

  if (tipo === 'Producto') await cargarProductosModal();
  else if (tipo === 'Cliente') await cargarClientesModal();

  renderizarTablaModal(textoPrevio);
  setTimeout(() => inputFiltro.focus(), 100);
}

function cerrarModalBusqueda() {
  const modal = document.getElementById('modal-busqueda-pos');
  modal.classList.add('hidden');
  modal.style.display = 'none';
}

async function cargarProductosModal() {
  try {
    const res = await fetch(API_PROD + "listar.php"); 
    const json = await res.json();
    modalData = json.data || [];
  } catch (error) {
    document.getElementById('modal-busqueda-body').innerHTML = '<tr><td colspan="3" class="text-center text-danger">Error de base de datos</td></tr>';
  }
}

async function cargarClientesModal() {
  try {
    const res = await fetch(API_CLI + "listar_todo.php"); 
    const json = await res.json();
    modalData = json.data || [];
  } catch (error) {
    document.getElementById('modal-busqueda-body').innerHTML = '<tr><td colspan="3" class="text-center text-danger">Error de base de datos</td></tr>';
  }
}

function renderizarTablaModal(filtro = "") {
  const tbody = document.getElementById('modal-busqueda-body');
  tbody.innerHTML = '';
  
  const dataFiltrada = modalData.filter(item => {
    const textoComparar = modalTipo === 'Producto' 
        ? `${item.codigo || ''} ${item.nombre}`.toLowerCase()
        : `${item.cedula || item.documento || ''} ${item.nombre}`.toLowerCase();
    return textoComparar.includes(filtro.toLowerCase());
  });

  if (dataFiltrada.length === 0) {
    const colSpan = modalTipo === 'Producto' ? 4 : 2;
    tbody.innerHTML = `<tr><td colspan="${colSpan}" class="text-center" style="padding: 20px;">Sin resultados</td></tr>`;
    return;
  }

  // Usamos el index para saber si la fila es par o impar
  dataFiltrada.forEach((item, index) => {
    const tr = document.createElement('tr');
    tr.style.cursor = "pointer";
    
    // EFECTO CEBRA: Fila par = blanco, Fila impar = gris clarito
    const colorBase = index % 2 === 0 ? "#ffffff" : "#f1f3f5";
    tr.style.backgroundColor = colorBase;
    
    // Al pasar el ratón se pone gris oscuro, y al quitarlo vuelve a su color base (cebra)
    tr.onmouseenter = () => tr.style.backgroundColor = "#e2e6ea";
    tr.onmouseleave = () => tr.style.backgroundColor = colorBase;

    if (modalTipo === 'Producto') {
      const tieneIva = item.aplica_iva !== undefined ? (item.aplica_iva == 1 || item.aplica_iva == true) : true; 
      
      // Verificamos el stock. Puede venir como 'stock' o 'cantidad' desde tu BD
      const stock = item.stock || item.cantidad || 0; 
      // Le ponemos color verde si hay stock, o rojo si está en cero
      const colorStock = stock > 0 ? '#198754' : '#dc3545';

      tr.ondblclick = () => seleccionarProducto(item.id_producto, item.nombre.replace(/'/g, "\\'"), item.precio, tieneIva);

      tr.innerHTML = `
        <td style="font-size: 1.1rem; padding: 12px;">${item.codigo || item.id_producto}</td>
        <td style="font-size: 1.1rem; padding: 12px;">${item.nombre}</td>
        <td class="text-center" style="font-size: 1.1rem; padding: 12px; font-weight: bold; color: ${colorStock};">${stock}</td>
        <td class="text-right" style="font-size: 1.1rem; padding: 12px; font-weight: bold;">$${parseFloat(item.precio).toFixed(2)}</td>
      `;
    } else {
      tr.ondblclick = () => seleccionarCliente(item.id_cliente, item.nombre.replace(/'/g, "\\'"));

      tr.innerHTML = `
        <td style="font-size: 1.1rem; padding: 12px;">${item.cedula || item.documento || item.id_cliente}</td>
        <td style="font-size: 1.1rem; padding: 12px;">${item.nombre}</td>
      `;
    }
    tbody.appendChild(tr);
  });
}

function seleccionarCliente(id, nombre) {
  const inputCliente = document.getElementById('pos-buscar-cliente');
  inputCliente.value = nombre;
  inputCliente.dataset.id = id; 
  cerrarModalBusqueda();
  guardarCarritoEnStorage(); 
}

function seleccionarProducto(id, nombre, precio, aplicaIva) {
  const tbody = document.getElementById('pos-detalle-body');
  const tr = document.createElement('tr');
  
  tr.innerHTML = `
    <td data-nombre="${nombre}">
      ${nombre} 
      <input type="hidden" class="pos-prod-id" value="${id}">
    </td>
    <td class="text-center">
      <input type="number" class="pos-input-qty" value="1" min="1" onchange="actualizarSubtotalFilaPOS(this)" onkeyup="actualizarSubtotalFilaPOS(this)">
    </td>
    <td class="text-center pos-iva-txt" data-aplica="${aplicaIva}">
      <span style="font-size:0.85rem; color:#6c757d; font-weight:bold;">${aplicaIva ? 'SÍ (16%)' : 'NO (E)'}</span><br>
      <small class="monto-iva-fila" style="color:#dc3545; font-weight:bold;">$0.00</small>
    </td>
    <td class="text-right">
       $<input type="number" class="pos-input-precio" value="${precio}" step="0.01" style="width:70px; text-align:right; border:none; background:transparent; font-size:1rem;" onchange="actualizarSubtotalFilaPOS(this)" onkeyup="actualizarSubtotalFilaPOS(this)">
    </td>
    <td class="text-right pos-subtotal-txt">$0.00</td>
    <td class="text-center">
        <button class="btn-eliminar" style="padding:6px 10px; font-size:12px;" onclick="eliminarFilaPOS(this)">X</button>
    </td>
  `;
  
  tbody.appendChild(tr);
  cerrarModalBusqueda();
  document.getElementById('pos-buscar-producto').value = ""; 
  
  actualizarSubtotalFilaPOS(tr.querySelector('.pos-input-qty'));
}

function actualizarSubtotalFilaPOS(elemento) {
  const tr = elemento.closest('tr');
  const cant = parseFloat(tr.querySelector('.pos-input-qty').value) || 0;
  const precio = parseFloat(tr.querySelector('.pos-input-precio').value) || 0;
  const aplicaIva = tr.querySelector('.pos-iva-txt').dataset.aplica === 'true';
  
  const baseFila = cant * precio;
  const montoIvaFila = aplicaIva ? (baseFila * TASA_IVA) : 0;
  const totalFila = baseFila + montoIvaFila;
  
  tr.querySelector('.monto-iva-fila').textContent = `+$${montoIvaFila.toFixed(2)}`;
  tr.querySelector('.pos-subtotal-txt').textContent = `$${totalFila.toFixed(2)}`;
  
  recalcularTotalPOS();
  guardarCarritoEnStorage();
}

function eliminarFilaPOS(botonX) {
  botonX.closest('tr').remove();
  recalcularTotalPOS();
  guardarCarritoEnStorage(); 
}

function recalcularTotalPOS() {
  const filas = document.querySelectorAll('#pos-detalle-body tr');
  let baseTotal = 0;
  let ivaTotal = 0;
  let granTotal = 0;
  
  filas.forEach(tr => {
    const cant = parseFloat(tr.querySelector('.pos-input-qty').value) || 0;
    const precio = parseFloat(tr.querySelector('.pos-input-precio').value) || 0;
    const aplicaIva = tr.querySelector('.pos-iva-txt').dataset.aplica === 'true';
    
    const baseFila = cant * precio;
    const montoIva = aplicaIva ? (baseFila * TASA_IVA) : 0;
    
    baseTotal += baseFila;
    ivaTotal += montoIva;
    granTotal += (baseFila + montoIva);
  });
  
  document.querySelector('.btn-totalizar').innerHTML = `
    <div style="font-size:0.9rem; font-weight:normal; margin-bottom:5px; line-height:1.2; text-align:left; padding: 0 10px;">
        Subtotal: $${baseTotal.toFixed(2)} <br> 
        IVA (16%): $${ivaTotal.toFixed(2)}
    </div>
    <div style="border-top: 1px solid rgba(255,255,255,0.3); margin: 5px 0;"></div>
    TOTALIZAR <br> <strong style="font-size:1.4rem;">$${granTotal.toFixed(2)}</strong>
  `;

  const inputCliente = document.getElementById('pos-buscar-cliente');
  const btnBuscarCliente = inputCliente.nextElementSibling; 
  
  if (filas.length > 0) {
      inputCliente.disabled = true;
      btnBuscarCliente.disabled = true;
      btnBuscarCliente.style.opacity = '0.5';
      btnBuscarCliente.style.cursor = 'not-allowed';
  } else {
      inputCliente.disabled = false;
      btnBuscarCliente.disabled = false;
      btnBuscarCliente.style.opacity = '1';
      btnBuscarCliente.style.cursor = 'pointer';
  }
}

function cargarCarritoDeStorage() {
  const carritoGuardado = localStorage.getItem('pos_carrito');
  const clienteGuardado = localStorage.getItem('pos_cliente');

  if (clienteGuardado) {
    const cliente = JSON.parse(clienteGuardado);
    if (cliente.nombre) {
      const input = document.getElementById('pos-buscar-cliente');
      input.value = cliente.nombre;
      input.dataset.id = cliente.id;
    }
  }

  if (carritoGuardado) {
    const carrito = JSON.parse(carritoGuardado);
    const tbody = document.getElementById('pos-detalle-body');
    tbody.innerHTML = ''; 
    
    carrito.forEach(item => {
      const tr = document.createElement('tr');
      const aplicaIva = item.aplicaIva !== undefined ? item.aplicaIva : true;
      const montoIvaFila = aplicaIva ? (item.cantidad * item.precio * TASA_IVA) : 0;
      const totalFila = (item.cantidad * item.precio) + montoIvaFila;

      tr.innerHTML = `
        <td data-nombre="${item.nombre}">
          ${item.nombre} 
          <input type="hidden" class="pos-prod-id" value="${item.id}">
        </td>
        <td class="text-center">
          <input type="number" class="pos-input-qty" value="${item.cantidad}" min="1" onchange="actualizarSubtotalFilaPOS(this)" onkeyup="actualizarSubtotalFilaPOS(this)">
        </td>
        <td class="text-center pos-iva-txt" data-aplica="${aplicaIva}">
            <span style="font-size:0.85rem; color:#6c757d; font-weight:bold;">${aplicaIva ? 'SÍ (16%)' : 'NO (E)'}</span><br>
            <small class="monto-iva-fila" style="color:#dc3545; font-weight:bold;">+$${montoIvaFila.toFixed(2)}</small>
        </td>
        <td class="text-right">
           $<input type="number" class="pos-input-precio" value="${item.precio}" step="0.01" style="width:70px; text-align:right; border:none; background:transparent; font-size:1rem;" onchange="actualizarSubtotalFilaPOS(this)" onkeyup="actualizarSubtotalFilaPOS(this)">
        </td>
        <td class="text-right pos-subtotal-txt">$${totalFila.toFixed(2)}</td>
        <td class="text-center">
            <button class="btn-eliminar" style="padding:6px 10px; font-size:12px;" onclick="eliminarFilaPOS(this)">X</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
    recalcularTotalPOS();
  }
}

function limpiarCarritoPOS() {
  localStorage.removeItem('pos_carrito');
  localStorage.removeItem('pos_cliente');
  document.getElementById('pos-detalle-body').innerHTML = '';
  document.getElementById('pos-buscar-cliente').value = '';
  document.getElementById('pos-buscar-cliente').dataset.id = '';
  document.getElementById('pos-buscar-producto').value = '';
  recalcularTotalPOS();
}

function guardarFacturaEnEspera() {
    const filas = document.querySelectorAll('#pos-detalle-body tr');
    if (filas.length === 0) {
        mostrarAlertaPersonalizada("No hay productos en la factura para guardar.");
        return;
    }

    const motivo = prompt("Ingrese un nombre o motivo para identificar esta factura guardada:");
    if (!motivo) return; 

    const textoTotal = document.querySelector('.btn-totalizar strong').textContent.replace('$', '');
    const total = parseFloat(textoTotal) || 0;

    const clienteInput = document.getElementById('pos-buscar-cliente');
    const clienteNombre = clienteInput.value || "Consumidor Final";
    const clienteId = clienteInput.dataset.id || "";

    const carrito = [];
    filas.forEach(tr => {
        carrito.push({
            id: tr.querySelector('.pos-prod-id').value,
            nombre: tr.querySelector('td').dataset.nombre,
            cantidad: tr.querySelector('.pos-input-qty').value,
            precio: tr.querySelector('.pos-input-precio').value,
            aplicaIva: tr.querySelector('.pos-iva-txt').dataset.aplica === 'true'
        });
    });

    let guardadas = JSON.parse(localStorage.getItem('pos_facturas_guardadas')) || [];
    
    guardadas.push({
        id_guardado: Date.now(), 
        motivo: motivo,
        clienteNombre: clienteNombre,
        clienteId: clienteId,
        total: total,
        items: carrito
    });

    localStorage.setItem('pos_facturas_guardadas', JSON.stringify(guardadas));
    limpiarCarritoPOS(); 
    mostrarAlertaPersonalizada("Factura guardada correctamente.");
}

function abrirModalCargar() {
    const modal = document.getElementById('modal-cargar-facturas');
    const tbody = document.getElementById('lista-facturas-guardadas');
    tbody.innerHTML = '';

    let guardadas = JSON.parse(localStorage.getItem('pos_facturas_guardadas')) || [];

    if (guardadas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center">No hay facturas guardadas.</td></tr>';
    } else {
        guardadas.forEach(fact => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${fact.motivo}</strong></td>
                <td>${fact.clienteNombre}</td>
                <td class="text-right">$${parseFloat(fact.total).toFixed(2)}</td>
                <td class="text-center">
                    <button class="btn-primary" style="padding: 6px 10px; margin-right: 5px;" onclick="cargarFacturaGuardada(${fact.id_guardado})">Cargar</button>
                    <button class="btn-eliminar" style="padding: 6px 10px;" onclick="eliminarFacturaGuardada(${fact.id_guardado})">X</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    modal.classList.remove('hidden');
    modal.style.display = 'flex';
}

function cerrarModalCargar() {
    const modal = document.getElementById('modal-cargar-facturas');
    modal.classList.add('hidden');
    modal.style.display = 'none';
}

function cargarFacturaGuardada(idGuardado) {
    let guardadas = JSON.parse(localStorage.getItem('pos_facturas_guardadas')) || [];
    const factura = guardadas.find(f => f.id_guardado === idGuardado);

    if (!factura) return;

    const filasActuales = document.querySelectorAll('#pos-detalle-body tr').length;
    if (filasActuales > 0) {
        if (!confirm("Actualmente hay una factura en curso en la pantalla. ¿Desea reemplazarla?")) return;
    }

    const inputCliente = document.getElementById('pos-buscar-cliente');
    inputCliente.value = factura.clienteNombre !== "Consumidor Final" ? factura.clienteNombre : "";
    inputCliente.dataset.id = factura.clienteId;

    const tbody = document.getElementById('pos-detalle-body');
    tbody.innerHTML = ''; 

    factura.items.forEach(item => {
        const tr = document.createElement('tr');
        const montoIvaFila = item.aplicaIva ? (item.cantidad * item.precio * TASA_IVA) : 0;
        const totalFila = (item.cantidad * item.precio) + montoIvaFila;

        tr.innerHTML = `
            <td data-nombre="${item.nombre}">
                ${item.nombre} 
                <input type="hidden" class="pos-prod-id" value="${item.id}">
            </td>
            <td class="text-center">
                <input type="number" class="pos-input-qty" value="${item.cantidad}" min="1" onchange="actualizarSubtotalFilaPOS(this)" onkeyup="actualizarSubtotalFilaPOS(this)">
            </td>
            <td class="text-center pos-iva-txt" data-aplica="${item.aplicaIva}">
                <span style="font-size:0.85rem; color:#6c757d; font-weight:bold;">${item.aplicaIva ? 'SÍ (16%)' : 'NO (E)'}</span><br>
                <small class="monto-iva-fila" style="color:#dc3545; font-weight:bold;">+$${montoIvaFila.toFixed(2)}</small>
            </td>
            <td class="text-right">
                 $<input type="number" class="pos-input-precio" value="${item.precio}" step="0.01" style="width:70px; text-align:right; border:none; background:transparent; font-size:1rem;" onchange="actualizarSubtotalFilaPOS(this)" onkeyup="actualizarSubtotalFilaPOS(this)">
            </td>
            <td class="text-right pos-subtotal-txt">$${totalFila.toFixed(2)}</td>
            <td class="text-center">
                    <button class="btn-eliminar" style="padding:6px 10px; font-size:12px;" onclick="eliminarFilaPOS(this)">X</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    eliminarFacturaGuardada(idGuardado, false); 
    cerrarModalCargar();
    recalcularTotalPOS();
    guardarCarritoEnStorage(); 
}

function eliminarFacturaGuardada(idGuardado, recargarTabla = true) {
    let guardadas = JSON.parse(localStorage.getItem('pos_facturas_guardadas')) || [];
    guardadas = guardadas.filter(f => f.id_guardado !== idGuardado);
    localStorage.setItem('pos_facturas_guardadas', JSON.stringify(guardadas));
    
    if (recargarTabla) {
        abrirModalCargar(); 
    }
}

function abrirModalEliminar() {
    const filas = document.querySelectorAll('#pos-detalle-body tr');
    if (filas.length === 0) {
        mostrarAlertaPersonalizada("La factura ya está vacía.");
        return;
    }

    const modal = document.getElementById('modal-confirmar-eliminar');
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
}

function cerrarModalEliminar() {
    const modal = document.getElementById('modal-confirmar-eliminar');
    modal.classList.add('hidden');
    modal.style.display = 'none';
}

function confirmarEliminarFactura() {
    limpiarCarritoPOS();
    cerrarModalEliminar();
} 

function mostrarAlertaPersonalizada(mensaje) {
    document.getElementById('texto-alerta-pos').textContent = mensaje;
    const modal = document.getElementById('modal-alerta-pos');
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
}

function cerrarAlertaPersonalizada() {
    const modal = document.getElementById('modal-alerta-pos');
    modal.classList.add('hidden');
    modal.style.display = 'none';
}

/* ============================================================
   PROCESAR VENTA (GUARDAR EN BASE DE DATOS Y DESCONTAR STOCK)
============================================================ */
async function procesarVenta() {
    const filas = document.querySelectorAll('#pos-detalle-body tr');
    
    if (filas.length === 0) {
        mostrarAlertaPersonalizada("No hay productos en la factura para totalizar.");
        return;
    }

    // Extraer el total de la interfaz
    const textoTotal = document.querySelector('.btn-totalizar strong').textContent.replace('$', '');
    const total = parseFloat(textoTotal) || 0;

    // Obtener datos del cliente
    const clienteInput = document.getElementById('pos-buscar-cliente');
    const clienteId = clienteInput.dataset.id || null;

    // Armar el carrito
    const carrito = [];
    filas.forEach(tr => {
        carrito.push({
            id: tr.querySelector('.pos-prod-id').value,
            cantidad: tr.querySelector('.pos-input-qty').value,
            precio: tr.querySelector('.pos-input-precio').value
        });
    });

    // Deshabilitar el botón temporalmente para evitar dobles clics
    const btnTotalizar = document.querySelector('.btn-totalizar');
    btnTotalizar.disabled = true;
    btnTotalizar.style.opacity = '0.7';

    try {
        const respuesta = await fetch(API_FACT + "procesar_venta.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                cliente_id: clienteId,
                total: total,
                items: carrito
            })
        });

        const data = await respuesta.json();

        if (data.ok) {
            mostrarAlertaPersonalizada(`¡Venta procesada exitosamente! Factura: ${data.numero_factura}`);
            limpiarCarritoPOS(); // Limpiamos la pantalla para el siguiente cliente
            actualizarCorrelativo();
        } else {
            mostrarAlertaPersonalizada("Error: " + data.msg);
        }
    } catch (error) {
        mostrarAlertaPersonalizada("Error de conexión al procesar la venta.");
    } finally {
        // Volver a habilitar el botón
        btnTotalizar.disabled = false;
        btnTotalizar.style.opacity = '1';
    }
}

function guardarCarritoEnStorage() {
  const filas = document.querySelectorAll('#pos-detalle-body tr');
  const carrito = [];
  filas.forEach(tr => {
    carrito.push({
      id: tr.querySelector('.pos-prod-id').value,
      nombre: tr.querySelector('td').dataset.nombre,
      cantidad: tr.querySelector('.pos-input-qty').value,
      precio: tr.querySelector('.pos-input-precio').value,
      aplicaIva: tr.querySelector('.pos-iva-txt').dataset.aplica === 'true'
    });
  });
  
  const cliente = {
    id: document.getElementById('pos-buscar-cliente').dataset.id || "",
    nombre: document.getElementById('pos-buscar-cliente').value || ""
  };
  
  localStorage.setItem('pos_carrito', JSON.stringify(carrito));
  localStorage.setItem('pos_cliente', JSON.stringify(cliente));
}

async function actualizarCorrelativo() {
    try {
        const respuesta = await fetch(API_FACT + "obtener_correlativo.php");
        const data = await respuesta.json();
        if (data.ok) {
            const spanNumero = document.getElementById('pos-numero-factura');
            if(spanNumero) spanNumero.textContent = data.correlativo;
        }
    } catch (error) {
        console.error("No se pudo obtener el correlativo de la factura.");
    }
}