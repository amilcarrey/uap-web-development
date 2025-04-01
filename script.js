document.addEventListener("DOMContentLoaded", () => {
    const formTarea = document.getElementById("form-tarea");
    const inputTarea = document.getElementById("input-tarea");
    const listaTareas = document.getElementById("lista-tareas");
    const btnEliminarCompletadas = document.getElementById("eliminar-completadas");
    const btnMostrarCompletadas = document.getElementById("mostrar-completadas");
    const btnMostrarIncompletas = document.getElementById("mostrar-incompletas");

    let filtroActivo = null;

    // Obtener tareas de localStorage
    const obtenerTareas = () => JSON.parse(localStorage.getItem("tareas")) || [];

    // Guardar tareas en localStorage
    const guardarTareas = (tareas) => localStorage.setItem("tareas", JSON.stringify(tareas));

    // Crear y retornar el elemento HTML de una tarea
    const crearElementoTarea = ({ id, texto, completada }) => {
        const tarea = document.createElement("li");
        tarea.classList.add("tarea-item");
        tarea.dataset.id = id;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("tarea-checkbox");
        checkbox.checked = completada;
        checkbox.addEventListener("change", () => actualizarEstadoTarea(id, checkbox.checked));

        const span = document.createElement("span");
        span.classList.add("tarea-texto");
        span.textContent = texto;

        const btnEliminar = document.createElement("button");
        btnEliminar.classList.add("btn-eliminar");
        btnEliminar.textContent = "X";
        btnEliminar.setAttribute("aria-label", "Eliminar tarea");
        btnEliminar.addEventListener("click", () => eliminarTarea(id));

        tarea.append(checkbox, span, btnEliminar);
        return tarea;
    };

    // Agregar una tarea al DOM y guardarla en localStorage
    const agregarTarea = (texto, completada = false, id = Date.now()) => {
        if (!texto.trim()) return alert("Por favor, ingresa una tarea.");

        const nuevaTarea = { id, texto, completada };
        listaTareas.appendChild(crearElementoTarea(nuevaTarea));

        const tareas = obtenerTareas();
        tareas.push(nuevaTarea);
        guardarTareas(tareas);

        inputTarea.value = "";
    };

    // Eliminar una tarea
    const eliminarTarea = (id) => {
        const tareas = obtenerTareas().filter(tarea => tarea.id !== id);
        guardarTareas(tareas);
        document.querySelector(`[data-id='${id}']`).remove();
    };

    // Actualizar el estado de una tarea
    const actualizarEstadoTarea = (id, completada) => {
        const tareas = obtenerTareas().map(tarea => 
            tarea.id === id ? { ...tarea, completada } : tarea
        );
        guardarTareas(tareas);

        if (filtroActivo !== null) aplicarFiltro(filtroActivo);
    };

    // Cargar todas las tareas al iniciar
    const cargarTareas = () => {
        listaTareas.innerHTML = "";
        obtenerTareas().forEach(tarea => listaTareas.appendChild(crearElementoTarea(tarea)));
    };

    // Evento para agregar tarea
    formTarea.addEventListener("submit", (event) => {
        event.preventDefault();
        agregarTarea(inputTarea.value);
    });

    // Eliminar todas las tareas completadas
    btnEliminarCompletadas.addEventListener("click", () => {
        const tareas = obtenerTareas().filter(tarea => !tarea.completada);
        guardarTareas(tareas);
        cargarTareas();
    });

    // Aplicar filtro
    const aplicarFiltro = (mostrarCompletadas) => {
        listaTareas.innerHTML = "";
        obtenerTareas()
            .filter(tarea => tarea.completada === mostrarCompletadas)
            .forEach(tarea => listaTareas.appendChild(crearElementoTarea(tarea)));
        filtroActivo = mostrarCompletadas;
    };

    // Restaurar la lista completa
    const restaurarListaCompleta = () => {
        filtroActivo = null;
        cargarTareas();
    };

    // Alternar filtro y actualizar botones
    const alternarFiltro = (mostrarCompletadas, boton) => {
        if (filtroActivo === mostrarCompletadas) {
            restaurarListaCompleta();
        } else {
            aplicarFiltro(mostrarCompletadas);
        }
        actualizarBotonActivo(boton);
    };

    // Actualizar el estado del botón activo
    const actualizarBotonActivo = (boton) => {
        document.querySelectorAll(".Filtros button").forEach(btn => btn.classList.remove("activo"));
        if (filtroActivo !== null) boton.classList.add("activo");
    };

    // Eventos de filtro
    btnMostrarCompletadas.addEventListener("click", () => alternarFiltro(true, btnMostrarCompletadas));
    btnMostrarIncompletas.addEventListener("click", () => alternarFiltro(false, btnMostrarIncompletas));

    // Cargar tareas al iniciar
    cargarTareas();
});
