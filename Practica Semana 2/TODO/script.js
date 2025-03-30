// Contador para nombres de nuevas pestañas
// Variables globales
let tabCounter = 1;

// Función para agregar una nueva pestaña
function addNewTab() {
    const tabName = `newTab${tabCounter}`;
    tabCounter++;

    const newTabButton = document.createElement('button');
    newTabButton.className = 'tab-button';
    newTabButton.textContent = `Tab ${tabCounter}`;
    newTabButton.setAttribute('data-tab', tabName);
    newTabButton.onclick = () => openTab(tabName);

    const tabsContainer = document.querySelector('.tabs');
    tabsContainer.insertBefore(newTabButton, document.querySelector('.add-tab-button'));

    const newTabContent = document.createElement('section');
    newTabContent.id = tabName;
    newTabContent.className = 'tab-content';

    const tabTitle = document.createElement('h3');
    tabTitle.textContent = `Tab ${tabCounter}`;
    tabTitle.addEventListener('click', () => makeTitleEditable(tabTitle, newTabButton));
    newTabContent.appendChild(tabTitle);

    const tooltip = document.createElement('span');
    tooltip.className = 'tooltip';
    tooltip.textContent = 'Click aquí para cambiar el nombre';
    tabTitle.appendChild(tooltip);
    setTimeout(() => tooltip.remove(), 3000);

    const inputContainer = document.createElement('div');
    inputContainer.className = 'input-container';

    const taskInput = document.createElement('input');
    taskInput.type = 'text';
    taskInput.placeholder = 'What do you need to do?';
    taskInput.className = 'task-input';
    taskInput.id = `taskInput${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`;
    taskInput.addEventListener('keypress', (e) => handleAddTask(tabName, e));

    const addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.className = 'add-button';
    addButton.textContent = 'ADD';
    addButton.onclick = () => handleAddTask(tabName);

    inputContainer.appendChild(taskInput);
    inputContainer.appendChild(addButton);
    newTabContent.appendChild(inputContainer);

    const taskList = document.createElement('div');
    taskList.className = 'task-list';
    taskList.id = `taskList${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`;
    newTabContent.appendChild(taskList);

    const filterButtons = document.createElement('div');
    filterButtons.className = 'filter-buttons';
    ['all', 'active', 'completed'].forEach(filter => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `filter-button ${filter === 'all' ? 'active' : ''}`;
        button.textContent = filter.charAt(0).toUpperCase() + filter.slice(1);
        button.dataset.filter = filter;
        button.onclick = () => setupFilterButtons(tabName, filter);
        filterButtons.appendChild(button);
    });
    newTabContent.appendChild(filterButtons);

    const clearButton = document.createElement('button');
    clearButton.type = 'button';
    clearButton.className = 'clear-button';
    clearButton.textContent = 'Clear Completed';
    clearButton.onclick = clearCompleted;
    newTabContent.appendChild(clearButton);

    document.querySelector('main').appendChild(newTabContent);
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
    // Ocultar todas las pestañas
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');

    // Actualizar botones activos
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Aplicar filtro activo (no restaurar desde cero)
    const activeFilter = document.querySelector('.filter-button.active')?.dataset.filter || 'all';
    filterTasks(tabName, activeFilter);
}

// Función para limpiar tareas completadas
function clearCompleted() {
    saveOriginalState(); // Guardar estado antes de borrar
    const activeTab = document.querySelector('.tab-content.active').id;
    const taskList = document.getElementById(`taskList${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`);
    
    const checkboxes = taskList.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            checkbox.closest('.task-item').remove();
        }
    });
}

// Función para agregar tareas
function handleAddTask(tab, event) {
    if (event && event.key !== 'Enter' && event.type === 'keypress') return;
    if (event) event.preventDefault();
    addTask(tab);
}

function addTask(tab) {
    const taskInput = document.getElementById(`taskInput${tab.charAt(0).toUpperCase() + tab.slice(1)}`);
    const taskText = taskInput.value.trim();

    if (!taskText) {
        taskInput.style.borderColor = '#ff4d4d';
        setTimeout(() => taskInput.style.borderColor = '#ccc', 1000);
        return;
    }

    const taskItem = document.createElement('div');
    taskItem.className = 'task-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', () => {
        saveOriginalState(); // Guardar estado al marcar/desmarcar
    });

    const label = document.createElement('label');
    label.append(checkbox, document.createTextNode(taskText));

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'delete-button';
    deleteButton.textContent = '🗑️';
    deleteButton.onclick = () => deleteTask(this);

    taskItem.append(label, deleteButton);
    document.getElementById(`taskList${tab.charAt(0).toUpperCase() + tab.slice(1)}`).appendChild(taskItem);
    taskInput.value = "";
    saveOriginalState();
}

