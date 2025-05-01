document.addEventListener('DOMContentLoaded', () => {
    const addTaskForm = document.querySelector('form[action="/add-task"]');
  
    if (addTaskForm) {
      addTaskForm.addEventListener('submit', async (event) => {
        event.preventDefault();
  
        const formData = new FormData(addTaskForm);
        const text = formData.get('text');
  
        if (!text || text.trim() === '') return;
  
        try {
          const response = await fetch('/add-task', {
            method: 'POST',
            body: formData,
          });
  
          if (response.redirected) {
            // Recargamos solo si el servidor redirigió (comportamiento de Astro por defecto)
            window.location.href = response.url;
          } else {
            // Alternativamente, podríamos actualizar la lista sin recargar (a futuro)
            window.location.reload();
          }
        } catch (error) {
          console.error('❌ Error al agregar la tarea:', error);
        }
      });
    }
  });
  