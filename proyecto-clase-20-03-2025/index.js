const taskInput = document.getElementById('task-input');
const addButton = document.querySelector('.add-button');
const taskList = document.getElementById('task-list');
const clearButton = document.querySelector('.clear-button');
const filterAll = document.getElementById('filter-all');
const filterActive = document.getElementById('filter-active');
const filterCompleted = document.getElementById('filter-completed');

function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        alert('Por favor, ingresa una tarea antes de agregarla.');
        return;
    }

    const newTask = document.createElement('li');
    newTask.classList.add('incomplete'); 

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('checkbox');
    checkbox.addEventListener('change', toggleTaskCompletion);

    const taskTextElement = document.createElement('p');
    taskTextElement.classList.add('text-task');
    taskTextElement.textContent = taskText;

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-btn');
    deleteButton.textContent = '🗑Delete';
    deleteButton.addEventListener('click', deleteTask);

    newTask.appendChild(checkbox);
    newTask.appendChild(taskTextElement);
    newTask.appendChild(deleteButton);

    newTask.style.display = 'flex';
    newTask.style.justifyContent = 'space-between';
    newTask.style.alignItems = 'center';
    newTask.style.margin = '15px';

    taskList.appendChild(newTask);

    taskInput.value = '';
}

function toggleTaskCompletion(event) {
    const task = event.target.closest('li');
    task.classList.toggle('completed');
    task.classList.toggle('incomplete');
}

function deleteTask(event) {
    const task = event.target.closest('li');
    task.remove();
}

function clearCompletedTasks() {
    const completedTasks = document.querySelectorAll('.completed');
    completedTasks.forEach(task => task.remove());
}

function filterTasks(filter) {
    const tasks = taskList.children;

    for (const task of tasks) {
        switch (filter) {
            case 'all':
                task.style.display = 'flex';
                break;
            case 'active':
                task.style.display = task.classList.contains('completed') ? 'none' : 'flex';
                break;
            case 'completed':
                task.style.display = task.classList.contains('completed') ? 'flex' : 'none';
                break;
        }
    }
}

addButton.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        addTask();
    }
});
clearButton.addEventListener('click', clearCompletedTasks);
filterAll.addEventListener('click', () => filterTasks('all'));
filterActive.addEventListener('click', () => filterTasks('active'));
filterCompleted.addEventListener('click', () => filterTasks('completed'));