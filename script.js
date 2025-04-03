let ordenAscendente = true; // Controla el orden de la lista
let estadoFiltro = 0;// 0: todas, 1: completas, 2: incompletas
let tareasOriginales = []; // Guarda todas las tareas sin modificar

// Función para colorear el texto de un elemento
function colorearTexto(elementoId, baseColor, colorOffset) {
    let titulo = document.getElementById(elementoId);
    let texto = titulo.innerText;
    let nuevoTexto = '';

    for (let i = 0; i < texto.length; i++) {
        let r = baseColor.r - (colorOffset * i);
        let g = baseColor.g + (colorOffset * i);
        let b = baseColor.b + (colorOffset * i);

        r = Math.max(0, Math.min(255, r));
        g = Math.max(0, Math.min(255, g));
        b = Math.max(0, Math.min(255, b));

        let color = `rgb(${r}, ${g}, ${b})`;
        nuevoTexto += `<span style="color:${color}">${texto[i]}</span>`;
    }

    titulo.innerHTML = nuevoTexto;
}

// Función para agregar una nueva tarea
function agregarTarea() {
    const tareaInput = document.getElementById('tareaInput');
    const tareaTexto = tareaInput.value.trim();
    if (tareaTexto === '') return;

    const li = document.createElement('li');
    li.classList.add('tarea-item');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('tarea-checkbox');

    const span = document.createElement('span');
    span.textContent = tareaTexto;
    span.classList.add('tarea-texto');

    checkbox.addEventListener('change', function () {
        span.classList.toggle('tachado', this.checked);
    });

    const borrarBtn = document.createElement('button');
    borrarBtn.innerHTML = '❌';
    borrarBtn.classList.add('btn-borrar');
    borrarBtn.onclick = function () {
        // Remover tarea y actualizar lista original
        tareasOriginales = tareasOriginales.filter(tarea => tarea !== li);
        li.remove();
        mostrarBotones();
    };

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(borrarBtn);

    const listaTareas = document.getElementById('listaTareas');

    if (ordenAscendente) {
        listaTareas.appendChild(li);
        tareasOriginales.push(li);
    } else {
        listaTareas.prepend(li);
        tareasOriginales.unshift(li);
    }

    tareaInput.value = '';
    mostrarBotones();
}

// Función para cambiar el orden de la lista de tareas
function cambiarOrdenLista() {
    const listaTareas = document.getElementById('listaTareas');
    const tareas = Array.from(listaTareas.children);

    tareasOriginales.reverse();

    listaTareas.innerHTML = '';
    tareasOriginales.forEach(tarea => listaTareas.appendChild(tarea));

    ordenAscendente = !ordenAscendente;

    const botonOrden = document.getElementById('botonOrden');
    botonOrden.setAttribute('title', ordenAscendente ? 'Orden Descendente' : 'Orden Ascendente');
    botonOrden.innerText = ordenAscendente ? '⬇️' : '⬆️';
}

// Función para mostrar el botón de borrar todas las tareas
function mostrarBotones() {
    const contenedorBotones = document.querySelector('.botones');
    const contenedorBoton = document.querySelector('.boton');
    contenedorBotones.style.display = document.getElementById('listaTareas').children.length > 0 ? 'block' : 'none';
    contenedorBoton.style.display = document.getElementById('listaTareas').children.length > 0 ? 'block' : 'none';
}

// Función para borrar todas las tareas de la lista
function borrarTodasLasTareas() {
    document.getElementById('listaTareas').innerHTML = '';
    mostrarBotones();
}

// Función para borrar solo las tareas terminadas
function borrarTareasTerminadas() {
    document.querySelectorAll('.tarea-item').forEach(tarea => {
        if (tarea.querySelector('.tarea-checkbox').checked) {
            tarea.remove();
        }
    });
    mostrarBotones();
}

// Función para cambiar el filtro sin perder datos
function cambiarFiltro() {
    const listaTareas = document.getElementById('listaTareas');

    if (tareasOriginales.length === 0) return;

    let tareasFiltradas;
    if (estadoFiltro === 0) {
        tareasFiltradas = tareasOriginales.filter(tarea => tarea.querySelector('.tarea-checkbox').checked);
        if (tareasFiltradas.length === 0) return;
        estadoFiltro = 1;
    } else if (estadoFiltro === 1) {
        tareasFiltradas = tareasOriginales.filter(tarea => !tarea.querySelector('.tarea-checkbox').checked);
        estadoFiltro = 2;
    } else {
        tareasFiltradas = [...tareasOriginales];
        estadoFiltro = 0;
    }

    listaTareas.innerHTML = '';
    tareasFiltradas.forEach(tarea => listaTareas.appendChild(tarea));

    const botonFiltro = document.getElementById('botonFiltro');
    botonFiltro.setAttribute('title', obtenerSiguienteEstado());
    botonFiltro.innerText = obtenerIconoEstado();
}

// Función para obtener el siguiente estado del filtro
function obtenerSiguienteEstado() {
    if (estadoFiltro === 0) return 'Siguiente: Tareas Completas';
    if (estadoFiltro === 1) return 'Siguiente: Tareas Incompletas';
    return 'Siguiente: Todas las Tareas';
}

// Función para obtener el icono del botón según el estado
function obtenerIconoEstado() {
    if (estadoFiltro === 0) return '📋'; // Todas las tareas
    if (estadoFiltro === 1) return '✅'; // Completas
    return '📄'; // Incompletas
}

// Llamar a la función de colorear texto en el título
colorearTexto('titulo', { r: 255, g: 0, b: 0 }, 10);