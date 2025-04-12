const task = document.getElementById('task');
const addTask = document.getElementById('addTask');
const taskList = document.getElementById('taskList');
const clearCompletedBtn = document.getElementById('clear');

const allTasks = document.getElementById('allTasks');
const incompletedTasks = document.getElementById('incompletedTasks');
const completedTasks = document.getElementById('completedTasks');





function taskFilter() {
    allTasks.addEventListener('click', function () {
        const tasks = taskList.querySelectorAll('li');
        tasks.forEach(task => {
            task.style.display = 'flex';
        });
    });
    incompletedTasks.addEventListener('click', function () {
        const tasks = taskList.querySelectorAll('li');
        tasks.forEach(task => {
        const checkbox = task.querySelector('input[type="checkbox"]');
            if(!checkbox.checked){
                task.style.display='flex';
            }
            else{
                task.style.display = 'none';
            }
        });
    });

    completedTasks.addEventListener('click', function () {
        const tasks = taskList.querySelectorAll('li');
        tasks.forEach(task => {
        const checkbox = task.querySelector('input[type="checkbox"]');
            if(checkbox.checked){
                task.style.display = 'flex';
            }
            else{
                task.style.display = 'none';
            }
        });
    });
}
taskFilter();



addTask.addEventListener('submit', function (event) {
    event.preventDefault(); 
    validate();
});


function validate() {
    const taskValue = task.value;
    if (taskValue !== "") {

        const newTask = document.createElement('li');
        newTask.innerHTML = `
         <input type="checkbox">
         <label>${taskValue}</label>
         <button type="button" class="delete"> <i class="fas fa-trash"></i></button>
        `;
        taskList.querySelector('ul').appendChild(newTask);

        newTask.querySelector('.delete').addEventListener('click', deleteTask);
        task.value = '';
        


    } else {
        alert("Por favor, ingrese una tarea");
    }

    
}

function deleteTask(event) {
    event.target.closest('li').remove();
}


function completeTask() {
    taskList.addEventListener('change', function (event) {
        if (event.target.type === 'checkbox') {
            const listItem = event.target.closest('li');
            const label = listItem.querySelector('label');
            
            if (event.target.checked) {
                label.style.textDecoration = 'line-through'; 
            } else {
                label.style.textDecoration = 'none'; 
            }
        }
    });
}

function clearCompleted() {
    const tasks = taskList.querySelectorAll('li');
    tasks.forEach(task => {
        const checkbox = task.querySelector('input[type="checkbox"]');
        if (checkbox.checked) {
            task.remove();
        }
    })
}

clearCompletedBtn.addEventListener('click', clearCompleted);
completeTask();





