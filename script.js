//traer los elementos del DOM
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const borrarCompletadosButton = document.getElementById("borrarCompletados");

//agregar tareas al con boton o enter 
taskForm.addEventListener("submit", function(event) {
    event.preventDefault(); //p que la pag no se actualice

    const taskText = taskInput.value;
    if (taskText === "") return; //no hacer nada si no hay input

    agregarTarea(taskText); 
    taskInput.value = ""; //vaciar el input
});

//agregar tarea a la lista
function agregarTarea(texto) {
    const li = document.createElement("li"); //primero se crea un elemento de lista
    li.innerHTML = `
        <input type="checkbox" class="task-checkbox">
        <span>${texto}</span>
        <button class="delete-task">X</button>
    `;
    taskList.appendChild(li); //dps se agrega la tarea a la lista

    //checkear o descheckear la tarea
    li.querySelector(".task-checkbox").addEventListener("change", function() {
        if (this.checked) {
            li.classList.add("completed");
        } else {
            li.classList.remove("completed");
        }
    });

    //eliminar tarea
    li.querySelector(".delete-task").addEventListener("click", function() {
        li.remove();
    });
}

//eliminar todas las tareas completadas
borrarCompletadosButton.addEventListener("click", function() {
    document.querySelectorAll(".completed").forEach(task => task.remove());
});
