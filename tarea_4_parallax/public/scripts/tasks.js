
document.addEventListener('DOMContentLoaded', () => {
    const addForm      = document.getElementById('addForm');
    const listEl       = document.getElementById('task-list');
    const clearForm    = document.getElementById('clearCompletedForm');
  
    
    async function loadTasks() {
      const res = await fetch('/api/tasks');
      const tasks = await res.json();
      render(tasks);
    }
  
    
    function render(tasks) {
      listEl.innerHTML = '';
      tasks.forEach(t => {
        const item = document.createElement('div');
        item.className =
          'flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition';
        item.dataset.id = t.id;
  
        const toggleBtn = document.createElement('button');
        toggleBtn.className =
          'flex-none w-6 h-6 rounded-full flex items-center justify-center transition-transform ' +
          (t.completed
            ? 'bg-success border-success'
            : 'border-2 border-primary') +
          ' hover:scale-110';
        toggleBtn.textContent = t.completed ? '✅' : '';
        toggleBtn.onclick = async () => {
          await fetch('/api/tasks', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: t.id, completed: !t.completed })
          });
          loadTasks();
        };
  
        const textP = document.createElement('p');
        textP.className = 'ml-4 flex-grow text-lg ' +
          (t.completed ? 'line-through text-gray-400' : 'text-gray-800');
        textP.textContent = t.text;
  
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'flex-none ml-4 text-lg text-error hover:text-errorDark transition';
        deleteBtn.textContent = '✕';
        deleteBtn.onclick = async () => {
          await fetch('/api/tasks', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: t.id })
          });
          loadTasks();
        };
  
        item.append(toggleBtn, textP, deleteBtn);
        listEl.append(item);
      });
    }
  

    addForm.addEventListener('submit', async e => {
      e.preventDefault();
      const input = addForm.querySelector('input[name="taskInput"]');
      const text  = input.value.trim();
      if (!text) return;
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      input.value = '';
      loadTasks();
    });
  

    clearForm.addEventListener('submit', async e => {
      e.preventDefault();
      await fetch('/api/tasks', { method: 'PATCH' });
      loadTasks();
    });
  

    loadTasks();
  });
  