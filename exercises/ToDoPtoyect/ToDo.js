        // Seleccionamos el input y el botón
        const addTaskButton = document.getElementById("addTaskButton");
        const addTaskInput = document.getElementById("addtask");
        const deleteTaskButton = document.getElementById("deleteTask");
        const clearCompleteButton = document.getElementById("clearCompleteButton");
        

        // Función para agregar una nueva tarea
        function addTask() {
            const taskText = addTaskInput.value.trim();
            const taskList = document.querySelector(".Tasks"); // usamos esto para ver seleccionar el div donde vamos a agregar la tarea

            if (taskText) {
                const newTask = document.createElement("div");
                newTask.classList.add("Task");//Agregar clase al nuevo div para poder usar las cosas del css
                // usamos lo de abajo para agregar el resto del contenido HTML de la nueva tarea
                newTask.innerHTML = `
                    <input type="checkbox" id="checkTask">
                    <p>${taskText}</p>
                    <button type="button" id="deleteTask"><i class="fas fa-trash"></i> DELETE</button>
                `;
                taskList.appendChild(newTask); // Agregamos loS dicerentes variables que creamos al nuevo div para que nos quede igual
                addTaskInput.value = ""; // hacemos que el input vuelva a quedar en blanco
            }
        }

        // Función para eliminar una tarea
        function deleteTask(event) {
            const task = event.target.closest(".Task");//event target es el elemento que disparó el evento, 
            // closest busca el elemento padre más cercano que tenga la clase Task, porque necesitamos eliminar el div completo y no solo el botón
            if (task) {
                task.remove();
            }
        }
        // Función para eliminar tareas completadas
        function clearCompletedTasks() {
            const tasks = document.querySelectorAll(".Task");//usamos all no solo una necesitamos todas, NO DEVUELVE UN ARRAY!X DEVUELVE UN NODE LIST
            tasks.forEach(task => {
                const checkbox = task.querySelector("#checkTask");
                if (checkbox.checked) {
                    task.remove();
                }
            });
        }
        // Función para filtrar tareas
        function filterTasks(completed) {
            const tasks = document.querySelectorAll(".Task");
            tasks.forEach(task => {
                const checkbox = task.querySelector("#checkTask");
                if (checkbox.checked !== completed) {
                    task.style.display = "none"; // Oculta la tarea si no coincide con el filtro
                } else {
                    task.style.display = "flex"; // Muestra la tarea si coincide con el filtro
                }
            });
        }
        // Eventos        
        clearCompleteButton.addEventListener("click", clearCompletedTasks);
        // Evento para eliminar tareas completadas al presionar el botón "DELETE"
        document.addEventListener("click", function (event) {
            if (event.target.id === "deleteTask") {
                deleteTask(event);
            }
        });
        // Evento para agregar tarea al presionar el botón "ADD"
        addTaskButton.addEventListener("click", addTask);

        // Evento para agregar tarea al presionar "Enter"
        document.querySelector("#addtask").addEventListener("keypress", function(e) {
            if (e.key === "Enter") {
                addTask();
            }
        });
        // Llamados a los eventos para los botones
        document.getElementById("Completed").addEventListener("click", () => {
            filterTasks(true); // Muestra solo las tareas completadas
        });

        document.getElementById("Incompleted").addEventListener("click", () => {
            filterTasks(false); // Muestra solo las tareas incompletas
        });

        // Si tienes un botón para mostrar todas las tareas`
        document.getElementById("All").addEventListener("click", () => {
            const tasks = document.querySelectorAll(".Task");
            tasks.forEach(task => {
                task.style.display = "flex"; // Muestra todas las tareas
            });
        }
    );