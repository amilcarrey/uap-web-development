document.addEventListener('submit', async (e) => {
  const form = e.target;

  // Solo interceptamos formularios que apuntan al backend
  if (form.action.includes('/api/')) {
    e.preventDefault();

    const formData = new FormData(form);

    await fetch(form.action, {
      method: form.method,
      body: formData,
      // No definimos Content-Type para que el navegador lo establezca correctamente
    });

    location.reload(); // Refresca la página para ver los cambios
  }
});
