document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.getElementById("task-form");
  const taskInput = document.getElementById("task-input");
  const tabsContainer = document.querySelector(".tabs");
  const tabContents = document.querySelectorAll(".tab-content");
  let activeTab = "today"; // Default active tab

  // Add task event listener
  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const taskText = taskInput.value.trim();
    if (taskText) {
      addTask(taskText, activeTab);
      taskInput.value = ""; // Clear input
    } else {
      alert("Please enter a task!");
    }
  });

  // Function to add a new task dynamically
  function addTask(taskText, tab) {
    const taskList = document.querySelector(`#task-list-${tab}`);
    const taskItem = document.createElement("li");
    taskItem.classList.add("task-item");

    taskItem.innerHTML = `
      <span class="task-text">${taskText}</span>
      <div class="task-buttons">
        <button class="btn-cancel">🛢️</button>
        <button class="btn-complete">🍺</button>
      </div>
    `;

    const cancelButton = taskItem.querySelector(".btn-cancel");
    const completeButton = taskItem.querySelector(".btn-complete");

    cancelButton.addEventListener("click", () => taskItem.remove());
    completeButton.addEventListener("click", () => toggleComplete(taskItem));

    taskList.appendChild(taskItem);
  }

  // Function to toggle task completion
  function toggleComplete(taskItem) {
    taskItem.classList.toggle("completed");
    const completeButton = taskItem.querySelector(".btn-complete");
    completeButton.textContent = taskItem.classList.contains("completed")
      ? "🍻"
      : "🍺";
  }

  // Initialize static tasks
  function initializeStaticTasks() {
    const staticTasks = document.querySelectorAll(".task-item");
    staticTasks.forEach((taskItem) => {
      const cancelButton = taskItem.querySelector(".btn-cancel");
      const completeButton = taskItem.querySelector(".btn-complete");

      cancelButton.addEventListener("click", () => taskItem.remove());
      completeButton.addEventListener("click", () => toggleComplete(taskItem));
    });
  }

  // Tab switching functionality
  tabsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("tab-button")) {
      const selectedTab = e.target.getAttribute("data-tab");

      document
        .querySelectorAll(".tab-button")
        .forEach((tab) => tab.classList.remove("active"));
      e.target.classList.add("active");

      tabContents.forEach((content) => content.classList.remove("active"));
      document.getElementById(selectedTab).classList.add("active");

      activeTab = selectedTab; // Update active tab
    }
  });

  // Add a new tab dynamically
  const addTabButton = document.querySelector(".btn-add-tab");
  addTabButton.addEventListener("click", () => {
    const newTabName = prompt("Enter the name of the new tab:");
    if (newTabName && newTabName.trim() !== "") {
      const tabId = newTabName.toLowerCase().replace(/\s+/g, "-");

      // Create new tab button
      const newTabButton = document.createElement("button");
      newTabButton.textContent = newTabName;
      newTabButton.classList.add("tab-button");
      newTabButton.setAttribute("data-tab", tabId);
      tabsContainer.insertBefore(newTabButton, addTabButton);

      // Create new tab content
      const newTabContent = document.createElement("div");
      newTabContent.id = tabId;
      newTabContent.classList.add("tab-content");
      newTabContent.innerHTML = `
        <h3>${newTabName}</h3>
        <ul id="task-list-${tabId}"></ul>
        <div class="task-controls">
          <button class="btn-clear-completed">Clear Completed</button>
          <div class="filter-buttons">
            <button class="btn-filter active" data-filter="all">All</button>
            <button class="btn-filter" data-filter="incomplete">Incomplete</button>
            <button class="btn-filter" data-filter="complete">Complete</button>
          </div>
        </div>
      `;
      tabsContainer.parentElement.appendChild(newTabContent);

      // Add event listener for the new tab
      newTabButton.addEventListener("click", () => {
        document
          .querySelectorAll(".tab-button")
          .forEach((tab) => tab.classList.remove("active"));
        newTabButton.classList.add("active");

        tabContents.forEach((content) => content.classList.remove("active"));
        newTabContent.classList.add("active");

        activeTab = tabId; // Update active tab
      });

      // Add event listeners for the new tab's controls
      setupTaskControls(newTabContent);
    }
  });

  // Set up "Clear Completed" and filter buttons functionality
  function setupTaskControls(tabContent) {
    const clearCompletedBtn = tabContent.querySelector(".btn-clear-completed");
    const filterButtons = tabContent.querySelectorAll(".btn-filter");

    // Clear completed tasks
    clearCompletedBtn.addEventListener("click", () => {
      const completedTasks = tabContent.querySelectorAll(
        ".task-item.completed"
      );
      completedTasks.forEach((task) => task.remove());
    });

    // Filter tasks
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Update active filter button
        tabContent
          .querySelectorAll(".btn-filter")
          .forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        const filterType = button.getAttribute("data-filter");
        const tasks = tabContent.querySelectorAll(".task-item");

        tasks.forEach((task) => {
          switch (filterType) {
            case "all":
              task.style.display = "flex";
              break;
            case "incomplete":
              task.style.display = task.classList.contains("completed")
                ? "none"
                : "flex";
              break;
            case "complete":
              task.style.display = task.classList.contains("completed")
                ? "flex"
                : "none";
              break;
          }
        });
      });
    });
  }

  // Initialize task controls for existing tabs
  tabContents.forEach((tabContent) => {
    setupTaskControls(tabContent);
  });

  // Initialize static tasks
  initializeStaticTasks();
});