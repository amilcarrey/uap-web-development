// Alternar entre Modo Oscuro y Modo Claro
const themeToggle = document.getElementById('theme-toggle');
const themeLabel = document.getElementById('theme-label');

themeToggle.addEventListener('change', function() {
  if (this.checked) {
    document.body.classList.add('light-mode');
    themeLabel.textContent = "Modo Claro";
  } else {
    document.body.classList.remove('light-mode');
    themeLabel.textContent = "Modo Oscuro";
  }
});

// Agregar tareas
document.getElementById('task-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const input = document.getElementById('nueva-tarea');
  const taskText = input.value.trim();
  if (taskText !== '') {
    const li = document.createElement('li');
    li.className = 'tarea';
    li.innerHTML = `
      <span>${taskText}</span>
      <div class="action-btns">
        <button type="button" class="complete-btn" title="Completar"><i class="fas fa-check"></i></button>
        <button type="button" class="delete-btn" title="Eliminar"><i class="fas fa-trash"></i></button>
      </div>
    `;
    document.getElementById('task-list').appendChild(li);
    input.value = '';

    // Reiniciar animación para el nuevo elemento
    li.style.animation = 'none';
    setTimeout(() => {
      li.style.animation = '';
    }, 10);
  }
});

// Manejar acciones en la lista de tareas (completar y eliminar)
document.getElementById('task-list').addEventListener('click', function(e) {
  if (e.target.closest('.complete-btn')) {
    const li = e.target.closest('.tarea');
    li.classList.toggle('completed');
  }
  if (e.target.closest('.delete-btn')) {
    const li = e.target.closest('.tarea');
    li.style.transition = 'opacity 0.5s ease';
    li.style.opacity = '0';
    setTimeout(() => {
      li.remove();
    }, 500);
  }
});

// Eliminar todas las tareas completadas
document.getElementById('clear-completed').addEventListener('click', function() {
  const tasks = document.querySelectorAll('.tarea.completed');
  tasks.forEach(task => {
    task.style.transition = 'opacity 0.5s ease';
    task.style.opacity = '0';
    setTimeout(() => {
      task.remove();
    }, 500);
  });
});
