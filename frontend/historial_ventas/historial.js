document.addEventListener("DOMContentLoaded", () => {
    cargarHistorialVentas();
});

async function cargarHistorialVentas() {
    const tbody = document.getElementById('tabla-historial-body');
    
    try {
        // Llama al archivo PHP que creamos en el paso anterior
        const respuesta = await fetch("/berti2/backend/ventas/listar_historial.php");
        const json = await respuesta.json();

        if (json.ok) {
            tbody.innerHTML = '';
            
            if (json.data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 30px; color: #6c757d;">No hay ventas registradas aún.</td></tr>';
                return;
            }

            json.data.forEach((venta, index) => {
                const tr = document.createElement('tr');
                
                // Efecto cebra
                const colorBase = index % 2 === 0 ? "#ffffff" : "#f1f3f5";
                tr.style.backgroundColor = colorBase;
                tr.onmouseenter = () => tr.style.backgroundColor = "#e2e6ea";
                tr.onmouseleave = () => tr.style.backgroundColor = colorBase;

                // Formatear la fecha
                const fechaObj = new Date(venta.fecha);
                const fechaFormateada = fechaObj.toLocaleString('es-VE', { dateStyle: 'short', timeStyle: 'short' });

                tr.innerHTML = `
                    <td style="padding: 12px; font-weight: bold; color: #495057; border-bottom: 1px solid #dee2e6;">${venta.numero_factura}</td>
                    <td style="padding: 12px; border-bottom: 1px solid #dee2e6; color: #495057;">${fechaFormateada}</td>
                    <td style="padding: 12px; border-bottom: 1px solid #dee2e6; color: #495057;">${venta.cliente}</td>
                    <td style="padding: 12px; text-align: right; font-weight: bold; color: #198754; border-bottom: 1px solid #dee2e6;">$${parseFloat(venta.total).toFixed(2)}</td>
                    <td style="padding: 12px; text-align: center; border-bottom: 1px solid #dee2e6;">
                   <button class="btn-primary" style="padding: 6px 15px; font-size: 0.85rem; color: white; border: none; border-radius: 4px; cursor: pointer;" onclick="verDetalleFactura(${venta.id_venta})">Ver Detalle</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } else {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #dc3545; padding: 20px;">Error: ${json.msg}</td></tr>`;
        }
    } catch (error) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #dc3545; padding: 20px;">Error de conexión con el servidor.</td></tr>';
    }
}

function verDetalleFactura(idVenta) {
    // Aquí programaremos el modal para ver los productos de cada factura
    alert("Próximamente: Mostrando detalles de la factura ID " + idVenta);
}