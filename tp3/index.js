document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("Add-reminder");
    const input = form.querySelector("input");
    const todoList = document.querySelector(".todo-list");
    const clearCompletedBtn = document.getElementById("Clear-completed");
    const addButton = document.getElementById("add-btn"); // Seleccionar el botón

    form.addEventListener("submit", addTask);

    input.addEventListener("input", () => {
        addButton.disabled = input.value.trim() === ""; // Habilitar si hay texto
    });

    function addTask(event) {
        event.preventDefault();
        const taskText = input.value.trim();
        if (taskText === "") return alert("Debe ingresar un texto");

        const li = document.createElement("li");
        li.innerHTML = `
            <label>
                <input type="checkbox"> ${taskText}
            </label>
            <button class="delete-btn">
                <img src="eliminar.png" alt="Eliminar">
            </button>
        `;
        todoList.appendChild(li);
        removeNoTasksMessage(); // Eliminar mensaje si existe
        input.value = "";
        addButton.disabled = true; // Deshabilitar el botón después de agregar
    }

    todoList.addEventListener("click", (e) => {
        if (e.target.tagName === "INPUT" && e.target.type === "checkbox") {
            e.target.closest("li").classList.toggle("completed");
        }
    
        if (e.target.closest(".delete-btn")) {
            const li = e.target.closest("li");
            const isCompleted = li.classList.contains("completed");
    
            if (!isCompleted) {
                const confirmDelete = confirm("El recordatorio no está marcado como completo. ¿Seguro que quieres eliminarlo?");
                if (!confirmDelete) return;
            }
    
            li.remove();
        }
    });

    clearCompletedBtn.addEventListener("click", () => {
        document.querySelectorAll(".todo-list .completed").forEach(task => task.remove());
    });

    document.querySelector("#filter-all").addEventListener("click", () => filterTasks("all"));
    document.querySelector("#filter-incomplete").addEventListener("click", () => filterTasks("incomplete"));
    document.querySelector("#filter-complete").addEventListener("click", () => filterTasks("complete"));

    
    function filterTasks(filter) {
        let hasTasks = false;
        
        document.querySelectorAll(".todo-list li").forEach(li => {
            if (filter === "all") {
                li.style.display = "";
            } else if (filter === "incomplete") {
                li.style.display = li.querySelector("input").checked ? "none" : "";
            } else if (filter === "complete") {
                li.style.display = li.querySelector("input").checked ? "" : "none";
            }
    
            if (li.style.display !== "none") {
                hasTasks = true;
            }
        });
    
       // Mostrar o eliminar el mensaje según si hay tareas visibles
    if (!hasTasks) {
        showNoTasksMessage();
    } else {
        removeNoTasksMessage();
    }
    }

    // Función para mostrar el mensaje
function showNoTasksMessage() {
    let message = document.getElementById("no-tasks-message");
    
    if (!message) {
        message = document.createElement("p");
        message.id = "no-tasks-message";
        message.textContent = "No hay recordatorios ";
        message.style.textAlign = "center";
        message.style.color = "#d34c4c";
        message.style.fontSize = "18px";
        message.style.fontWeight = "bold";
        document.querySelector(".todo-list").appendChild(message);
    }
}

// Función para eliminar el mensaje
function removeNoTasksMessage() {
    const message = document.getElementById("no-tasks-message");
    if (message) {
        message.remove();
    }
}
    

    document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("deleteModal");
    const clearCompletedBtn = document.getElementById("Clear-completed");
    const cancelDelete = document.getElementById("cancelDelete");
    const confirmDelete = document.getElementById("confirmDelete");
      


    // Mostrar el modal al hacer clic en "Eliminar Completados"
    clearCompletedBtn.addEventListener("click", (event) => {
        event.preventDefault(); // Evita la acción por defecto
        modal.style.display = "flex";
    });

    // Cerrar el modal sin eliminar
    cancelDelete.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Confirmar eliminación
    confirmDelete.addEventListener("click", () => {
        eliminarTareasIncompletas(); // Llama a la función que borra los recordatorios
        modal.style.display = "none";
    });

    // Función para eliminar solo recordatorios incompletos
    function eliminarTareasIncompletas() {
        const tasks = document.querySelectorAll(".todo-list li");
        tasks.forEach(task => {
            const checkbox = task.querySelector("input[type='checkbox']");
            if (!checkbox.checked) { 
                task.remove(); 
            }
        });
    }
});

});
