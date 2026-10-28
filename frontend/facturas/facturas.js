const API_FACT = "../../backend/ventas/";
const API_CLI = "../../backend/clientes/";
const API_PROD = "../../backend/productos/";
const API_METODO_PAGO = "../../backend/metodo_pago/";
const TASA_IVA = 0.16; // 16% de IVA
const STORAGE_FACTURA_EN_CURSO = "pos_factura_en_curso";
const STORAGE_METODO_PAGO = "pos_metodo_pago";

let modalData = []; 
let modalTipo = ''; 
let porcentajeDescuentoGlobal = 0; // NUEVO: Memoria del descuento global
let metodosPagoCargados = false;

document.addEventListener("DOMContentLoaded", () => {
    // 1. Cargar datos iniciales
    actualizarCorrelativo();
    cargarCarritoDeStorage();
    cargarMetodosPago();
    document.getElementById('pos-metodo-pago').addEventListener('change', guardarCarritoEnStorage);

    // 2. Conectar botones del panel lateral
    document.querySelector('.btn-guardar').addEventListener('click', guardarFacturaEnEspera);
    document.querySelector('.btn-cargar').addEventListener('click', abrirModalCargar);
    document.querySelector('.pos-actions .btn-eliminarse').addEventListener('click', abrirModalEliminar);
    document.querySelector('.btn-descuento').addEventListener('click', window.abrirModalDescuento); // NUEVO: Conecta el botón amarillo

    // 3. Conectar botón Totalizar
    document.querySelector('.btn-totalizar').addEventListener('click', abrirModalMetodoPago);

    // 4. Configurar tecla Enter para los buscadores
    document.getElementById('pos-buscar-producto').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            abrirModalBusqueda('Producto');
        }
    });

    // ESTE DEBE SER EL ÚNICO EVENTO DE "ENTER" PARA EL CLIENTE
    document.getElementById('pos-buscar-cliente').addEventListener('keypress', async function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const valorIngresado = this.value.trim();

            if (valorIngresado === '') {
                abrirModalBusqueda('Cliente');
                return;
            }

            try {
                const res = await fetch(API_CLI + "listar_todo.php");
                const json = await res.json();
                const clientes = json.data || [];

                const clienteEncontrado = clientes.find(c => 
                    (c.cedula && c.cedula.toLowerCase() === valorIngresado.toLowerCase()) || 
                    (c.documento && c.documento.toLowerCase() === valorIngresado.toLowerCase())
                );

                if (clienteEncontrado) {
                    // Seleccionamos al cliente y NO abrimos el modal
                    this.value = clienteEncontrado.nombre;
                    this.dataset.id = clienteEncontrado.id;
                    guardarCarritoEnStorage();
                    
                    // Saltamos al buscador de productos
                    document.getElementById('pos-buscar-producto').focus();
                } else {
                    // Solo abrimos el modal si la cédula no existe
                    abrirModalBusqueda('Cliente');
                }
            } catch (error) {
                abrirModalBusqueda('Cliente');
            }
        }
    });

    // 5. Filtro en tiempo real del modal
    document.getElementById('input-filtro-modal').addEventListener('input', (e) => {
        renderizarTablaModal(e.target.value);
    });
});

