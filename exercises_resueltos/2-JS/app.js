// Selección de elementos
const formulario = document.getElementById('formulario-tarea');
const entradaTarea = document.getElementById('entrada-tarea');
const listaTareas = document.getElementById('lista-tareas');
const botonClearCompleted = document.querySelector('.clear-completed');

// Manejar el evento de agregar tareas (botón "ADD" o tecla Enter)
formulario.addEventListener('submit', (evento) => {
  evento.preventDefault(); // Evitar recargar la página

  const textoTarea = entradaTarea.value.trim();
  if (textoTarea === '') return; // No agregar tareas vacías

  // Crear un nuevo elemento de tarea
  const nuevaTarea = document.createElement('li');
  nuevaTarea.className = 'tarea';
  nuevaTarea.innerHTML = `
    <input type="checkbox">
    <label>${textoTarea}</label>
    <button class="delete-task">🗑</button>
  `;

  // Agregar la tarea a la lista
  listaTareas.appendChild(nuevaTarea);

  // Limpiar el input
  entradaTarea.value = '';
});

// Manejar el evento de completar o eliminar tareas
listaTareas.addEventListener('click', (evento) => {
  if (evento.target.classList.contains('delete-task')) {
    // Eliminar tarea
    const tarea = evento.target.parentElement;
    listaTareas.removeChild(tarea);
  } else if (evento.target.type === 'checkbox') {
    // Completar o descompletar tarea
    const label = evento.target.nextElementSibling;
    if (evento.target.checked) {
      label.style.textDecoration = 'line-through';
      label.style.color = '#aaa';
    } else {
      label.style.textDecoration = 'none';
      label.style.color = '#333';
    }
  }
});

// Manejar el evento de limpiar tareas completadas
botonClearCompleted.addEventListener('click', () => {
  const tareasCompletadas = document.querySelectorAll('.tarea input[type="checkbox"]:checked');
  tareasCompletadas.forEach((checkbox) => {
    const tarea = checkbox.parentElement;
    listaTareas.removeChild(tarea);
  });
});

// Filtros para mostrar todas, incompletas o completas
const botonesFiltro = document.querySelectorAll('.tab');
botonesFiltro.forEach((boton) => {
  boton.addEventListener('click', () => {
    const filtro = boton.textContent.toLowerCase();
    const tareas = listaTareas.querySelectorAll('.tarea');

    // Actualizar la clase activa del filtro
    botonesFiltro.forEach((b) => b.classList.remove('active'));
    boton.classList.add('active');

    // Filtrar tareas
    tareas.forEach((tarea) => {
      const checkbox = tarea.querySelector('input[type="checkbox"]');
      if (filtro === 'personal' || filtro === 'professional') {
        tarea.style.display = 'flex'; // Mostrar todas las tareas
      } else if (filtro === 'completadas' && !checkbox.checked) {
        tarea.style.display = 'none'; // Ocultar incompletas
      } else if (filtro === 'incompletas' && checkbox.checked) {
        tarea.style.display = 'none'; // Ocultar completadas
      } else {
        tarea.style.display = 'flex'; // Mostrar las que coincidan
      }
    });
  });
});