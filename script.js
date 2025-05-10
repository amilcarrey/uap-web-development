document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form');
    const inputTarea = document.getElementById('nuevaTarea');
    const listaTareas = document.getElementById('lista');
    const btnBorrarCompletadas = document.getElementById('borrarCompletadas');
    const btnBorrarTodo = document.getElementById('borrarTodo');
    const filtroTodas = document.getElementById('filtroTodas');
    const filtroActivas = document.getElementById('filtroActivas');
    const filtroCompletadas = document.getElementById('filtroCompletadas');
    
    
    let tareas = [];
    
    // Filtro actual
    let filtroActual = 'todas';
    
    // Función tareas según el filtro
    function FiltroTareas() {
        listaTareas.innerHTML = ''; //borra la lista actual antes de actualizarl
        
        let tareasFiltradas = [];
        
        switch(filtroActual) {
            case 'activas':
                tareasFiltradas = tareas.filter(tarea => !tarea.completada);
                break;
            case 'completadas':
                tareasFiltradas = tareas.filter(tarea => tarea.completada);
                break;
            default:
                tareasFiltradas = tareas;
        }
        
        if (tareasFiltradas.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'No hay tareas para mostrar';
            li.style.textAlign = 'center';
            li.style.color = '#888';
            li.style.padding = '20px';
            listaTareas.appendChild(li);
            return;
        }
        
        tareasFiltradas.forEach((tarea, index) => {
            const li = document.createElement('li');
            if (tarea.completada) {
                li.classList.add('completada');
            }
            
            li.innerHTML = `
                <button type="button" class="check ${tarea.completada ? 'completada' : ''}" data-id="${tarea.id}">✔</button>
                <span class="texto-tarea">${tarea.texto}</span>
                <button type="button" class="eliminar" data-id="${tarea.id}">🗑️</button>
            `;
            
            listaTareas.appendChild(li);
        });
    }
    
    function agregarTarea(texto) {
        if (texto.trim() === '') return;
        
        const nuevaTarea = {
            id: Date.now(),
            texto: texto,
            completada: false
        };
        
        tareas.push(nuevaTarea);
        FiltroTareas();
        inputTarea.value = ''; //limpiar el input
    }
    
    // Función para alternar el estado de completada de una tarea
    function TareaCompletada(id) {
        tareas = tareas.map(tarea => {
            if (tarea.id === id) {
                return {...tarea, completada: !tarea.completada};
            }
            return tarea;
        });
        FiltroTareas();
    }
    
    // Función para eliminar una tarea
    function eliminarTarea(id) {
        tareas = tareas.filter(tarea => tarea.id !== id);
        FiltroTareas();
    }
    
    // Función para eliminar todas las tareas completadas
    function borrarCompletadas() {
        tareas = tareas.filter(tarea => !tarea.completada);
        FiltroTareas();
    }
    
    // Función para eliminar todas las tareas
    function borrarTodo() {
        tareas = [];
        FiltroTareas();
    }
    





    // Event Listeners
    form.addEventListener('submit', function(e) {
        e.preventDefault(); //evita que la pagina se recargue
        agregarTarea(inputTarea.value);
    });
    
    // También funciona con Enter
    inputTarea.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            agregarTarea(inputTarea.value);
        }
    });
    
    // Delegación de eventos para los botones de las tareas
    listaTareas.addEventListener('click', function(e) {
        if (e.target.classList.contains('check')) {
            const id = parseInt(e.target.getAttribute('data-id'));
            TareaCompletada(id);
        }
        
        if (e.target.classList.contains('eliminar')) {
            const id = parseInt(e.target.getAttribute('data-id'));
            eliminarTarea(id);
        }
    });
    
    // Botones de filtro
    filtroTodas.addEventListener('click', function() {
        filtroActual = 'todas';
        filtroTodas.classList.add('activo');
        filtroActivas.classList.remove('activo');
        filtroCompletadas.classList.remove('activo');
        FiltroTareas();
    });
    
    filtroActivas.addEventListener('click', function() {
        filtroActual = 'activas';
        filtroTodas.classList.remove('activo');
        filtroActivas.classList.add('activo');
        filtroCompletadas.classList.remove('activo');
        FiltroTareas();
    });
    
    filtroCompletadas.addEventListener('click', function() {
        filtroActual = 'completadas';
        filtroTodas.classList.remove('activo');
        filtroActivas.classList.remove('activo');
        filtroCompletadas.classList.add('activo');
        FiltroTareas();
    });
    
    // Botones de acciones
    btnBorrarCompletadas.addEventListener('click', borrarCompletadas);
    btnBorrarTodo.addEventListener('click', borrarTodo);
    
    //actualiza la lista al cargar la página
    FiltroTareas();
});