function cerrarModalBusqueda() {
  const modal = document.getElementById('modal-busqueda-pos');
  modal.classList.add('hidden');
  modal.style.display = 'none';
}

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
  const thead = document.getElementById('modal-busqueda-head'); 
  const tbody = document.getElementById('modal-busqueda-body');
  const inputFiltro = document.getElementById('input-filtro-modal');
  
  modalTipo = tipo;
  
  if (tipo === 'Cliente') {
      titulo.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; padding-bottom: 5px;">
            <span style="font-size: 1.4rem; font-weight: bold; color: #343a40;">Buscar Cliente</span>
            <button type="button" style="background-color: #198754; color: white; border: none; padding: 8px 18px; font-size: 1rem; font-weight: bold; border-radius: 5px; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.2);" onclick="window.irACrearCliente()">
                + Crear Nuevo Cliente
            </button>
        </div>
      `;
  } else {
      titulo.innerHTML = `<span style="font-size: 1.4rem; font-weight: bold; color: #343a40;">Buscar Producto</span>`;
  }
  
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

async function cargarClientesModal() {
  modalData = []; // 1. Vaciamos la memoria vieja obligatoriamente
  try {
    const res = await fetch(API_CLI + "listar_todo.php"); 
    const json = await res.json();
    modalData = json.data || [];
  } catch (error) {
    console.error(error);
    alert("Error de conexión al cargar los clientes.");
  }
}

async function cargarProductosModal() {
  modalData = []; // 1. Vaciamos la memoria vieja obligatoriamente
  try {
    const res = await fetch(API_PROD + "listar_todo.php", { cache: "no-store" });
    const json = await res.json();
    if (!res.ok || !json.ok) {
      throw new Error(json.msg || "No se pudieron cargar los productos.");
    }
    modalData = json.data || [];
  } catch (error) {
    console.error(error);
    alert(error.message || "Error de conexión al cargar los productos.");
  }
}
function renderizarTablaModal(filtro = "") {
  const tbody = document.getElementById('modal-busqueda-body');
  tbody.innerHTML = '';
  
  const dataFiltrada = modalData.filter(item => {
    const textoComparar = modalTipo === 'Producto' 
        ? `${item.codigo || item.id || ''} ${item.nombre}`.toLowerCase()
        : `${item.cedula || item.documento || item.id || ''} ${item.nombre}`.toLowerCase();
    return textoComparar.includes(filtro.toLowerCase());
  });

  if (dataFiltrada.length === 0) {
    const colSpan = modalTipo === 'Producto' ? 4 : 2;
    
    if (modalTipo === 'Cliente') {
        tbody.innerHTML = `
            <tr>
                <td colspan="${colSpan}" class="text-center" style="padding: 40px;">
                    <span style="color: #dc3545; font-size: 1.2rem; font-weight: bold;">Cliente no encontrado</span><br>
                    <span style="color: #6c757d; font-size: 1rem; display: block; margin-top: 10px;">La cédula escaneada o el nombre no coincide con ningún registro.</span><br>
                    <button class="btn-primary" style="margin-top: 15px; padding: 10px 25px; font-size: 1.1rem; font-weight: bold; border: none; border-radius: 6px; cursor: pointer; color: white;" onclick="window.irACrearCliente()">
                        Crear Nuevo Cliente
                    </button>
                </td>
            </tr>
        `;
    } else {
        tbody.innerHTML = `<tr><td colspan="${colSpan}" class="text-center" style="padding: 20px;">Sin resultados</td></tr>`;
    }
    return;
  }

  dataFiltrada.forEach((item, index) => {
    const tr = document.createElement('tr');
    tr.style.cursor = "pointer";
    
    const colorBase = index % 2 === 0 ? "#ffffff" : "#f1f3f5";
    tr.style.backgroundColor = colorBase;
    
    tr.onmouseenter = () => tr.style.backgroundColor = "#e2e6ea";
    tr.onmouseleave = () => tr.style.backgroundColor = colorBase;

    if (modalTipo === 'Producto') {
      const tieneIva = item.aplica_iva !== undefined ? (item.aplica_iva == 1 || item.aplica_iva == true) : true; 
      const stock = item.stock || item.cantidad || 0; 
      const colorStock = stock > 0 ? '#198754' : '#dc3545';

      tr.ondblclick = () => seleccionarProducto(item.id, item.nombre.replace(/'/g, "\\'"), item.precio, tieneIva);

      tr.innerHTML = `
        <td style="font-size: 1.1rem; padding: 12px;">${item.codigo || item.id}</td>
        <td style="font-size: 1.1rem; padding: 12px;">${item.nombre}</td>
        <td class="text-center" style="font-size: 1.1rem; padding: 12px; font-weight: bold; color: ${colorStock};">${stock}</td>
        <td class="text-right" style="font-size: 1.1rem; padding: 12px; font-weight: bold;">$${parseFloat(item.precio).toFixed(2)}</td>
      `;
    } else {
      tr.ondblclick = () => seleccionarCliente(item.id, item.nombre.replace(/'/g, "\\'"));

      tr.innerHTML = `
        <td style="font-size: 1.1rem; padding: 12px;">${item.cedula || item.documento || item.id}</td>
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
  const aplicaIvaProducto = aplicaIva !== false;
  
  tr.innerHTML = `
    <td data-nombre="${nombre}">
      ${nombre} 
      <input type="hidden" class="pos-prod-id" value="${id}">
    </td>
    <td class="text-center">
      <input type="number" class="pos-input-qty" value="1" min="1" onchange="actualizarSubtotalFilaPOS(this)" onkeyup="actualizarSubtotalFilaPOS(this)">
    </td>
    ${crearCeldaIva(aplicaIvaProducto)}
    <td class="text-right">
       $<input type="number" class="pos-input-precio" value="${precio}" step="0.01" style="width:70px; text-align:right; border:none; background:transparent; font-size:1rem;" onchange="actualizarSubtotalFilaPOS(this)" onkeyup="actualizarSubtotalFilaPOS(this)">
    </td>
    <td class="text-right pos-subtotal-txt">$0.00</td>
    <td class="text-center">
        <button class="btn-eliminarse" style="padding:6px 10px; font-size:12px;" onclick="eliminarFilaPOS(this)">X</button>
    </td>
  `;
  
  tbody.appendChild(tr);
  cerrarModalBusqueda();
  document.getElementById('pos-buscar-producto').value = ""; 
  
  actualizarSubtotalFilaPOS(tr.querySelector('.pos-input-qty'));
}

