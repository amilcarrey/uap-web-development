// document.querySelectorAll(".check-btn").forEach(button => {
//     button.addEventListener("click", function() {
//     this.classList.toggle("active"); // Agrega o quita la clase .active
//     this.nextElementSibling.classList.toggle("completed"); // Agrega o quita la clase .completed
//     });
// }); 
document.querySelector(".todo-list").addEventListener("click", function(e) {
    // Cambiar la tarea a completada
    if (e.target.classList.contains("check-btn")) {
        e.target.classList.toggle("active"); // Alternar clase en el botón
        e.target.nextElementSibling.classList.toggle("completed"); // Alternar clase en el texto
    }

    // Eliminar la tarea al hacer clic en el botón de eliminar
    if (e.target.closest(".delete-btn")) {
        e.target.closest(".todo-item").remove(); // Eliminar el elemento li más cercano
    }
});

//mostrar una categoria como seleccionada y deseleccionar la otra
document.querySelectorAll(".category").forEach(category => {
    category.addEventListener("click", function() {
        document.querySelectorAll(".category").forEach(cat => cat.classList.remove("selected"));
        this.classList.add("selected");
    });
});

// eliminar todas las tareas completadas con clear completed
document.getElementById("clear-completed").addEventListener("click", function() {
    const completedTasks = document.querySelectorAll(".todo-item .completed").forEach(task => {
        task.closest(".todo-item").remove(); // Eliminar el elemento li más cercano
    }
    );
});

// filtrar tareas 
// document.querySelectorAll(".filter-btn").forEach(filter => {
//     filter.addEventListener("click", function() {
//         filter.classList.toggle("selected"); // Alternar clase en el botón
//     })
// });
document.querySelector(".filter-tasks").addEventListener("click", function(e) {
    if(e.target.classList.contains("filter-btn")) {
        document.querySelectorAll(".filter-btn").forEach(filter => filter.classList.remove("selected")); // deseleccionar boton previamente seleccionado
        e.target.classList.add("selected"); // Agregar clase al botón seleccionado

        const filterValue = e.target.value;

        
        document.querySelectorAll(".todo-item .todo-text").forEach(task => {
            const todoItem = task.parentElement;

            if(filterValue === 'all') {
                todoItem.style.display = "flex"; // Mostrar todas las tareas
            }

            if (filterValue === 'completed') {
                if (!task.classList.contains("completed")) {
                    todoItem.style.display = "none";
                } else {
                    todoItem.style.display = "flex"; // Mostrar tareas completadas
                }
            }

            if (filterValue === 'uncompleted') {
                if (task.classList.contains("completed")) {
                    todoItem.style.display = "none";
                } else {
                    todoItem.style.display = "flex"; // Mostrar tareas no completadas
                }
            }
        });
        
    }
});

// si hay click en el botón de agregar tarea
document.querySelector(".add-todo").addEventListener("click", function(e) {
    if (e.target.id === "add-todo-btn") addTask(); 
});

// si se presiona enter en el input de tarea
document.getElementById("input-todo").addEventListener("keypress", function(e) {
    if (e.key === "Enter") addTask();
});

function addTask() {
    const taskInput = document.getElementById("input-todo").value;
    const taskList = document.querySelector(".todo-list");

    // verificar que el campo de entrada no esté vacío ni tenga solo espacios
    if (taskInput.trim() === "") {
        alert("Please enter a task.");
        return;
    }

    const newTask = document.createElement("li");
    newTask.classList.add("todo-item");
    newTask.innerHTML = `<button type="button" class="check-btn">✓</button>
    <p class="todo-text">${taskInput}</p>
    <button type="button" class="delete-btn">
        <i class="fa-solid fa-trash"></i>
    </button>`;

    // newTask.querySelector('.delete-btn').addEventListener('click', function () {
    //     newTask.remove();
    // });

    taskList.appendChild(newTask);
    document.getElementById("input-todo").value = ""; // Limpiar el campo de entrada
}