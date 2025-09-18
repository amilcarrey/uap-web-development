const formulario = document.querySelector('form');
const inputNuevaTarea = document.getElementById('nueva-tarea');
const listaTareas = document.getElementById('lista-tareas');
const botonEliminarCompletadas = document.getElementById('eliminar-completadas');
const botonFiltroTodas = document.getElementById('filtro-todas');
const botonFiltroIncompletas = document.getElementById('filtro-incompletas');
const botonFiltroCompletadas = document.getElementById('filtro-completadas');

// Agregar una nueva tarea
formulario.addEventListener('submit', (event) => {
    event.preventDefault();

    const textoTarea = inputNuevaTarea.value.trim();

    if (textoTarea === '') {
        alert('Por favor, introduce una tarea.');
        return;
    }

    const nuevaTarea = document.createElement('li');
    nuevaTarea.innerHTML = `
        <input type="checkbox" class="checkbox">
        <label>${textoTarea}</label>
        <button class="eliminar-tarea">X</button>
    `;

    listaTareas.appendChild(nuevaTarea);
    inputNuevaTarea.value = '';
});

// Eliminar una tarea individual
listaTareas.addEventListener('click', (event) => {
    if (event.target.classList.contains('eliminar-tarea')) {
        event.target.parentElement.remove();
    }
});

// Eliminar todas las tareas completadas
botonEliminarCompletadas.addEventListener('click', () => {
    const tareasCompletadas = document.querySelectorAll('#lista-tareas .checkbox:checked');
    tareasCompletadas.forEach((checkbox) => {
        checkbox.parentElement.remove();
    });
});

// Filtrar tareas
function filtrarTareas(filtro) {
    const tareas = document.querySelectorAll('#lista-tareas li');
    tareas.forEach((tarea) => {
        const checkbox = tarea.querySelector('.checkbox');
        switch (filtro) {
            case 'todas':
                tarea.style.display = 'flex';
                break;
            case 'incompletas':
                tarea.style.display = checkbox.checked ? 'none' : 'flex';
                break;
            case 'completadas':
                tarea.style.display = checkbox.checked ? 'flex' : 'none';
                break;
        }
    });
}

// Eventos para los botones de filtro
botonFiltroTodas.addEventListener('click', () => filtrarTareas('todas'));
botonFiltroIncompletas.addEventListener('click', () => filtrarTareas('incompletas'));
botonFiltroCompletadas.addEventListener('click', () => filtrarTareas('completadas'));