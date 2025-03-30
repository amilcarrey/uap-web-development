const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const clearCompletedButton = document.getElementById("clearCompleted");
const filterAll = document.getElementById("filterAll");
const filterIncomplete = document.getElementById("filterIncomplete");
const filterCompleted = document.getElementById("filterCompleted");

let tasks = [];

function renderTasks(filter = "all") {
    taskList.innerHTML = "";

    tasks.forEach(task => {
        if (filter === "completed" && !task.completed) return;
        if (filter === "incomplete" && task.completed) return;

        const li = document.createElement("li");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        const taskSpan = document.createElement("span");
        taskSpan.textContent = task.text;
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "🗑";
        deleteButton.classList.add("delete");

        if (task.completed) li.classList.add("completed");

        checkbox.addEventListener("change", () => toggleTask(task.id));
        deleteButton.addEventListener("click", () => deleteTask(task.id));

        li.appendChild(checkbox);
        li.appendChild(taskSpan);
        li.appendChild(deleteButton);
        taskList.appendChild(li);
    });
}

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(newTask);
    renderTasks();
    taskInput.value = ""; 
}

function toggleTask(taskId) {
    tasks = tasks.map(task => task.id === taskId ? { ...task, completed: !task.completed } : task);
    renderTasks();
}

function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    renderTasks();
}

function clearCompletedTasks() {
    tasks = tasks.filter(task => !task.completed);
    renderTasks();
}

document.addEventListener("click", (event) => {
    if (event.target === addTaskButton) addTask();
});

taskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") addTask();
});

filterAll.addEventListener("click", () => renderTasks("all"));
filterIncomplete.addEventListener("click", () => renderTasks("incomplete"));
filterCompleted.addEventListener("click", () => renderTasks("completed"));

clearCompletedButton.addEventListener("click", clearCompletedTasks);

renderTasks();
