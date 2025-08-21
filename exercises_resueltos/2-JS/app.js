// Selección de elementos
const formulario = document.getElementById('formulario-tarea');
const entradaTarea = document.getElementById('entrada-tarea');
const listaTareas = document.getElementById('lista-tareas');
const botonesFiltro = document.querySelectorAll('.filter');
const botonClearCompleted = document.querySelector('.clear-completed');

// Manejar el evento de agregar tareas
formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();

  const textoTarea = entradaTarea.value.trim();
  if (textoTarea === '') return;

  const nuevaTarea = document.createElement('li');
  nuevaTarea.className = 'tarea';
  nuevaTarea.setAttribute('data-status', 'incomplete');
  nuevaTarea.innerHTML = `
    <input type="checkbox">
    <label>${textoTarea}</label>
    <button class="delete-task">🗑</button>
  `;

  listaTareas.appendChild(nuevaTarea);
  entradaTarea.value = '';
});

// Manejar el evento de completar o eliminar tareas
listaTareas.addEventListener('click', (evento) => {
  if (evento.target.classList.contains('delete-task')) {
    const tarea = evento.target.parentElement;
    listaTareas.removeChild(tarea);
  } else if (evento.target.type === 'checkbox') {
    const tarea = evento.target.parentElement;
    const label = tarea.querySelector('label');
    if (evento.target.checked) {
      tarea.setAttribute('data-status', 'complete');
      label.style.textDecoration = 'line-through';
      label.style.color = '#aaa';
    } else {
      tarea.setAttribute('data-status', 'incomplete');
      label.style.textDecoration = 'none';
      label.style.color = '#333';
    }
  }
});

// Manejar el evento de limpiar tareas completadas
botonClearCompleted.addEventListener('click', () => {
  const tareasCompletadas = listaTareas.querySelectorAll('.tarea[data-status="complete"]');
  tareasCompletadas.forEach((tarea) => {
    listaTareas.removeChild(tarea);
  });
});

// Manejar los filtros
botonesFiltro.forEach((boton) => {
  boton.addEventListener('click', () => {
    const filtro = boton.getAttribute('data-filter');
    const tareas = listaTareas.querySelectorAll('.tarea');

    botonesFiltro.forEach((b) => b.classList.remove('active'));
    boton.classList.add('active');

    tareas.forEach((tarea) => {
      const status = tarea.getAttribute('data-status');
      if (filtro === 'all') {
        tarea.style.display = 'flex';
      } else if (filtro === 'incomplete' && status !== 'incomplete') {
        tarea.style.display = 'none';
      } else if (filtro === 'complete' && status !== 'complete') {
        tarea.style.display = 'none';
      } else {
        tarea.style.display = 'flex';
      }
    });
  });
});