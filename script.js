let ordenAscendente = true; // Controla el orden de la lista

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
    const tareaInput = document.getElementById('tareaInput');
    const tareaTexto = tareaInput.value.trim();
    if (tareaTexto === '') return;

    const li = document.createElement('li');
    li.classList.add('tarea-item');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('tarea-checkbox');

    const span = document.createElement('span');
    span.textContent = tareaTexto;
    span.classList.add('tarea-texto');

    checkbox.addEventListener('change', function () {
        span.classList.toggle('tachado', this.checked);
    });

    const borrarBtn = document.createElement('button');
    borrarBtn.innerHTML = '❌';
    borrarBtn.classList.add('btn-borrar');
    borrarBtn.onclick = function () {
        li.remove();
        mostrarBotones();
    };

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(borrarBtn);

    const listaTareas = document.getElementById('listaTareas');

    // Si el orden es ascendente, agregar al final; si es descendente, agregar al inicio
    if (ordenAscendente) {
        listaTareas.appendChild(li);
    } else {
        listaTareas.prepend(li);
    }

    tareaInput.value = '';
    mostrarBotones();
}

// Función para cambiar el orden de la lista de tareas
function cambiarOrdenLista() {
    const listaTareas = document.getElementById('listaTareas');
    const tareas = Array.from(listaTareas.children);

    // Invertir el orden de las tareas
    listaTareas.innerHTML = '';
    tareas.reverse().forEach(tarea => listaTareas.appendChild(tarea));

    // Cambiar el sentido de la inserción
    ordenAscendente = !ordenAscendente;
}

// Función para mostrar el botón de borrar todas las tareas
function mostrarBotones() {
    const contenedorBotones = document.querySelector('.botones');
    const contenedorBoton = document.querySelector('.boton');
    contenedorBotones.style.display = document.getElementById('listaTareas').children.length > 0 ? 'block' : 'none';
    contenedorBoton.style.display = document.getElementById('listaTareas').children.length > 0 ? 'block' : 'none';
}

// Función para borrar todas las tareas de la lista
function borrarTodasLasTareas() {
    document.getElementById('listaTareas').innerHTML = '';
    mostrarBotones();
}

// Función para borrar solo las tareas terminadas
function borrarTareasTerminadas() {
    document.querySelectorAll('.tarea-item').forEach(tarea => {
        if (tarea.querySelector('.tarea-checkbox').checked) {
            tarea.remove();
        }
    });
    mostrarBotones();
}

// Llamar a la función de colorear texto en el título
colorearTexto('titulo', { r: 255, g: 0, b: 0 }, 10);

// Verificar si hay tareas en la lista (esta función no está definida en el código proporcionado)
verificarLista();
