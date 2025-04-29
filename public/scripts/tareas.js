document.addEventListener('DOMContentLoaded', () => {
  const taskList = document.getElementById('task-list');
  const formAgregar = document.getElementById('form-agregar');
  const formClear = document.getElementById('form-clear');
  const filtros = document.getElementById('filtros');

  async function enviarJson(url, data = {}) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error(`Error: ${response.statusText}`);

      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const nuevaTaskList = doc.getElementById('task-list');

      if (nuevaTaskList) {
        taskList.innerHTML = nuevaTaskList.innerHTML;
      } else {
        console.warn('No se encontró #task-list en la respuesta del servidor.');
      }

      await cargarTareas(); // Siempre recarga tareas luego de enviar
    } catch (error) {
      console.error('Error al enviar JSON:', error);
    }
  }

  async function cargarTareas(filtro = 'all') {
    const url = `/api/tareas/getFiltered?filter=${filtro}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (!response.ok) throw new Error('Error al cargar las tareas');
  
      const tareas = await response.json();
      taskList.innerHTML = tareas.length === 0
        ? `<p class="text-center text-gray-600">Sin tareas.</p>`
        : tareas.map(t => `
            <div class="flex items-center justify-between bg-orange-50 p-3 rounded mb-3 ${t.completada ? 'line-through text-gray-500' : ''}">
              <button data-id="${t.id}" class="toggle-btn text-xl">${t.completada ? '🔄' : '✔️'}</button>
              <span class="flex-1 mx-4">${t.descripcion}</span>
              <button data-id="${t.id}" class="delete-btn text-xl">🗑️</button>
            </div>
          `).join('');
    } catch (error) {
      console.error('Error al cargar tareas:', error);
      taskList.innerHTML = `<p class="text-center text-red-600">Error al cargar las tareas. Intenta de nuevo más tarde.</p>`;
    }
  }
  

  async function handleAgregarTarea(e) {
    e.preventDefault();
    const descripcion = formAgregar.descripcion.value.trim();
    if (descripcion) {
      await enviarJson('/api/tareas/add', { descripcion });
      formAgregar.reset();
    }
  }

  async function handleClearCompletadas(e) {
    e.preventDefault();
    await enviarJson('/api/tareas/clearCompleted');
  }

  async function handleListaClick(e) {
    const btn = e.target;
    const id = parseInt(btn.getAttribute('data-id'), 10);
    if (!id) return;

    if (btn.classList.contains('toggle-btn')) {
      await enviarJson('/api/tareas/toggle', { id });
    } else if (btn.classList.contains('delete-btn')) {
      await enviarJson('/api/tareas/delete', { id });
    }
  }

  function handleFiltroClick(e) {
    if (e.target.tagName === 'A') {
      e.preventDefault();
      const nuevoFiltro = e.target.getAttribute('data-filter');
      cargarTareas(nuevoFiltro);

      filtros.querySelectorAll('a').forEach(a =>
        a.classList.remove('font-bold', 'underline')
      );
      e.target.classList.add('font-bold', 'underline');
    }
  }
  if (formAgregar) formAgregar.addEventListener('submit', handleAgregarTarea);
  if (formClear) formClear.addEventListener('submit', handleClearCompletadas);
  taskList.addEventListener('click', handleListaClick);
  if (filtros) filtros.addEventListener('click', handleFiltroClick);

  cargarTareas();
});
