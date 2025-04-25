import type { Task } from './types';

const filter = document.getElementById("filter");
const addTaskForm = document.getElementById("add-task-form");
const taskList = document.getElementById("task-list");
const taskItemTemplate = document.getElementById("task-item") as HTMLTemplateElement;
const taskItemExample = taskItemTemplate.content.querySelector("li");

if (!filter || !addTaskForm || !taskList || !taskItemExample) {
  throw new Error("Filter, task list or add task form not found");
}

const renderTask = (task: Task) => {
  const taskItem = taskItemExample.cloneNode(true) as HTMLLIElement;
  taskItem.querySelector("[data-text='text']")!.textContent = task.text;
  taskItem.querySelector("[data-text='done']")!.textContent = task.done ? "✅" : "⬜";
  
  taskItem.querySelector("form")?.setAttribute("action", `/api/toggle/${task?.id}`);

  handleItemForm(taskItem.querySelector("form") as HTMLFormElement);

  taskList.appendChild(taskItem);
};

const renderTasks = (tasks: Task[]) => {
  taskList.innerHTML = "";

  tasks.forEach(renderTask);
};

const handleItemForm = (form: HTMLFormElement) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const submitter = event.submitter as HTMLButtonElement;

    const action = submitter.getAttribute("value");

    const taskId = form.getAttribute("data-task-id");

    if (!taskId) {
      return;
    }

    console.log(action, taskId);

    if (action === "complete") {
      const response = await fetch(`/api/toggle/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data: { task: Task } = await response.json();

        submitter.querySelector("[data-text='done']")!.textContent = data.task.done ? "✅" : "⬜";
      }
    }

    if (action === "delete") {
      const response = await fetch(`/api/toggle/${taskId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        form.closest("li")?.remove();
      }
    }
  });
}