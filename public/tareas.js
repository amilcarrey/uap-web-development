document.addEventListener('DOMContentLoaded', () => {
    // Crear tarea
    document.querySelectorAll('form[action="/crear"]').forEach(form => {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(form);
            const response = await fetch('/crear', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const nuevaTarea = await response.json();
                const ul = form.nextElementSibling; // Lista de tareas
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${nuevaTarea.titulo}</span>
                    <form action="/completar" method="POST" style="display: inline;">
                        <input type="hidden" name="index" value="${ul.children.length}">
                        <button type="submit"><i class="fas fa-check"></i></button>
                    </form>
                    <form action="/eliminar" method="POST" style="display: inline;">
                        <input type="hidden" name="index" value="${ul.children.length}">
                        <button type="submit" class="eliminar-btn"><i class="fas fa-trash"></i></button>
                    </form>
                `;
                ul.appendChild(li);
                form.reset();
            }
        });
    });

    // Completar tarea
    document.addEventListener('submit', async (event) => {
        if (event.target.action.includes('/completar')) {
            event.preventDefault();
            const formData = new FormData(event.target);
            const response = await fetch('/completar', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const { index } = await response.json();
                const li = event.target.closest('li');
                li.classList.add('completada');
            }
        }
    });

    // Eliminar tarea
    document.addEventListener('submit', async (event) => {
        if (event.target.action.includes('/eliminar')) {
            event.preventDefault();
            const formData = new FormData(event.target);
            const response = await fetch('/eliminar', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const { index } = await response.json();
                const li = event.target.closest('li');
                li.remove();
            }
        }
    });

    // Eliminar tareas completadas
    document.querySelector('form[action="/eliminarCompletadas"]').addEventListener('submit', async (event) => {
        event.preventDefault();
        const response = await fetch('/eliminarCompletadas', { method: 'POST' });

        if (response.ok) {
            document.querySelectorAll('.completada').forEach(li => li.remove());
        }
    });

    // Filtrar tareas
    document.querySelectorAll('form[action="/filtrar"]').forEach(form => {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(form);
            const query = new URLSearchParams(formData).toString();
            const response = await fetch(`/filtrar?${query}`);

            if (response.ok) {
                const tareasFiltradas = await response.json();
                const ul = document.querySelector('ul'); // Actualiza la lista
                ul.innerHTML = '';
                tareasFiltradas.forEach((tarea, index) => {
                    const li = document.createElement('li');
                    li.className = tarea.completada ? 'completada' : '';
                    li.innerHTML = `
                        <span>${tarea.titulo}</span>
                        <form action="/completar" method="POST" style="display: inline;">
                            <input type="hidden" name="index" value="${index}">
                            <button type="submit"><i class="fas fa-check"></i></button>
                        </form>
                        <form action="/eliminar" method="POST" style="display: inline;">
                            <input type="hidden" name="index" value="${index}">
                            <button type="submit" class="eliminar-btn"><i class="fas fa-trash"></i></button>
                        </form>
                    `;
                    ul.appendChild(li);
                });
            }
        });
    });
});