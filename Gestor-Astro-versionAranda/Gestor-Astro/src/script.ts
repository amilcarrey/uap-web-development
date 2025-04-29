window.addEventListener('DOMContentLoaded', () => {
  // Detectar si la navegación fue un reload o no pq no anda pinche cosa
  const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  if (nav?.type === 'reload') {
    console.log('🔄 La página se recargó');
  }

  
});


window.addEventListener('DOMContentLoaded', () => {
  const addForm = document.getElementById('add-reminder-form') as HTMLFormElement;
  const remindersList = document.getElementById('remindersList') as HTMLUListElement;
  const tpl = document.getElementById('reminder-template') as HTMLTemplateElement;
  const clearForm = document.getElementById('clear-complete-form') as HTMLFormElement | null;
  const filterLinks = Array.from(
    document.querySelectorAll<HTMLAnchorElement>('a[href*="filter="]')
  );

  let reminders: Array<{ id: string; text: string; completed: boolean }> = [];
  let currentFilter: 'all' | 'completed' | 'incomplete' = 'all';

  /// Carga los recordatorios desde el servidor según filtro
  async function loadReminders(filter: 'all' | 'completed' | 'incomplete' = 'all') {
    try {
      const res = await fetch(`/api/filter?filter=${filter}`, {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error('Error al cargar recordatorios');
      const data = (await res.json()) as {
        reminders: typeof reminders;
        filter: string;
      };
      reminders = data.reminders;
      currentFilter = filter;
      renderReminders();
    } catch (err) {
      console.error(err);
    }
  }

  ///Renderiza la lista en el DOM 
  function renderReminders() {
    remindersList.innerHTML = '';
    let hasCompleted = false;

    reminders.forEach((rem) => {
      if (currentFilter === 'completed' && !rem.completed) return;
      if (currentFilter === 'incomplete' && rem.completed) return;

      const clone = tpl.content.cloneNode(true) as DocumentFragment;
      const li = clone.querySelector('li')!;
      const textSpan = clone.querySelector<HTMLElement>('.reminder-text')!;
      const checkbox = clone.querySelector<HTMLElement>('.checkbox-box')!;
      const toggleForm = clone.querySelector<HTMLFormElement>('.toggle-reminder')!;
      const deleteForm = clone.querySelector<HTMLFormElement>('.delete-reminder')!;

     
      toggleForm.querySelector<HTMLInputElement>('input[name="id"]')!.value = rem.id;
      toggleForm.querySelector<HTMLInputElement>('input[name="completed"]')!.value =
        String(!rem.completed);
      deleteForm.querySelector<HTMLInputElement>('input[name="id"]')!.value = rem.id;

      textSpan.textContent = rem.text;
      if (rem.completed) {
        li.classList.add('bg-rose-50');
        checkbox.classList.add('bg-rose-600', 'border-rose-600', 'text-white');
        textSpan.classList.add('line-through', 'text-gray-500');
        hasCompleted = true;
      }

      remindersList.appendChild(clone);
    });

    // Mostrar/ocultar botón "Limpiar completados", mepa qeu its not working, cuando se recarga si anda fuck
    if (clearForm) {
      clearForm.style.display = hasCompleted ? '' : 'none';
    }

    // Actualizar estilos de filtros
    filterLinks.forEach((link) => {
      const f = new URLSearchParams(link.search).get('filter');
      if (f === currentFilter) {
        link.classList.add('bg-rose-600', 'text-white');
        link.classList.remove('border', 'border-rose-500', 'text-rose-500', 'hover:bg-rose-50');
      } else {
        link.classList.remove('bg-rose-600', 'text-white');
        link.classList.add('border', 'border-rose-500', 'text-rose-500', 'hover:bg-rose-50');
      }
    });
  }

  // Añadir recordatorio 
  addForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const input = addForm.querySelector<HTMLInputElement>('input[name="text"]')!;
    const text = input.value.trim();
    if (!text) return;
    try {
      const res = await fetch(addForm.action, {
        method: addForm.method,
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error('Error al crear recordatorio');
      input.value = '';
      await loadReminders(currentFilter);
    } catch (err) {
      console.error(err);
    }
  });

  //Delegación
  remindersList.addEventListener('click', async (ev) => {
    const btn = (ev.target as Element).closest('button');
    if (!btn) return;

    // Toggle completo/incompleto (cambia state)
    const toggleForm = btn.closest('form.toggle-reminder') as HTMLFormElement | null;
    if (toggleForm) {
      ev.preventDefault();
      const formData = new FormData(toggleForm);
      try {
        const res = await fetch(toggleForm.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            id: formData.get('id'),
            completed: formData.get('completed') === 'true',
          }),
        });
        if (!res.ok) throw new Error('Error al actualizar estado');
        await loadReminders(currentFilter);
      } catch (err) {
        console.error(err);
      }
      return;
    }

    // Borrar recordatorio ??=?=
    const deleteForm = btn.closest('form.delete-reminder') as HTMLFormElement | null;
    if (deleteForm) {
      ev.preventDefault();
      const formData = new FormData(deleteForm);
      try {
        const res = await fetch(deleteForm.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ id: formData.get('id') }),
        });
        if (!res.ok) throw new Error('Error al eliminar');
        await loadReminders(currentFilter);
      } catch (err) {
        console.error(err);
      }
      return;
    }
  });

  // Limpiar completados ... ver arriba pq no aparece al principio
  if (clearForm) {
    clearForm.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      try {
        const res = await fetch(clearForm.action, {
          method: 'POST',
          headers: { Accept: 'application/json' },
        });
        if (!res.ok) throw new Error('Error al limpiar completados');
        await loadReminders(currentFilter);
      } catch (err) {
        console.error(err);
      }
    });
  }

  // Filtrar sin recargar
  filterLinks.forEach((link) => {
    link.addEventListener('click', async (ev) => {
      ev.preventDefault();
      const f = (new URLSearchParams(link.search).get('filter') || 'all') as
        | 'all'
        | 'completed'
        | 'incomplete';
      await loadReminders(f);
    });
  });

  // Carga inicial
  loadReminders();
});
