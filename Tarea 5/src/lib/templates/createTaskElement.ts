/* 
¿Por qué poner createTaskElement en lib/?
Porque esa función no es un componente visual (no es .astro) ni tiene lógica de backend. Es simplemente una función auxiliar de frontend que se encarga de construir un pedazo de HTML dinámicamente. Y ese tipo de funciones viven muy bien en una carpeta llamada lib/ (de library, biblioteca).

¿Qué es lib/?
En muchos proyectos bien estructurados, la carpeta lib/ se usa para guardar funciones utilitarias, helpers, lógicas reutilizables que pueden usarse desde cualquier parte del proyecto. No son componentes, no son rutas, no son datos... son herramientas que usás.


El template se importa a los archivos .astro que necesiten generar un elemnto desde la parte del cliente, y no es necesario usarlo por ejemplo en "TaskItem" porque ya genera el elemto desde la parte del servidor
*/


// src\lib\templates\taskTemplete.ts

export interface Task{
    id: string;
    text: string;
    completed: boolean;
    tabId: string;
}

export function createTaskElement(task: Task): HTMLLIElement{
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.dataset.taskId = task.id;

    // --- Formulario para marcar como completada una tarea ---
    const taskForm = document.createElement('form');
    taskForm.method = 'POST';
    taskForm.action = '/api/tasks';
    taskForm.className = 'task-form';

    taskForm.innerHTML = `
        <input type="hidden" name="action" value="toggle" />
        <input type="hidden" name="taskId" value="${task.id}" />
        <input type="hidden" name="tabId" value="${task.tabId}" />
        <input type="hidden" name="completed" value="${task.completed ? 'true' : 'false'}" />
        <label class="form-label">
        <button type="submit" class="form-button"></button>
        <span>${task.text}</span>
        </label>
    `;

    // --- Formulario para eliminar la tarea ---
    const deleteForm = document.createElement('form');
    deleteForm.method = 'POST';
    deleteForm.action = '/api/tasks';
    deleteForm.className = 'delete-form';

    deleteForm.innerHTML = `
        <input type="hidden" name="action" value="delete" />
        <input type="hidden" name="taskId" value="${task.id}" />
        <input type="hidden" name="tabId" value="${task.tabId}" />
        <button type="submit" class="delete-button">🗑️</button>
    `;

    li.appendChild(taskForm);
    li.appendChild(deleteForm);

    return li;
}