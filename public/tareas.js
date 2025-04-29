document.addEventListener('DOMContentLoaded', () => {
    function crearElementoTarea(tarea) {
        const li = document.createElement('li');
        li.dataset.id = tarea.id;
        li.classList.add(
            'flex', 'items-center', 'justify-between', 'p-2.5', 
            'border-b', 'border-gray-200', 'bg-white', 'transition-all',
            'duration-300', 'gap-2.5', 'overflow-hidden',
            'animate__animated', 'animate__fadeIn' 
        );

        if (tarea.completada) {
            li.classList.add('completada', 'line-through', 'text-gray-500', 'bg-gray-100');
        }

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

        li.addEventListener('mouseenter', () => {
            li.classList.add('shadow-md', 'scale-[1.02]');
        });
        
        li.addEventListener('mouseleave', () => {
            li.classList.remove('shadow-md', 'scale-[1.02]');
        });

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

    document.body.addEventListener('submit', async (event) => {
        const form = event.target;

        // Crear tarea
        if (form.matches('.crear-form')) {
            event.preventDefault();
            const formData = new FormData(form);
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
                    // Modificar las clases para tachar el texto
                    if (completada) {
                        li.classList.add('completada', 'line-through', 'text-gray-500', 'bg-gray-100');
                    } else {
                        li.classList.remove('completada', 'line-through', 'text-gray-500', 'bg-gray-100');
                    }
                    
                    // Actualizar el icono
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
                    eliminarTareaConAnimacion(li);
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
                        eliminarTareaConAnimacion(li);
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

    // --- Animaciones adicionales ---
    // Agregar animaciones a los botones de acción
    document.querySelectorAll('button').forEach(button => {
        button.classList.add('transition-transform', 'duration-200');
        button.addEventListener('mousedown', () => {
            button.classList.add('scale-95');
        });
        button.addEventListener('mouseup', () => {
            button.classList.remove('scale-95');
        });
        button.addEventListener('mouseleave', () => {
            button.classList.remove('scale-95');
        });
    });

    // Función para manejar la eliminación de tareas con animación
    function eliminarTareaConAnimacion(li) {
        li.classList.remove('animate__fadeIn');
        li.classList.add('animate__animated', 'animate__fadeOutRight');
        
        li.addEventListener('animationend', () => {
            li.remove();
        });
    }

    // Agregar efecto de entrada para los contenedores principales
    document.querySelectorAll('.main-container').forEach((container, index) => {
        container.classList.add('animate__animated');
        container.classList.add(index === 0 ? 'animate__slideInLeft' : 'animate__slideInRight');
        container.style.animationDelay = `${index * 0.2}s`;
    });
});