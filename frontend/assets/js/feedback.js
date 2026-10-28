(() => {
  function crearModal(id, contenido) {
    const modal = document.createElement("div");
    modal.id = id;
    modal.className = "modal hidden";
    modal.innerHTML = contenido;
    document.body.appendChild(modal);
    return modal;
  }

  const modalMensaje = crearModal("modal-mensaje-global", `
    <div class="modal-content" role="dialog" aria-modal="true" style="max-width: 400px; text-align: center; padding: 30px;">
      <div id="mensaje-global-icono" style="font-size: 50px; margin-bottom: 15px;">✔️</div>
      <h3 id="mensaje-global-texto" style="font-size: 20px; margin-bottom: 20px; color: #374151;"></h3>
      <button type="button" id="mensaje-global-aceptar" class="btn-primary" style="width: 100%; padding: 12px;">Aceptar</button>
    </div>
  `);

  const modalConfirmacion = crearModal("modal-confirmacion-global", `
    <div class="modal-content" role="dialog" aria-modal="true" style="max-width: 420px; text-align: center; padding: 30px;">
      <div style="font-size: 55px; margin-bottom: 15px; color: #e11d48;">⚠️</div>
      <h3 id="confirmacion-global-texto" style="font-size: 20px; margin-bottom: 25px; color: #374151;"></h3>
      <div style="display: flex; gap: 12px; justify-content: center;">
        <button type="button" id="confirmacion-global-aceptar" class="btn-primary" style="padding: 10px 20px;">Sí, continuar</button>
        <button type="button" id="confirmacion-global-cancelar" class="btn-secondary" style="padding: 10px 20px;">Cancelar</button>
      </div>
    </div>
  `);

  function mostrar(modal) {
    modal.classList.remove("hidden");
    modal.style.display = "flex";
  }

  function ocultar(modal) {
    modal.classList.add("hidden");
    modal.style.display = "none";
  }

  window.mostrarMensajeBonito = (texto, icono = "✔️") => {
    document.getElementById("mensaje-global-icono").textContent = icono;
    document.getElementById("mensaje-global-texto").textContent = texto;
    document.getElementById("mensaje-global-aceptar").onclick = () => ocultar(modalMensaje);
    mostrar(modalMensaje);
  };

  window.confirmarAccion = (texto, callbackAceptar, textoAceptar = "Sí, continuar") => {
    document.getElementById("confirmacion-global-texto").textContent = texto;
    const botonAceptar = document.getElementById("confirmacion-global-aceptar");
    botonAceptar.textContent = textoAceptar;
    botonAceptar.onclick = () => {
      ocultar(modalConfirmacion);
      callbackAceptar();
    };
    document.getElementById("confirmacion-global-cancelar").onclick =
      () => ocultar(modalConfirmacion);
    mostrar(modalConfirmacion);
  };
})();
