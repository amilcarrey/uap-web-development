document.addEventListener("DOMContentLoaded", () => {
  console.log("🟢 Enhancement activo: interceptando submit");

  const taskList = document.querySelector("#task-list");

  const renderTasks = (tareas: any[]) => {
    if (!taskList) return;
    taskList.innerHTML = "";
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
      console.log("🟡 Tareas recibidas del backend:", tareas);
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

  const createTaskItem = (task: any) => {
    const div = document.createElement("div");
    div.className = "Task";

    // Form TOGGLE
    const formToggle = document.createElement("form");
    formToggle.action = "/api/tasks";
    formToggle.method = "post";
    formToggle.classList.add("checkItem");

    const methodInputToggle = document.createElement("input");
    methodInputToggle.type = "hidden";
    methodInputToggle.name = "_method";
    methodInputToggle.value = "TOGGLE";

    const idInputToggle = document.createElement("input");
    idInputToggle.type = "hidden";
    idInputToggle.name = "id";
    idInputToggle.value = task.id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "checkTask";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => {
      formToggle.requestSubmit();
    });

    formToggle.append(methodInputToggle, idInputToggle, checkbox);

    // Texto
    const p = document.createElement("p");
    p.textContent = task.text;

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
    button.className = "deleteTask";
    button.type = "submit";
    button.innerHTML = `<i class="fas fa-trash"></i> Eliminar`;

    formDelete.append(methodInputDelete, idInputDelete, button);

    // Agregar todo al div
    div.append(formToggle, p, formDelete);

    return div;
  };
});
