// Selección de elementos
const taskInput = document.getElementById('task');
const taskList = document.querySelector('ul');
const form = document.querySelector('form');

// Limpiar las tareas iniciales al cargar la página
document.querySelectorAll('ul li').forEach(task => task.remove());

// Función para agregar una tarea
function addTask(event) {
    event.preventDefault();
    const taskText = taskInput.value.trim();

    if (taskText) {
        // Crear elementos de tarea
        const li = document.createElement('li');
        const span = document.createElement('span');
        span.textContent = taskText;

        const completeButton = document.createElement('button');
        completeButton.textContent = 'Complete';

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';

        // Agregar funcionalidad al botón Complete
        completeButton.addEventListener('click', () => {
            li.classList.toggle('completed');
            if (li.classList.contains('completed')) {
                span.innerHTML = `✔️ ${taskText}`; // Agregar el ícono de check
                completeButton.textContent = 'Undo';
            } else {
                span.textContent = taskText; // Remover el ícono de check
                completeButton.textContent = 'Complete';
            }
        });

        // Agregar funcionalidad al botón Delete
        deleteButton.addEventListener('click', () => {
            li.remove();
        });

        // Agregar elementos al li
        li.appendChild(span);
        li.appendChild(completeButton);
        li.appendChild(deleteButton);

        // Agregar el li al ul
        taskList.appendChild(li);

        // Limpiar el input
        taskInput.value = '';
    }
}

// Escucha de eventos para el botón Add y tecla Enter
form.addEventListener('submit', addTask);

// Crear un contenedor para los botones
const controlsDiv = document.createElement('div');
controlsDiv.className = 'controls';

// Botón Clear Completed
const clearCompletedButton = document.createElement('button');
clearCompletedButton.textContent = 'Clear Completed';
controlsDiv.appendChild(clearCompletedButton);

clearCompletedButton.addEventListener('click', () => {
    const completedTasks = taskList.querySelectorAll('li.completed');
    completedTasks.forEach(task => task.remove());
});

// Filtros de tareas
const allFilter = document.createElement('button');
const incompleteFilter = document.createElement('button');
const completeFilter = document.createElement('button');

allFilter.textContent = 'All';
incompleteFilter.textContent = 'Incomplete';
completeFilter.textContent = 'Complete';

controlsDiv.appendChild(allFilter);
controlsDiv.appendChild(incompleteFilter);
controlsDiv.appendChild(completeFilter);

// Agregar el contenedor de controles al cuerpo del documento
document.body.appendChild(controlsDiv);

function filterTasks(filter) {
    const tasks = taskList.querySelectorAll('li');
    tasks.forEach(task => {
        const isCompleted = task.classList.contains('completed');
        if (filter === 'all' || (filter === 'incomplete' && !isCompleted) || (filter === 'complete' && isCompleted)) {
            task.style.display = '';
        } else {
            task.style.display = 'none';
        }
    });
}

allFilter.addEventListener('click', () => filterTasks('all'));
incompleteFilter.addEventListener('click', () => filterTasks('incomplete'));
completeFilter.addEventListener('click', () => filterTasks('complete'));