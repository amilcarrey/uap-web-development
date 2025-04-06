document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const clearCompletedButton = document.getElementById('clear-completed');

    // Agregar tarea 
    taskForm.addEventListener('submit', (event) => {
        event.preventDefault();
        addTask();
    });

    taskInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            addTask();
        }
    });

    // Eliminar tarea con el boton roojo
    taskList.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-button')) {
            event.target.parentElement.remove();
        }
    });

    // Eliminar todas las tareas completadas
    clearCompletedButton.addEventListener('click', () => {
        const completedTasks = document.querySelectorAll('.task-item input[type="checkbox"]:checked');
        completedTasks.forEach(task => task.parentElement.remove());
    });

    // Los filtros
    const filtersContainer = document.createElement('div');
    filtersContainer.innerHTML = `
        <button class="filter-button" onclick="filterTasks('all')">All</button>
        <button class="filter-button" onclick="filterTasks('incomplete')">Incomplete</button>
        <button class="filter-button" onclick="filterTasks('complete')">Complete</button>
    `;
    document.querySelector('.task-manager').appendChild(filtersContainer);

    window.addTask = function() {
        const taskText = taskInput.value.trim();
        if (taskText === '') return;

        const li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = `
            <input type="checkbox">
            <label>${taskText}</label>
            <button class="delete-button">&#10006;</button>
        `;
        taskList.appendChild(li);
        taskInput.value = '';
    };

    window.filterTasks = function(filter) {
        const tasks = document.querySelectorAll('.task-item');
        tasks.forEach(task => {
            const isComplete = task.querySelector('input[type="checkbox"]').checked;
            if (filter === 'all' || (filter === 'complete' && isComplete) || (filter === 'incomplete' && !isComplete)) {
                task.style.display = 'flex';
            } else {
                task.style.display = 'none';
            }
        });
    };
});


