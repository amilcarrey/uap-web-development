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

/* Variable para el filtro actual */
let currentFilter = "all";

/* Función para aplicar el filtro */
function applyFilter() {
  const tasks = document.querySelectorAll('#task-list li.tarea');
  tasks.forEach(task => {
    if (currentFilter === "all") {
      task.style.display = "flex";
    } else if (currentFilter === "active") {
      task.style.display = task.classList.contains("completed") ? "none" : "flex";
    } else if (currentFilter === "completed") {
      task.style.display = task.classList.contains("completed") ? "flex" : "none";
    }
  });
}

/* Función para actualizar la apariencia de los botones de filtro */
function updateActiveFilterButton(filter) {
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  if (filter === "all") {
    document.getElementById('filter-all').classList.add('active');
  } else if (filter === "active") {
    document.getElementById('filter-active').classList.add('active');
  } else if (filter === "completed") {
    document.getElementById('filter-completed').classList.add('active');
  }
}

/* Eventos para los botones de filtro */
document.getElementById('filter-all').addEventListener('click', function() {
  currentFilter = "all";
  updateActiveFilterButton("all");
  applyFilter();
});

document.getElementById('filter-active').addEventListener('click', function() {
  currentFilter = "active";
  updateActiveFilterButton("active");
  applyFilter();
});

document.getElementById('filter-completed').addEventListener('click', function() {
  currentFilter = "completed";
  updateActiveFilterButton("completed");
  applyFilter();
});

/* Agregar tareas */
document.getElementById('task-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const input = document.getElementById('nueva-tarea');
  const taskText = input.value.trim();
  if (taskText !== '') {
    const li = document.createElement('li');
    li.className = 'tarea';
    li.innerHTML = `
      <input type="checkbox" class="complete-checkbox" title="Completar">
      <span>${taskText}</span>
      <div class="action-btns">
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
    applyFilter();
  }
});

/* Manejar el cambio en el checkbox para completar/descompletar tareas */
document.getElementById('task-list').addEventListener('change', function(e) {
  if (e.target.matches('.complete-checkbox')) {
    const li = e.target.closest('li.tarea');
    li.classList.toggle('completed');
    applyFilter();
  }
});

/* Eliminar tarea individual */
document.getElementById('task-list').addEventListener('click', function(e) {
  if (e.target.closest('.delete-btn')) {
    const li = e.target.closest('li.tarea');
    li.style.transition = 'opacity 0.5s ease';
    li.style.opacity = '0';
    setTimeout(() => {
      li.remove();
      applyFilter();
    }, 500);
  }
});

/* Eliminar todas las tareas completadas */
document.getElementById('clear-completed').addEventListener('click', function() {
  const tasks = document.querySelectorAll('.tarea.completed');
  tasks.forEach(task => {
    task.style.transition = 'opacity 0.5s ease';
    task.style.opacity = '0';
    setTimeout(() => {
      task.remove();
      applyFilter();
    }, 500);
  });
});
