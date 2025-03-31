// Se ejecuta cuando el contenido del DOM ha sido completamente cargado.
document.addEventListener('DOMContentLoaded', () => {
    
    // Seleccionamos el campo de entrada donde el usuario escribirá la tarea.
    const taskInput = document.querySelector('.task-input input');
    
    // Seleccionamos el botón que agregará la tarea.
    const addTaskButton = document.querySelector('.add-task');
    
    // Seleccionamos la lista de tareas donde se agregarán los elementos `<li>`.
    const taskList = document.querySelector('.task-list');

    // Función para agregar una nueva tarea
    const addTask = () => {
        // Obtenemos el texto ingresado por el usuario y eliminamos los espacios en blanco alrededor
        const taskText = taskInput.value.trim();
        
        // Si el campo está vacío, mostramos un mensaje de alerta y no hacemos nada
        if (taskText === '') return alert('Please enter a task.');

        // Creamos un nuevo elemento `<li>` para representar la tarea
        const li = document.createElement('li');
        // Le asignamos el contenido HTML de la tarea (incluyendo el botón de completar, la descripción y el botón de eliminar)
        li.innerHTML = `
            <label>
                <button class="task-btn">⬜</button>
                <span>${taskText}</span>
            </label>
            <button class="delete-btn">🗑️</button>
        `;
        // Agregamos el nuevo `<li>` a la lista de tareas
        taskList.appendChild(li);
        
        // Limpiamos el campo de entrada para que el usuario pueda agregar una nueva tarea
        taskInput.value = '';
    };

    // Función para alternar el estado de una tarea entre completada y no completada
    const taskCompletion = button => {
        // Si el botón tiene el texto "⬜", lo cambiamos a "✅" (completada)
        if (button.textContent === '⬜') button.textContent = '✅';
        // Si tiene el texto "✅", lo cambiamos a "⬜" (no completada)
        else button.textContent = '⬜';
    };    

    // Función para eliminar una tarea
    const deleteTask = (button) => {
        // El método closest se usa para encontrar el elemento `<li>` más cercano al botón de eliminar
        // Luego, eliminamos ese `<li>` de la lista
        button.closest('li').remove();
    };

    // Función para eliminar todas las tareas completadas
    const clearCompletedTasks = () => {
        // Seleccionamos todos los botones de tarea
        document.querySelectorAll('.task-btn').forEach(button => {
            // Si el texto del botón es "✅" (tarea completada), eliminamos el `<li>` correspondiente
            if (button.textContent === '✅') {
                button.closest('li').remove();
            }
        });
    };

    // Función para filtrar las tareas según el estado (todas, incompletas, completadas)
    const filterTasks = (filter) => {
        // Seleccionamos todas las tareas en la lista
        document.querySelectorAll('.task-list li').forEach(li => {
            // Comprobamos si la tarea está completada o no
            const isCompleted = li.querySelector('.task-btn').textContent === '✅';
            // Mostramos o ocultamos las tareas según el filtro seleccionado
            if (filter === 'all' || (filter === 'completed' && isCompleted) || (filter === 'incomplete' && !isCompleted)) {
                li.style.display = ''; // Mostrar la tarea
            }
            else {
                li.style.display = 'none'; // Ocultar la tarea
            }
        });
    };

    // Asignamos el evento de clic al botón para agregar la tarea
    addTaskButton.addEventListener('click', addTask);

    // Asignamos el evento de 'Enter' al campo de entrada, de modo que también se pueda agregar una tarea al presionar la tecla Enter
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    // Asignamos un evento de clic a la lista de tareas para detectar qué botón se ha clickeado dentro de cada tarea
    taskList.addEventListener('click', (e) => {
        // Si se hace clic en el botón de completar tarea
        if (e.target.classList.contains('task-btn')) {
            taskCompletion(e.target);
        }
        // Si se hace clic en el botón de eliminar tarea
        else if (e.target.classList.contains('delete-btn')) {
            deleteTask(e.target);
        }
    });

    // Seleccionamos el botón para eliminar todas las tareas completadas
    const clearCompletedButton = document.querySelector('.clear-completed');
    // Asignamos un evento de clic para borrar las tareas completadas
    clearCompletedButton.addEventListener('click', clearCompletedTasks);

    // Definimos los filtros posibles: todos, incompletos y completados
    const filters = ['all', 'incomplete', 'completed'];
    // Seleccionamos los botones de filtro
    const filterButtons = document.querySelectorAll('.filter-btn');

    // Asignamos un evento de clic a cada botón de filtro
    filterButtons.forEach((filterButton, index) => {
        // Cuando se hace clic en un filtro, se ejecuta la función filterTasks con el filtro correspondiente
        filterButton.addEventListener('click', () => filterTasks(filters[index]));
    });
});
