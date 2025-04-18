document.addEventListener('DOMContentLoaded', () => {

    // --- Funciones Auxiliares ---
    function crearElementoTarea(tarea) {
        const li = document.createElement('li');
        li.dataset.id = tarea.id;
        li.className = `flex items-center justify-between p-2.5 border-b border-gray-200 bg-white transition-colors gap-2.5 overflow-hidden ${tarea.completada ? 'completada line-through text-gray-500 bg-gray-100' : ''}`;
        li.innerHTML = `
            <form action="/completar" method="POST" class="inline-block completar-form">
                <input type="hidden" name="id" value="${tarea.id}">
                <button type="submit" class="p-2 bg-black text-white border-none rounded cursor-pointer hover:bg-gray-800 transition-colors"><i class="fas ${tarea.completada ? 'fa-undo' : 'fa-check'}"></i></button>
            </form>
            <span class="flex-1 text-center break-words whitespace-normal">${escapeHTML(tarea.titulo)}</span>
            <form action="/eliminar" method="POST" class="inline-block eliminar-form">
                <input type="hidden" name="id" value="${tarea.id}">
                <button type="submit" class="p-2 bg-gray-200 text-white border-none rounded cursor-pointer hover:bg-gray-600 transition-colors eliminar-btn"><i class="fas fa-trash"></i></button>
            </form>
        `;
        return li;
    }

    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function actualizarListas(tareas) {
        const listaPersonal = document.querySelector('#personal .tareas-list');
        const listaUniversidad = document.querySelector('#universidad .tareas-list');

        if (!listaPersonal || !listaUniversidad) return; // Salir si no se encuentran las listas

        // Limpiar listas
        listaPersonal.innerHTML = '';
        listaUniversidad.innerHTML = '';

        // Poblar listas
        tareas.forEach(tarea => {
            const elementoTarea = crearElementoTarea(tarea);
            if (tarea.categoria === 'personal') {
                listaPersonal.appendChild(elementoTarea);
            } else if (tarea.categoria === 'universidad') {
                listaUniversidad.appendChild(elementoTarea);
            }
        });
    }


    // --- Delegación de Eventos para Formularios ---
    document.body.addEventListener('submit', async (event) => {
        const form = event.target;

        // Crear tarea
        if (form.matches('.crear-form')) {
            event.preventDefault();
            const formData = new FormData(form);
            // Añadir cabecera para indicar que es una solicitud AJAX
            const response = await fetch('/crear', {
                method: 'POST',
                body: new URLSearchParams(formData), // Enviar como x-www-form-urlencoded
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest' // Cabecera común para AJAX
                }
            });

            if (response.ok) {
                const nuevaTarea = await response.json();
                const ul = form.closest('.main-container').querySelector('.tareas-list');
                if (ul) {
                    ul.appendChild(crearElementoTarea(nuevaTarea));
                }
                form.reset();
            } else {
                console.error('Error al crear tarea:', response.statusText);
                // Mostrar mensaje de error al usuario
            }
        }

        // Completar tarea
        else if (form.matches('.completar-form')) {
            event.preventDefault();
            const formData = new FormData(form);
            const id = formData.get('id');
            const response = await fetch('/completar', {
                method: 'POST',
                body: new URLSearchParams(formData),
                headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }
            });

            if (response.ok) {
                const { completada } = await response.json(); // Obtener el nuevo estado
                const li = form.closest('li[data-id="' + id + '"]');
                if (li) {
                    li.classList.toggle('completada', completada); // Usar el estado devuelto
                    const icon = li.querySelector('.completar-form button i');
                    if (icon) {
                        icon.className = `fas ${completada ? 'fa-undo' : 'fa-check'}`;
                    }
                }
            } else {
                 console.error('Error al completar tarea:', response.statusText);
            }
        }

        // Eliminar tarea
        else if (form.matches('.eliminar-form')) {
            event.preventDefault();
            const formData = new FormData(form);
            const id = formData.get('id');
             const response = await fetch('/eliminar', {
                method: 'POST',
                body: new URLSearchParams(formData),
                headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }
            });

            if (response.ok) {
                const li = form.closest('li[data-id="' + id + '"]');
                if (li) {
                    li.remove();
                }
            } else {
                 console.error('Error al eliminar tarea:', response.statusText);
            }
        }

        // Eliminar tareas completadas
        else if (form.matches('#eliminar-completadas-form')) {
             event.preventDefault();
             const response = await fetch('/eliminarCompletadas', {
                 method: 'POST',
                 headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }
                });

             if (response.ok) {
                const { idsEliminadas } = await response.json();
                idsEliminadas.forEach(id => {
                    const li = document.querySelector('li[data-id="' + id + '"]');
                    if (li) {
                        li.remove();
                    }
                });
             } else {
                 console.error('Error al eliminar tareas completadas:', response.statusText);
             }
        }
    });

    // --- Filtrar Tareas (usando botones) ---
    document.querySelectorAll('.filtro-btn').forEach(button => {
        button.addEventListener('click', async () => {
            const estado = button.dataset.estado;
            // Realizar petición GET para obtener las tareas filtradas
            const response = await fetch(`/filtrar?estado=${estado}`, {
                 headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }
            });

            if (response.ok) {
                const tareasFiltradas = await response.json();
                actualizarListas(tareasFiltradas); // Usar la función para repoblar ambas listas
            } else {
                console.error('Error al filtrar tareas:', response.statusText);
            }
        });
    });
});