function crearCeldaIva(aplicaIva) {
  const checked = aplicaIva ? 'checked' : '';
  return `
    <td class="text-center pos-iva-txt" data-aplica="${aplicaIva}">
      <label style="display:inline-flex;align-items:center;gap:5px;cursor:pointer;">
        <input type="checkbox" class="pos-iva-checkbox" ${checked}
          onchange="actualizarIvaFilaPOS(this)"
          aria-label="Aplicar IVA de ${TASA_IVA * 100}% a este producto">
        Aplicar IVA (${TASA_IVA * 100}%)
      </label><br>
      <small class="monto-iva-fila" style="color:#dc3545;font-weight:bold;">$0.00</small>
    </td>
  `;
}

function actualizarIvaFilaPOS(checkbox) {
  const celdaIva = checkbox.closest('.pos-iva-txt');
  celdaIva.dataset.aplica = String(checkbox.checked);
  actualizarSubtotalFilaPOS(checkbox);
}

function actualizarSubtotalFilaPOS(elemento) {
  const tr = elemento.closest('tr');
  const cant = parseFloat(tr.querySelector('.pos-input-qty').value) || 0;
  const precio = parseFloat(tr.querySelector('.pos-input-precio').value) || 0;
  const aplicaIva = tr.querySelector('.pos-iva-txt').dataset.aplica === 'true';
  
  const baseFila = cant * precio;
  const montoIvaFila = aplicaIva ? redondearMoneda(baseFila * TASA_IVA) : 0;
  const totalFila = redondearMoneda(baseFila + montoIvaFila);
  
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
  let descuentoTotalMonto = 0;
  
  filas.forEach(tr => {
    const cant = parseFloat(tr.querySelector('.pos-input-qty').value) || 0;
    const precio = parseFloat(tr.querySelector('.pos-input-precio').value) || 0;
    const aplicaIva = tr.querySelector('.pos-iva-txt').dataset.aplica === 'true';
    
    // Matemática fiscal: aplicar descuento a la base ANTES del IVA
    const baseOriginalFila = cant * precio;
    const montoDescuentoFila = redondearMoneda(baseOriginalFila * (porcentajeDescuentoGlobal / 100));
    const baseConDescuento = redondearMoneda(baseOriginalFila - montoDescuentoFila);
    
    const montoIva = aplicaIva ? redondearMoneda(baseConDescuento * TASA_IVA) : 0;
    
    baseTotal += baseConDescuento; 
    ivaTotal += montoIva;
    descuentoTotalMonto += montoDescuentoFila;
    granTotal += (baseConDescuento + montoIva);
  });
  
  let textoDescuento = '';
  if (porcentajeDescuentoGlobal > 0) {
      textoDescuento = `<div style="color: #ffc107; font-weight: bold;">Descuento (${porcentajeDescuentoGlobal}%): -$${descuentoTotalMonto.toFixed(2)}</div>`;
  }

  document.querySelector('.btn-totalizar').innerHTML = `
    <div style="font-size:0.9rem; font-weight:normal; margin-bottom:5px; line-height:1.2; text-align:left; padding: 0 10px;">
        Subtotal: $${(baseTotal + descuentoTotalMonto).toFixed(2)} <br> 
        ${textoDescuento}
        IVA (${TASA_IVA * 100}%): $${ivaTotal.toFixed(2)}
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

// NUEVAS FUNCIONES PARA EL MODAL DE DESCUENTO
window.abrirModalDescuento = function() {
    const modal = document.getElementById('modal-descuento');
    document.getElementById('input-desc-global').value = porcentajeDescuentoGlobal;
    modal.style.display = 'flex';
    setTimeout(() => {
        const input = document.getElementById('input-desc-global');
        input.focus();
        input.select();
    }, 100);
};

window.cerrarModalDescuento = function() {
    document.getElementById('modal-descuento').style.display = 'none';
};

window.confirmarDescuento = function() {
    const desc = parseFloat(document.getElementById('input-desc-global').value) || 0;
    if (desc < 0 || desc > 100) {
        mostrarAlertaPersonalizada("El descuento debe ser un número entre 0 y 100.");
        return;
    }
    porcentajeDescuentoGlobal = desc;
    window.cerrarModalDescuento();
    recalcularTotalPOS();
};

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
      const aplicaIva = item.aplicaIva !== undefined
        ? item.aplicaIva
        : item.aplica_iva !== undefined
          ? Boolean(Number(item.aplica_iva))
          : true;
      const montoIvaFila = aplicaIva ? redondearMoneda(item.cantidad * item.precio * TASA_IVA) : 0;
      const totalFila = redondearMoneda((item.cantidad * item.precio) + montoIvaFila);

      tr.innerHTML = `
        <td data-nombre="${item.nombre}">
          ${item.nombre} 
          <input type="hidden" class="pos-prod-id" value="${item.id}">
        </td>
        <td class="text-center">
          <input type="number" class="pos-input-qty" value="${item.cantidad}" min="1" onchange="actualizarSubtotalFilaPOS(this)" onkeyup="actualizarSubtotalFilaPOS(this)">
        </td>
        ${crearCeldaIva(aplicaIva)}
        <td class="text-right">
           $<input type="number" class="pos-input-precio" value="${item.precio}" step="0.01" style="width:70px; text-align:right; border:none; background:transparent; font-size:1rem;" onchange="actualizarSubtotalFilaPOS(this)" onkeyup="actualizarSubtotalFilaPOS(this)">
        </td>
        <td class="text-right pos-subtotal-txt">$${totalFila.toFixed(2)}</td>
        <td class="text-center">
            <button class="btn-eliminarse" style="padding:6px 10px; font-size:12px;" onclick="eliminarFilaPOS(this)">X</button>
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
  localStorage.removeItem(STORAGE_FACTURA_EN_CURSO);
  localStorage.removeItem(STORAGE_METODO_PAGO);
  document.getElementById('pos-detalle-body').innerHTML = '';
  document.getElementById('pos-buscar-cliente').value = '';
  document.getElementById('pos-buscar-cliente').dataset.id = '';
  document.getElementById('pos-buscar-producto').value = '';
  document.getElementById('pos-metodo-pago').value = '';
  porcentajeDescuentoGlobal = 0; // NUEVO: resetear descuento
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
            aplicaIva: tr.querySelector('.pos-iva-checkbox').checked
        });
    });

    let guardadas = JSON.parse(localStorage.getItem('pos_facturas_guardadas')) || [];
    const facturaEnCurso = localStorage.getItem(STORAGE_FACTURA_EN_CURSO);
    if (facturaEnCurso) {
        guardadas = guardadas.filter(factura =>
            String(factura.id_guardado) !== facturaEnCurso
        );
    }
    
    guardadas.push({
        id_guardado: Date.now(), 
        motivo: motivo,
        clienteNombre: clienteNombre,
        clienteId: clienteId,
        total: total,
        items: carrito,
        descuento: porcentajeDescuentoGlobal, // Guardamos el descuento
        metodoPagoId: document.getElementById('pos-metodo-pago').value
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
                    <button class="btn-eliminarse" style="padding: 6px 10px;" onclick="eliminarFacturaGuardada(${fact.id_guardado})">X</button>
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
    inputCliente.dataset.id = factura.clienteId || "";
    document.getElementById('pos-metodo-pago').value = factura.metodoPagoId || "";
    localStorage.setItem(STORAGE_METODO_PAGO, factura.metodoPagoId || "");
    
    // Restauramos el descuento guardado
    porcentajeDescuentoGlobal = factura.descuento || 0;

    const tbody = document.getElementById('pos-detalle-body');
    tbody.innerHTML = ''; 

    factura.items.forEach(item => {
        const tr = document.createElement('tr');
        const aplicaIva = item.aplicaIva !== undefined
            ? item.aplicaIva
            : item.aplica_iva !== undefined
                ? Boolean(Number(item.aplica_iva))
                : true;
        const montoIvaFila = aplicaIva ? redondearMoneda(item.cantidad * item.precio * TASA_IVA) : 0;
        const totalFila = redondearMoneda((item.cantidad * item.precio) + montoIvaFila);

        tr.innerHTML = `
            <td data-nombre="${item.nombre}">
                ${item.nombre} 
                <input type="hidden" class="pos-prod-id" value="${item.id}">
            </td>
            <td class="text-center">
                <input type="number" class="pos-input-qty" value="${item.cantidad}" min="1" onchange="actualizarSubtotalFilaPOS(this)" onkeyup="actualizarSubtotalFilaPOS(this)">
            </td>
            ${crearCeldaIva(aplicaIva)}
            <td class="text-right">
                 $<input type="number" class="pos-input-precio" value="${item.precio}" step="0.01" style="width:70px; text-align:right; border:none; background:transparent; font-size:1rem;" onchange="actualizarSubtotalFilaPOS(this)" onkeyup="actualizarSubtotalFilaPOS(this)">
            </td>
            <td class="text-right pos-subtotal-txt">$${totalFila.toFixed(2)}</td>
            <td class="text-center">
                    <button class="btn-eliminarse" style="padding:6px 10px; font-size:12px;" onclick="eliminarFilaPOS(this)">X</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    localStorage.setItem(STORAGE_FACTURA_EN_CURSO, String(idGuardado));
    cerrarModalCargar();
    recalcularTotalPOS();
    guardarCarritoEnStorage();
    mostrarAlertaPersonalizada("Factura cargada. Pulsa TOTALIZAR FACTURA para registrarla en el historial.");
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
    const clienteInput = document.getElementById('pos-buscar-cliente').value.trim();

    if (filas.length === 0 && clienteInput === '') {
        mostrarAlertaPersonalizada("La factura ya está completamente vacía.");
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

    const textoTotal = document.querySelector('.btn-totalizar strong').textContent.replace('$', '');
    const total = parseFloat(textoTotal) || 0;

    const clienteInput = document.getElementById('pos-buscar-cliente');
    const clienteId = clienteInput.dataset.id || null;
    const metodoPagoId = document.getElementById('pos-metodo-pago').value;
    if (!metodoPagoId) {
        mostrarAlertaPersonalizada("Selecciona el método de pago antes de totalizar la factura.");
        return;
    }

    const carrito = [];
    filas.forEach(tr => {
        carrito.push({
            id: tr.querySelector('.pos-prod-id').value,
            cantidad: tr.querySelector('.pos-input-qty').value,
            precio: tr.querySelector('.pos-input-precio').value,
            aplica_iva: tr.querySelector('.pos-iva-checkbox').checked
        });
    });

    const btnTotalizar = document.querySelector('.btn-totalizar');
    const btnConfirmarVenta = document.getElementById('btn-confirmar-venta');
    btnTotalizar.disabled = true;
    btnTotalizar.style.opacity = '0.7';
    btnConfirmarVenta.disabled = true;
    btnConfirmarVenta.textContent = 'Procesando...';

    try {
        const respuesta = await fetch(API_FACT + "procesar_venta.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                cliente_id: clienteId,
                metodo_pago_id: metodoPagoId,
                total: total,
                descuento: porcentajeDescuentoGlobal, // Enviamos el descuento al servidor
                items: carrito
            })
        });

        const data = await respuesta.json();

        if (data.ok) {
            cerrarModalMetodoPago();
            mostrarAlertaPersonalizada(`¡Venta procesada exitosamente! Factura: ${data.numero_factura}`);
            eliminarFacturaEnEsperaProcesada();
            limpiarCarritoPOS(); 
            actualizarCorrelativo();
        } else {
            mostrarAlertaPersonalizada("Error: " + (data.msg || "No se pudo procesar la venta."));
        }
    } catch (error) {
        console.error("Error al procesar la venta:", error);
        mostrarAlertaPersonalizada("No se recibió confirmación del servidor. La factura permanece guardada; verifica el historial antes de reintentar para evitar duplicados.");
    } finally {
        btnTotalizar.disabled = false;
        btnTotalizar.style.opacity = '1';
        btnConfirmarVenta.disabled = false;
        btnConfirmarVenta.textContent = 'Confirmar y registrar';
    }
}

function abrirModalMetodoPago() {
    const filas = document.querySelectorAll('#pos-detalle-body tr');
    if (filas.length === 0) {
        mostrarAlertaPersonalizada("No hay productos en la factura para totalizar.");
        return;
    }

    const total = document.querySelector('.btn-totalizar strong').textContent;
    document.getElementById('modal-total-pago').textContent = total;
    const modal = document.getElementById('modal-metodo-pago');
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
    document.getElementById('pos-metodo-pago').focus();
}

function cerrarModalMetodoPago() {
    const modal = document.getElementById('modal-metodo-pago');
    modal.classList.add('hidden');
    modal.style.display = 'none';
}

function confirmarMetodoPago() {
    const metodoPago = document.getElementById('pos-metodo-pago');
    if (!metodoPago.value) {
        mostrarAlertaPersonalizada("Selecciona el método de pago para continuar.");
        return;
    }
    guardarCarritoEnStorage();
    procesarVenta();
}

function eliminarFacturaEnEsperaProcesada() {
    const idGuardado = localStorage.getItem(STORAGE_FACTURA_EN_CURSO);
    if (!idGuardado) return;

    const guardadas = JSON.parse(localStorage.getItem('pos_facturas_guardadas')) || [];
    const pendientes = guardadas.filter(factura =>
        String(factura.id_guardado) !== idGuardado
    );
    localStorage.setItem('pos_facturas_guardadas', JSON.stringify(pendientes));
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
      aplicaIva: tr.querySelector('.pos-iva-checkbox').checked
    });
  });
  
  const cliente = {
    id: document.getElementById('pos-buscar-cliente').dataset.id || "",
    nombre: document.getElementById('pos-buscar-cliente').value || ""
  };
  
  localStorage.setItem('pos_carrito', JSON.stringify(carrito));
  localStorage.setItem('pos_cliente', JSON.stringify(cliente));
  const metodoPago = document.getElementById('pos-metodo-pago');
  if (metodoPago && metodosPagoCargados) {
    localStorage.setItem(STORAGE_METODO_PAGO, metodoPago.value);
  }
}

async function cargarMetodosPago() {
  const select = document.getElementById('pos-metodo-pago');
  try {
    const respuesta = await fetch(API_METODO_PAGO + "listar.php", {
      credentials: "same-origin",
      headers: { Accept: "application/json" }
    });
    const resultado = await respuesta.json();
    if (!respuesta.ok || resultado.status !== "success" || !Array.isArray(resultado.data)) {
      throw new Error(resultado.msg || "No se pudieron cargar los métodos de pago.");
    }

    window.cerrarModalMetodoPago = cerrarModalMetodoPago;
    window.confirmarMetodoPago = confirmarMetodoPago;

    select.replaceChildren(new Option("Seleccione un método de pago", ""));
    resultado.data.forEach((metodo) => {
      select.add(new Option(metodo.nombre, metodo.id));
    });

    const metodoGuardado = localStorage.getItem(STORAGE_METODO_PAGO);
    if (metodoGuardado && Array.from(select.options).some(opcion => opcion.value === metodoGuardado)) {
      select.value = metodoGuardado;
    }
    metodosPagoCargados = true;
    guardarCarritoEnStorage();
  } catch (error) {
    console.error("Error al cargar los métodos de pago:", error);
    select.replaceChildren(new Option("No se pudieron cargar los métodos", ""));
    mostrarAlertaPersonalizada(error.message || "Error al cargar los métodos de pago.");
  }
}

function redondearMoneda(valor) {
  return Math.round((valor + Number.EPSILON) * 100) / 100;
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

/* ============================================================
   FUNCIONES PARA EL MODAL DE CREAR CLIENTE (CORREGIDAS)
============================================================ */

window.irACrearCliente = function() {
    const inputFiltro = document.getElementById('input-filtro-modal');
    const textoEscaneado = inputFiltro ? inputFiltro.value.trim() : '';
    
    // 1. Cerramos la ventana de búsqueda para que no quede en el fondo
    const modalBusqueda = document.getElementById('modal-busqueda-pos');
    if (modalBusqueda) {
        modalBusqueda.classList.add('hidden');
        modalBusqueda.style.display = 'none';
    }

    // 2. Abrimos la nueva ventana grande
    const modalNuevo = document.getElementById('modal-nuevo-cliente');
    if (modalNuevo) {
        modalNuevo.style.display = 'flex';
        document.getElementById('form-nuevo-cliente').reset();
    } else {
        alert("Falta pegar el código HTML del modal nuevo en tu index.html");
        return;
    }

    // 3. Autocompletado inteligente
    if (textoEscaneado) {
        if (!isNaN(textoEscaneado) || textoEscaneado.includes('-')) {
            document.getElementById('nc-cedula').value = textoEscaneado;
            setTimeout(() => document.getElementById('nc-nombre').focus(), 100);
        } else {
            document.getElementById('nc-nombre').value = textoEscaneado;
            setTimeout(() => document.getElementById('nc-cedula').focus(), 100);
        }
    }
};

window.cerrarModalNuevoCliente = function() {
    const modalNuevo = document.getElementById('modal-nuevo-cliente');
    if(modalNuevo) modalNuevo.style.display = 'none';
};

window.guardarNuevoClientePOS = async function(e) {
    e.preventDefault(); 
    const btn = document.getElementById('btn-guardar-nc');
    btn.textContent = 'Guardando...';
    btn.disabled = true;

    const datos = {
        cedula: document.getElementById('nc-cedula').value,
        nombre: document.getElementById('nc-nombre').value,
        telefono: document.getElementById('nc-telefono').value,
        direccion: document.getElementById('nc-direccion').value
    };

    try {
        const res = await fetch('../../backend/clientes/guardar_pos.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(datos)
        });
        const json = await res.json();

        if(json.ok) {
            window.cerrarModalNuevoCliente();
            
            // Recargamos la lista de clientes
            await cargarClientesModal();
            
            // Reabrimos el buscador con el nuevo cliente escrito para seleccionarlo
            const modalBusqueda = document.getElementById('modal-busqueda-pos');
            modalBusqueda.classList.remove('hidden');
            modalBusqueda.style.display = 'flex';
            
            const inputFiltro = document.getElementById('input-filtro-modal');
            inputFiltro.value = datos.cedula; 
            renderizarTablaModal(datos.cedula);
            
            if(typeof mostrarAlertaPersonalizada === "function") {
                mostrarAlertaPersonalizada("Cliente registrado con éxito. Haz doble clic para seleccionarlo.");
            }
        } else {
            alert("Error: " + json.msg);
        }
    } catch(error) {
        alert("Error de conexión al guardar el cliente.");
    }
    
    btn.textContent = 'Guardar y Seleccionar';
    btn.disabled = false;
};