// Contador para nombres de nuevas pestañas
let tabCounter = 1;

// Función para agregar una nueva pestaña
function addNewTab() {
    const tabName = `newTab${tabCounter}`; // Nombre único para la nueva pestaña
    tabCounter++;

    // Crear el botón de la nueva pestaña
    const newTabButton = document.createElement('button');
    newTabButton.className = 'tab-button';
    newTabButton.textContent = `Tab ${tabCounter}`;
    newTabButton.setAttribute('data-tab', tabName); // Asociar el botón con la pestaña

    // Configurar el evento onclick para cambiar entre pestañas
    newTabButton.onclick = function () {
        openTab(tabName);
    };

    // Agregar el botón al contenedor de pestañas
    const tabsContainer = document.querySelector('.tabs');
    tabsContainer.insertBefore(newTabButton, document.querySelector('.add-tab-button'));

    // Crear el contenido de la nueva pestaña
    const newTabContent = document.createElement('section');
    newTabContent.id = tabName;
    newTabContent.className = 'tab-content';

    // Agregar un título editable a la nueva pestaña
    const tabTitle = document.createElement('h3');
    tabTitle.textContent = `Tab ${tabCounter}`;
    tabTitle.addEventListener('click', function () {
        makeTitleEditable(tabTitle, newTabButton);
    });
    newTabContent.appendChild(tabTitle);

    // Agregar un mensaje emergente para indicar cómo cambiar el nombre
    const tooltip = document.createElement('span');
    tooltip.className = 'tooltip';
    tooltip.textContent = 'Click aquí para cambiar el nombre';
    tabTitle.appendChild(tooltip);

    // Eliminar el mensaje después de 3 segundos
    setTimeout(() => {
        tooltip.remove();
    }, 3000);

    // Agregar un contenedor de entrada y botón ADD
    const inputContainer = document.createElement('div');
    inputContainer.className = 'input-container';

    const taskInput = document.createElement('input');
    taskInput.type = 'text';
    taskInput.placeholder = 'What do you need to do?';
    taskInput.className = 'task-input';
    taskInput.id = `taskInput${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`;

    const addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.className = 'add-button';
    addButton.textContent = 'ADD';
    addButton.onclick = function () {
        addTask(tabName);
    };

    inputContainer.appendChild(taskInput);
    inputContainer.appendChild(addButton);
    newTabContent.appendChild(inputContainer);

    // Agregar una lista de tareas vacía
    const taskList = document.createElement('div');
    taskList.className = 'task-list';
    taskList.id = `taskList${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`;
    newTabContent.appendChild(taskList);

    // Agregar el botón "Clear Completed"
    const clearButton = document.createElement('button');
    clearButton.type = 'button';
    clearButton.className = 'clear-button';
    clearButton.textContent = 'Clear Completed';
    clearButton.onclick = clearCompleted;
    newTabContent.appendChild(clearButton);

    // Agregar la nueva pestaña al contenedor principal
    document.querySelector('main').appendChild(newTabContent);

    // Abrir la nueva pestaña automáticamente
    openTab(tabName);
}

// Función para hacer el título de la pestaña editable
function makeTitleEditable(tabTitle, tabButton) {
    const currentName = tabTitle.textContent;

    // Crear un campo de texto editable
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentName;
    input.className = 'tab-title-input';

    // Reemplazar el título con el campo de texto
    tabTitle.replaceWith(input);
    input.focus(); // Enfocar el campo de texto automáticamente

    // Guardar el nuevo nombre cuando el usuario presione "Enter" o haga clic fuera
    input.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            saveTabTitle(input, tabTitle, tabButton);
        }
    });

    input.addEventListener('blur', function () {
        saveTabTitle(input, tabTitle, tabButton);
    });
}

// Función para guardar el nuevo nombre del título
function saveTabTitle(input, tabTitle, tabButton) {
    const newName = input.value.trim();

    // Restaurar el título con el nuevo nombre
    tabTitle.textContent = newName || `Tab ${tabCounter}`; // Usar el nombre predeterminado si está vacío
    input.replaceWith(tabTitle);

    // Actualizar el nombre del botón de la pestaña
    if (tabButton) {
        tabButton.textContent = newName || `Tab ${tabCounter}`;
    }
}

// Función para cambiar entre pestañas
function openTab(tabName) {
    // Oculta todos los contenidos de las pestañas
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.classList.remove('active'));

    // Muestra solo el contenido de la pestaña seleccionada
    document.getElementById(tabName).classList.add('active');

    // Cambia el estado activo de los botones de las pestañas
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => button.classList.remove('active'));
    document.querySelector(`[data-tab='${tabName}']`).classList.add('active');
}

// Función para limpiar tareas completadas
function clearCompleted() {
    const checkboxes = document.querySelectorAll('.task-item input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            checkbox.closest('.task-item').style.display = 'none'; // Oculta la tarea completada
        }
    });
}

// Función para agregar tareas
function addTask(tab) {
    // Obtén el campo de entrada y el texto de la tarea
    const taskInput = document.getElementById(`taskInput${tab.charAt(0).toUpperCase() + tab.slice(1)}`);
    const taskText = taskInput.value.trim();

    // Verifica que el campo no esté vacío
    if (taskText === "") {
        alert("Por favor, escribe una tarea.");
        return;
    }

    // Crea un nuevo elemento de tarea
    const taskItem = document.createElement('div');
    taskItem.className = 'task-item';

    // Crea el checkbox y la etiqueta
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'task';

    const label = document.createElement('label');
    label.appendChild(checkbox); // Agrega el checkbox dentro del label
    label.appendChild(document.createTextNode(taskText)); // Agrega el texto de la tarea

    // Crea el botón de eliminar
    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'delete-button';
    deleteButton.textContent = '🗑️';
    deleteButton.onclick = function () {
        deleteTask(this);
    };

    // Agrega el label y el botón de eliminar al elemento de tarea
    taskItem.appendChild(label);
    taskItem.appendChild(deleteButton);

    // Agrega la nueva tarea a la lista de tareas correspondiente
    const taskList = document.getElementById(`taskList${tab.charAt(0).toUpperCase() + tab.slice(1)}`);
    taskList.appendChild(taskItem);

    // Limpia el campo de entrada
    taskInput.value = "";
}

// Función para eliminar tareas
function deleteTask(button) {
    const taskItem = button.closest('.task-item'); // Encuentra el contenedor de la tarea
    taskItem.remove(); // Elimina la tarea
}