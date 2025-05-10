document.addEventListener('DOMContentLoaded', () => {
    const taskList = document.getElementById('taskList');
    const addTaskForm = document.getElementById('add-task-form');
    const clearCompletedBtn = document.getElementById('clear-completed-btn');
    const filterButtons = document.querySelectorAll('.filter-btn');
  
    // Agregar una nueva tarea
    addTaskForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const description = document.getElementById('taskDescription').value;
  
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', description }),
      });
  
      if (response.ok) {
        const html = await response.text();
        updateTaskList(html);
        document.getElementById('taskDescription').value = '';
      }
    });
  
    // Alternar el estado de una tarea
    taskList.addEventListener('click', async (event) => {
      if (event.target.classList.contains('toggle-task-btn')) {
        const taskId = event.target.closest('li').dataset.id;
  
        const response = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'toggle', id: taskId }),
        });
  
        if (response.ok) {
          const html = await response.text();
          updateTaskList(html);
        }
      }
  
      if (event.target.classList.contains('delete-task-btn')) {
        const taskId = event.target.closest('li').dataset.id;
  
        const response = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'delete', id: taskId }),
        });
  
        if (response.ok) {
          const html = await response.text();
          updateTaskList(html);
        }
      }
    });
  
    // Filtrar tareas según el estado
    filterButtons.forEach((button) => {
      button.addEventListener('click', async () => {
        const filter = button.dataset.filter;
  
        const response = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filter }),
        });
  
        if (response.ok) {
          const html = await response.text();
          updateTaskList(html);
        }
      });
    });
  
    // Limpiar tareas completadas
    clearCompletedBtn.addEventListener('click', async () => {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clearCompleted' }),
      });
  
      if (response.ok) {
        const html = await response.text();
        updateTaskList(html);
      }
    });
  
    function updateTaskList(html) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      taskList.innerHTML = doc.getElementById('taskList').innerHTML;
    }
  });