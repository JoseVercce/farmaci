window.inicializarFiltroEstado = (contenedorId, callback, valorInicial = "1") => {
  const contenedor = document.getElementById(contenedorId);
  if (!contenedor) return;

  const botonFiltro = contenedor.querySelector("[data-filtro-toggle]");
  const menu = contenedor.querySelector("[data-filtro-menu]");
  const opciones = contenedor.querySelectorAll("[data-estado]");
  if (!botonFiltro || !menu) return;

  const nombres = { "1": "Activos", "0": "Inactivos", todos: "Todos" };
  const actualizar = (estado) => {
    opciones.forEach((boton) => {
      const seleccionado = boton.dataset.estado === estado;
      boton.classList.toggle("active", seleccionado);
      boton.setAttribute("aria-pressed", String(seleccionado));
    });
    botonFiltro.textContent = `Filtrar: ${nombres[estado] || nombres["1"]} ▾`;
    menu.classList.add("hidden");
    botonFiltro.setAttribute("aria-expanded", "false");
    callback(estado);
  };

  botonFiltro.addEventListener("click", () => {
    const abierto = botonFiltro.getAttribute("aria-expanded") === "true";
    menu.classList.toggle("hidden", abierto);
    botonFiltro.setAttribute("aria-expanded", String(!abierto));
  });

  opciones.forEach((opcion) => {
    opcion.addEventListener("click", () => actualizar(opcion.dataset.estado));
  });

  document.addEventListener("click", (event) => {
    if (!contenedor.contains(event.target)) {
      menu.classList.add("hidden");
      botonFiltro.setAttribute("aria-expanded", "false");
    }
  });

  contenedor.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      menu.classList.add("hidden");
      botonFiltro.setAttribute("aria-expanded", "false");
      botonFiltro.focus();
    }
  });

  actualizar(valorInicial);
};
