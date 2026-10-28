const API_FACT = "../../backend/ventas/";

document.addEventListener("DOMContentLoaded", () => {
    const cuerpoHistorial = document.getElementById("tabla-historial-body");
    const modal = document.getElementById("modal-detalle-venta");

    if (!cuerpoHistorial) return;

    cargarHistorial(cuerpoHistorial);

    if (modal) {
        modal.addEventListener("click", (event) => {
            if (event.target === modal) cerrarModalDetalle();
        });
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal && modal.style.display === "flex") {
            cerrarModalDetalle();
        }
    });

    window.cerrarModalDetalle = cerrarModalDetalle;
});

async function cargarHistorial(cuerpo) {
    mostrarMensaje(cuerpo, "Cargando historial...", "info");

    try {
        const respuesta = await fetch(`${API_FACT}listar_historial.php`, {
            credentials: "same-origin",
            headers: { Accept: "application/json" }
        });
        const resultado = await respuesta.json();

        if (!respuesta.ok || !resultado.ok) {
            throw new Error(resultado.msg || "No se pudo cargar el historial.");
        }

        const ventas = Array.isArray(resultado.data) ? resultado.data : [];
        cuerpo.replaceChildren();

        if (ventas.length === 0) {
            mostrarMensaje(cuerpo, "No hay ventas registradas.", "info");
            return;
        }

        ventas.forEach((venta) => {
            const fila = document.createElement("tr");
            agregarCelda(fila, venta.numero_factura || "—");
            agregarCelda(fila, formatearFecha(venta.fecha));
            agregarCelda(fila, venta.cliente || "Consumidor Final");
            agregarCelda(fila, formatearMonto(venta.total), "right");

            const celdaAcciones = document.createElement("td");
            celdaAcciones.style.cssText = "padding: 12px; text-align: center;";
            const botonDetalle = document.createElement("button");
            botonDetalle.type = "button";
            botonDetalle.textContent = "Ver detalle";
            botonDetalle.className = "btn-primary";
            botonDetalle.addEventListener("click", () => abrirDetalleVenta(venta.id_venta));
            celdaAcciones.appendChild(botonDetalle);
            fila.appendChild(celdaAcciones);
            cuerpo.appendChild(fila);
        });
    } catch (error) {
        console.error("Error al cargar el historial de ventas:", error);
        cuerpo.replaceChildren();
        mostrarMensaje(
            cuerpo,
            error.message || "Ocurrió un error al cargar el historial.",
            "error"
        );
    }
}

async function abrirDetalleVenta(idVenta) {
    const modal = document.getElementById("modal-detalle-venta");
    const cuerpo = document.getElementById("tabla-detalle-body");
    if (!modal || !cuerpo) return;

    modal.classList.remove("hidden");
    modal.style.display = "flex";
    cuerpo.replaceChildren();
    mostrarMensaje(cuerpo, "Cargando detalle...", "info", 6);

    try {
        const respuesta = await fetch(
            `${API_FACT}obtener_detalle.php?id=${encodeURIComponent(idVenta)}`,
            {
                credentials: "same-origin",
                headers: { Accept: "application/json" }
            }
        );
        const resultado = await respuesta.json();

        if (!respuesta.ok || !resultado.ok) {
            throw new Error(resultado.msg || "No se pudo cargar el detalle de la venta.");
        }

        const venta = resultado.encabezado || {};
        const nombreFarmacia = document.getElementById("farmacia-nombre")?.textContent.trim();
        const logoFarmacia = document.querySelector(".sidebar-logo");
        const logoFactura = document.getElementById("factura-emisor-logo");
        document.getElementById("factura-emisor-nombre").textContent =
            nombreFarmacia || "Farmacia";
        if (logoFarmacia?.getAttribute("src")) {
            logoFactura.src = logoFarmacia.src;
            logoFactura.hidden = false;
        } else {
            logoFactura.hidden = true;
        }
        document.getElementById("modal-factura-num").textContent =
            venta.numero_factura || "—";
        document.getElementById("modal-factura-fecha").textContent =
            formatearFecha(venta.fecha);
        document.getElementById("modal-cliente-nombre").textContent =
            venta.cliente_nombre || "Consumidor Final";
        document.getElementById("modal-cliente-cedula").textContent =
            venta.cliente_cedula || "N/A";
        document.getElementById("modal-cliente-telefono").textContent =
            venta.cliente_telefono || "N/A";
        document.getElementById("modal-venta-total").textContent =
            formatearMonto(venta.total);
        const pagos = Array.isArray(resultado.pagos) ? resultado.pagos : [];
        document.getElementById("modal-metodo-pago").textContent = pagos.length
            ? pagos.map((pago) => `${pago.metodo}: ${formatearMonto(pago.monto)}`).join(", ")
            : "No registrado";

        const detalles = Array.isArray(resultado.data) ? resultado.data : [];
        cuerpo.replaceChildren();

        if (detalles.length === 0) {
            mostrarMensaje(cuerpo, "Esta venta no tiene productos registrados.", "info", 6);
            return;
        }

        detalles.forEach((detalle) => {
            const cantidad = Number(detalle.cantidad) || 0;
            const precio = Number(detalle.precio_unitario) || 0;
            const aplicaIva = Number(detalle.aplica_iva) === 1;
            const tasaIva = (Number(detalle.alicuota_iva) || 0) / 100;
            const base = cantidad * precio;
            const iva = aplicaIva ? base * tasaIva : 0;
            const fila = document.createElement("tr");
            agregarCelda(fila, detalle.codigo || "—");
            agregarCelda(fila, detalle.nombre || "Producto no disponible");
            agregarCelda(fila, cantidad, "center");
            agregarCelda(fila, formatearMonto(precio), "right");
            agregarCelda(fila, formatearMonto(iva), "right");
            agregarCelda(fila, formatearMonto(base + iva), "right");
            cuerpo.appendChild(fila);
        });
    } catch (error) {
        console.error("Error al cargar el detalle de la venta:", error);
        cuerpo.replaceChildren();
        mostrarMensaje(
            cuerpo,
            error.message || "Ocurrió un error al cargar el detalle.",
            "error",
            6
        );
    }
}

function cerrarModalDetalle() {
    const modal = document.getElementById("modal-detalle-venta");
    if (!modal) return;
    modal.classList.add("hidden");
    modal.style.display = "none";
}

function agregarCelda(fila, valor, alineacion = "left") {
    const celda = document.createElement("td");
    celda.textContent = valor == null ? "" : String(valor);
    celda.style.cssText = `padding: 10px; text-align: ${alineacion};`;
    fila.appendChild(celda);
}

function mostrarMensaje(cuerpo, mensaje, tipo, columnas = 5) {
    const fila = document.createElement("tr");
    const celda = document.createElement("td");
    celda.colSpan = columnas;
    celda.textContent = mensaje;
    celda.style.cssText = "text-align: center; padding: 30px; color: #6c757d;";
    if (tipo === "error") celda.style.color = "#b02a37";
    fila.appendChild(celda);
    cuerpo.replaceChildren(fila);
}

function formatearFecha(fecha) {
    if (!fecha) return "—";
    const fechaLocal = new Date(String(fecha).replace(" ", "T"));
    return Number.isNaN(fechaLocal.getTime())
        ? String(fecha)
        : fechaLocal.toLocaleString("es-VE");
}

function formatearMonto(monto) {
    const valor = Number(monto);
    return Number.isFinite(valor)
        ? valor.toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : "0,00";
}
