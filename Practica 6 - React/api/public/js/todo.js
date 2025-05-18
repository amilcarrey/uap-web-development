document.addEventListener('DOMContentLoaded', () => { //cuando la pag carga completamente..
    
    //manejador para todos los forms excepto el de agregar
    document.addEventListener('submit', async (e) => {
      const form = e.target;
      
      if (form.id === 'taskForm') return; //no manejar el form de add tarea pq se maneja aparete
      
      if (form.matches('form[data-ajax]')) {
        e.preventDefault(); //evita el envio clasico
        const formData = new FormData(form);
  
        try {
          const response = await fetch('/api/tasks.json', {
            method: 'POST',
            body: formData
          });
          
          const result = await response.json();
          
          if (result.success) {
            updateUI(form, formData, result); //actualiza la ui manualmente
          } else {
            form.submit(); //fallback
          }
        } catch (error) {
          console.error('AJAX Error:', error);
          form.submit(); //fallback si hay error
        }
      }
    });
  });
  
  function updateUI(form, formData, result) { //actualiza la pantalla segun el tipo de accion

    const action = formData.get('action');
    const listItem = form.closest('[data-task-item]');
  
    switch(action) {
      case 'toggle':
        if (listItem && result.index !== undefined) {
          //Actualiza todos los inputs con el indice correcto
          listItem.querySelectorAll('input[name="index"]').forEach(input => {
            input.value = result.index;
          });
          
          const toggleBtn = form.querySelector('button');
          const taskText = listItem.querySelector('span');
          if (toggleBtn && taskText) {
            toggleBtn.textContent = result.completed ? '✓' : '▢';
            taskText.classList.toggle('line-through', result.completed);
            listItem.classList.toggle('opacity-60', result.completed);
          }
        }
        break;
        
      case 'delete':
        if (listItem) {
          listItem.remove();
        }
        break;
        
      case 'clear':
        const completedItems = document.querySelectorAll('[data-task-item] .line-through');
        completedItems.forEach(item => {
          item.closest('[data-task-item]')?.remove();
        });
        break;
    }
  }