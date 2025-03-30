// Función para colorear el texto de un elemento
function colorearTexto(elementoId, baseColor, colorOffset) {
    // Obtener el elemento por su ID
    let titulo = document.getElementById(elementoId);
    // Obtener el texto del elemento
    let texto = titulo.innerText;
    let nuevoTexto = '';

    // Recorrer cada carácter del texto
    for (let i = 0; i < texto.length; i++) {
        // Calcular los valores RGB modificados para cada letra
        let r = baseColor.r - (colorOffset * i);
        let g = baseColor.g + (colorOffset * i);
        let b = baseColor.b + (colorOffset * i);

        // Asegurar que los valores RGB estén dentro del rango válido (0-255)
        r = Math.max(0, Math.min(255, r));
        g = Math.max(0, Math.min(255, g));
        b = Math.max(0, Math.min(255, b));

        // Crear un color en formato RGB
        let color = `rgb(${r}, ${g}, ${b})`;
        // Agregar el carácter con el color correspondiente
        nuevoTexto += `<span style="color:${color}">${texto[i]}</span>`;
    }

    // Reemplazar el contenido del elemento con el texto coloreado
    titulo.innerHTML = nuevoTexto;
}

// Función para agregar una nueva tarea a la lista
function agregarTarea() {
    // Obtener el valor del input de tarea
    const tareaInput = document.getElementById('tareaInput');
    const tareaTexto = tareaInput.value.trim();

    // Si el input está vacío, no hacer nada
    if (tareaTexto === '') return;

    // Crear el elemento <li> para la tarea
    const li = document.createElement('li');
    li.classList.add('tarea-item');

    // Crear el checkbox para marcar la tarea
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('tarea-checkbox');

    // Crear el span para el texto de la tarea
    const span = document.createElement('span');
    span.textContent = tareaTexto;
    span.classList.add('tarea-texto');

    // Agregar un evento para tachar el texto cuando se marque el checkbox
    checkbox.addEventListener('change', function () {
        span.classList.toggle('tachado', this.checked);
    });

    // Crear el botón para eliminar la tarea
    const borrarBtn = document.createElement('button');
    borrarBtn.innerHTML = '❌'; // Ícono de eliminación
    borrarBtn.classList.add('btn-borrar');
    borrarBtn.onclick = function () {
        li.remove(); // Eliminar la tarea
        mostrarBotone(); // Verificar si el botón de borrar todo debe mostrarse
    };

    // Agregar los elementos al <li>
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(span);
    li.appendChild(borrarBtn);

    // Agregar el <li> a la lista de tareas
    document.getElementById('listaTareas').appendChild(li);

    // Limpiar el input
    tareaInput.value = '';

    // Mostrar el botón para borrar todas las tareas
    mostrarBotone();
}

// Función para mostrar el botón de borrar todas las tareas
function mostrarBotone() {
    const contenedorBotones = document.querySelector('.botones');

    // Si la lista tiene elementos, mostrar el botón
    if (document.getElementById('listaTareas').children.length > 0) {
        contenedorBotones.style.display = 'block';
    } else {
        contenedorBotones.style.display = 'none';
    }
}

// Función para borrar todas las tareas de la lista
function borrarTodasLasTareas() {
    // Obtener la lista de tareas
    const listaTareas = document.getElementById('listaTareas');
    // Limpiar todo el contenido de la lista
    listaTareas.innerHTML = '';
    // Verificar si el botón de borrar debe seguir visible
    mostrarBotone();
}

// Función para borrar solo las tareas terminadas
function borrarTareasTerminadas() {
    // Obtener todas las tareas de la lista
    const tareas = document.querySelectorAll('.tarea-item');
    
    // Recorrer todas las tareas
    tareas.forEach(tarea => {
        // Si la tarea está marcada (checkbox está chequeado), eliminarla
        const checkbox = tarea.querySelector('.tarea-checkbox');
        if (checkbox.checked) {
            tarea.remove();
        }
    });

    // Verificar si el botón de borrar debe seguir visible
    mostrarBotone();
}

// Llamar a la función de colorear texto en el título
colorearTexto('titulo', { r: 255, g: 0, b: 0 }, 10);

// Verificar si hay tareas en la lista (esta función no está definida en el código proporcionado)
verificarLista();
