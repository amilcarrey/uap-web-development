document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");
    const addButton = document.querySelector(".agbot");
    
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === "") return;
        
        const li = document.createElement("li");
        li.innerHTML = `
            <button class="borrar">X</button>
            <span class="tarea">${taskText}</span>
            <input type="checkbox" class="check">
        `;
        
        taskList.appendChild(li);
        taskInput.value = "";
        
        attachEvents(li);
    }
    
    function attachEvents(taskElement) {
        const deleteButton = taskElement.querySelector(".borrar");
        const checkbox = taskElement.querySelector(".check");
        
        deleteButton.addEventListener("click", () => {
            taskElement.remove();
        });
        
        checkbox.addEventListener("change", () => {
            taskElement.classList.toggle("completed", checkbox.checked);
        });
    }
    
    function clearCompletedTasks() {
        document.querySelectorAll(".completed").forEach(task => task.remove());
    }
    
    addButton.addEventListener("click", addTask);
    
    taskInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            addTask();
        }
    });
    
    clearCompleted.addEventListener("click", clearCompletedTasks);
    
});
