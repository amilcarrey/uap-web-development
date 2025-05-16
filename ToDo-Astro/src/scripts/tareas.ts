document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formulario-agregar') as HTMLFormElement | null;
    if (!form) return;
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const input = form.querySelector('input[name="tarea"]') as HTMLInputElement;
      const texto = input.value.trim();
  
      if (!texto) return;
  
      const respuesta = await fetch('/api/agregar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto })
      });
  
      if (!respuesta.ok) {
        console.error("Error al agregar tarea");
        return;
      }
  
      const nuevaTarea = await respuesta.json();
      console.log('Tarea agregada:', nuevaTarea);
  
      // Acá podés agregarla al DOM con innerHTML o una función que actualice la lista
      input.value = '';
    });
  });
  