// Función para eliminar tareas
function deleteTask(button) {
    const taskItem = button.closest('.task-item'); // Encuentra el contenedor de la tarea
    taskItem.remove(); // Elimina la tarea
}

// Variable para almacenar el estado original de las tareas
let originalTasksState = {};

// Función para guardar el estado original de las tareas
function saveOriginalState() {
    const tabContents = document.querySelectorAll('.tab-content');
    originalTasksState = {}; // Reiniciar el estado global

    tabContents.forEach(tab => {
        const tabId = tab.id;
        originalTasksState[tabId] = [];

        const tasks = tab.querySelectorAll('.task-item');
        tasks.forEach(task => {
            originalTasksState[tabId].push({
                html: task.outerHTML,
                completed: task.querySelector('input[type="checkbox"]').checked // Guardar estado del checkbox
            });
        });
    });
}

// Función para aplicar filtros
function filterTasks(tabId, filterType) {
    const taskList = document.querySelector(`#${tabId} .task-list`);
    const tasks = taskList.querySelectorAll('.task-item');
    
    tasks.forEach(task => {
        const isCompleted = task.querySelector('input[type="checkbox"]').checked;
        
        // Mostrar todas primero
        task.style.display = 'flex';
        
        switch(filterType) {
            case 'all':
                // Ya están todas visibles
                break;
            case 'active':
                if(isCompleted) task.style.display = 'none';
                break;
            case 'completed':
                if(!isCompleted) task.style.display = 'none';
                break;
        }
    });
}

// Función para manejar el click en los botones de filtro
function setupFilterButtons() {
    document.querySelectorAll('.filter-button').forEach(button => {
        button.addEventListener('click', function() {
            // Remover clase active de todos los botones
            document.querySelectorAll('.filter-button').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Añadir clase active al botón clickeado
            this.classList.add('active');
            
            // Obtener el tab activo
            const activeTab = document.querySelector('.tab-content.active').id;
            const filterType = this.getAttribute('data-filter');
            
            // Aplicar filtro
            filterTasks(activeTab, filterType);
        });
    });
}

// Función para restaurar todas las tareas
function restoreAllTasks() {
    const activeTab = document.querySelector('.tab-content.active').id;
    const taskList = document.querySelector(`#${activeTab} .task-list`);
    const activeFilter = document.querySelector('.filter-button.active')?.getAttribute('data-filter');
    
    // Solo restaurar si estamos en el filtro "all" o no hay filtro activo
    if(!activeFilter || activeFilter === 'all') {
        if(originalTasksState[activeTab]) {
            taskList.innerHTML = '';
            originalTasksState[activeTab].forEach(task => {
                taskList.insertAdjacentHTML('beforeend', task.html);
            });
        }
    }
    
    // Reactivar eventos
    document.querySelectorAll('.delete-button').forEach(btn => {
        btn.onclick = function() { deleteTask(this); };
    });
    
    // Asegurar que el botón "All" está activo
    document.querySelectorAll('.filter-button').forEach(btn => {
        btn.classList.remove('active');
        if(btn.getAttribute('data-filter') === 'all') {
            btn.classList.add('active');
        }
    });
    
    // Aplicar filtro actual si existe
    if(activeFilter && activeFilter !== 'all') {
        filterTasks(activeTab, activeFilter);
    }
}

// Guardar estado original al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    // Guardar estado inicial
    saveOriginalState();
    
    // Configurar botones de filtro
    setupFilterButtons();
    
    // Configurar eventos para checkboxes existentes
    document.querySelectorAll('.task-item input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            saveOriginalState();
        });
    });
});

// Delegación de eventos para los checkboxes
document.addEventListener('change', function(e) {
    if(e.target && e.target.matches('.task-item input[type="checkbox"]')) {
        const activeTab = document.querySelector('.tab-content.active').id;
        const activeFilter = document.querySelector('.filter-button.active')?.getAttribute('data-filter');
        
        // Guardar el nuevo estado
        saveOriginalState();
        
        // Si hay un filtro activo, reaplicarlo
        if(activeFilter && activeFilter !== 'all') {
            filterTasks(activeTab, activeFilter);
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    saveOriginalState();
    setupFilterButtons();
});