document.addEventListener("DOMContentLoaded", () => {
  const taskList = document.querySelector("#task-list");
  const filterLinks = document.querySelectorAll(".filterButtons");

  const renderTasks = (tareas: any[]) => { //Reenderizamos toda la lista de treas cada vez que se hace una peticion al backend.
    if (!taskList) return;
    taskList.innerHTML = ""; // Limpiamos la lista antes de agregar las tareas
    tareas.forEach((t) => {
      const taskDiv = createTaskItem(t); 
      taskList.appendChild(taskDiv); 
    });
  };

  const sendAction = async (data: any) => {
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      const tareas = await response.json();

      renderTasks(tareas);
    } else {
      console.error("❌ Error al enviar acción:", data);
    }
  };

  // 📌 Form para agregar tareas
  const addForm = document.querySelector("#add-task-form");
  if (addForm) {
    addForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(addForm as HTMLFormElement);
      const text = formData.get("text")?.toString() || "";
      if (text.trim() === "") return;
      await sendAction({ _method: "ADD", text });
      (addForm as HTMLFormElement).reset();
    });
  }

  // 📌 Form para limpiar completadas
  const clearForm = document.querySelector("#clear-completed-form");
  if (clearForm) {
    clearForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      await sendAction({ _method: "DELETE_COMPLETED" });
    });
  } 

  // 📌 Delegación de eventos en taskList
  const OnetaskList = document.querySelector("#task-list");

  if (OnetaskList) {
    OnetaskList.addEventListener("submit", async (e) => {
      const form = e.target as HTMLFormElement;
  
      if (form.matches("form.deleteItem")) {
        e.preventDefault();
        const formData = new FormData(form);
        await sendAction({
          _method: "DELETE",
          id: Number(formData.get("id")),
        });
      }
  
      if (form.matches("form.checkItem")) {
        e.preventDefault();
        const formData = new FormData(form);
        await sendAction({
          _method: "TOGGLE",
          id: Number(formData.get("id")),
        });
      }
    });
  }

   // Función para obtener las tareas con el filtro seleccionado
   const getFilteredTasks = async (filtro) => {
    const response = await fetch(`/api/tasks?filtro=${filtro}`);
    if (response.ok) {
      const tareas = await response.json();
      renderTasks(tareas);
    } else {
      console.error("❌ Error al obtener tareas");
    }
  };

  // clicks en los filtros
  filterLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const href = (e.currentTarget as HTMLAnchorElement).href;
      const filtro = new URL(href).searchParams.get("filtro");
      getFilteredTasks(filtro);
    });
  });

  const createTaskItem = (task: any) => {
    const div = document.createElement("div");
    div.className = "Task flex justify-between items-center w-[83%] p-[10px] rounded-[5px] bg-[rgb(83,57,88)]";

   // Contenedor para checkbox y texto (para usar peer correctamente)
   const taskContent = document.createElement("div");
   taskContent.className = "flex items-center gap-4 flex-1";
   
   // Form TOGGLE
   const formToggle = document.createElement("form");
   formToggle.action = "/api/tasks";
   formToggle.method = "post";
   formToggle.classList.add("checkItem", "flex", "items-center", "gap-4", "w-full");

   const methodInputToggle = document.createElement("input");
   methodInputToggle.type = "hidden";
   methodInputToggle.name = "_method";
   methodInputToggle.value = "TOGGLE";
   const idInputToggle = document.createElement("input");
   idInputToggle.type = "hidden";
   idInputToggle.name = "id";
   idInputToggle.value = task.id;

   // Checkbox con estilos Tailwind
   const checkbox = document.createElement("input");
   checkbox.type = "checkbox";
   checkbox.className = "checkTask appearance-none w-[47px] h-[40px] border-2 border-gray-400 rounded-[8px] cursor-pointer relative transition-all duration-300 checked:bg-green-600 checked:border-green-600 after:content-['DONE'] after:text-white after:text-[14px] after:absolute after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:pointer-events-none after:hidden checked:after:block";
   checkbox.checked = task.completed;
   checkbox.addEventListener("change", () => {
       formToggle.requestSubmit();
   });

   // Texto de la tarea
   const taskText = document.createElement("p");
   taskText.textContent = task.text;
   taskText.className = "flex-1 text-[white] peer-checked:line-through peer-checked:text-gray-400 transition-all duration-300 text-center";
   
   
   // Si la tarea está completada, aplicar estilos inmediatamente
   if (task.completed) {
       taskText.classList.add("line-through", "text-gray-400");
   }

   // Agregar elementos al formulario
   formToggle.append(methodInputToggle, idInputToggle, checkbox, taskText);
   
    // Form DELETE
    const formDelete = document.createElement("form");
    formDelete.action = "/api/tasks";
    formDelete.method = "post";
    formDelete.classList.add("deleteItem");

    const methodInputDelete = document.createElement("input");
    methodInputDelete.type = "hidden";
    methodInputDelete.name = "_method";
    methodInputDelete.value = "DELETE";

    const idInputDelete = document.createElement("input");
    idInputDelete.type = "hidden";
    idInputDelete.name = "id";
    idInputDelete.value = task.id;

    const button = document.createElement("button");
    button.className = "deleteTask flex items-center gap-2 bg-orange-400 text-white rounded-[5px] px-5 py-2 cursor-pointer text-[16px] hover:bg-[rgb(139,90,0)] transition";
    button.type = "submit";
    button.innerHTML = `<i class="fas fa-trash"></i> Eliminar`;

    formDelete.append(methodInputDelete, idInputDelete, button);

    // Agregar todo al div
    div.append(formToggle, formDelete);

    return div;
  };
});
