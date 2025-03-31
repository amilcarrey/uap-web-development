/*Cuando se apriete el botón de add, validar que se haya ingresado texto
 en el input. Agregar una nueva tarea incompleta con ese texto y borrar el input. */

function agrearTarea(){
    const agregar = document.getElementById('agregar');
    const texto = agregar.value.trim();    // para asegurarse que no sean solo espacios en blanco lo unico que agrega

    if (texto){ // si texto no es vacio
       const listado = document.getElementById('checklist'); // nos traemos el checklist

        const nuevaTarea = document.createElement('li');
        // con esto le decimos que adapte la estructura que teniamos en el html
        nuevaTarea.innerHTML = `
        <button type="button" class="check-btn"><i class="fa-regular fa-circle"></i></button>
        <p class="delete">${texto}</p>
        <button type="button" class="delete-btn"><i class="fa-solid fa-trash"></i></button>
    `;  
        //por ultimo, agregamos la nueva tarea a la lista, apend chil para q se vaya al final 
        listado.appendChild(nuevaTarea);

        //sobreescribir (borrar) el texto del input
        agregar.value = '';
    }else{
        alert('Por favor, ingresa un texto válido para la tarea');
    }
}

/* Realizar lo mismo cuando se apriete la tecla Enter mientras
 se escribe en el input. (Puntos extra si lo hacen con 1 solo evento
 los 2). */

document.getElementById('taskForm').addEventListener('submit', (event) => {
    event.preventDefault(); // pa que no se recargue
    agrearTarea();
});

/* Capacidad de completar y descompletar una tarea al clickear en su correspondiente checkbox. */

    // iteramos con .forEach para recorrer cada botón
    document.querySelector('#checklist').addEventListener('click', (event) => {
        const btn = event.target.closest('.check-btn'); // Buscar el botón más cercano
        if (btn) {
            const icon = btn.querySelector('i'); // Obtener el ícono dentro del botón
            if (icon.classList.contains('fa-circle')) {
                icon.classList.remove('fa-circle');
                icon.classList.add('fa-circle-check'); // Marca como completo
            } else {
                icon.classList.remove('fa-circle-check');
                icon.classList.add('fa-circle'); // Marca como incompleto
            }
        }
    });
    
    

/* Capacidad de eliminar una tarea de la lista. */
document.querySelector('#checklist').addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn') || event.target.closest('.delete-btn')) { // Si se hace clic en el botón de eliminar
        const li = event.target.closest('li'); 
        li.remove(); 
    }
});

/* Eliminar todas las tareas ya completadas al clickear el botón de Clear Completed. */
document.querySelector('.limpiar').addEventListener('click', () => {
    const tareaCompletada = document.querySelectorAll('.fa-circle-check');
    tareaCompletada.forEach(icon => {
        const li = icon.closest('li'); //para buscar el li que contiene el icono
        li.remove();
    });
});

/* Agregar botones de filtro que permitan ver todas las tareas, las incompletas y las completas. Prestar atención que si se aplica un filtro, no se pierdan datos y se pueda volver a un estado anterior. */

const filtroTodas = document.querySelector('.todo'); 
const filtroCompletas = document.querySelector('.completado'); 
const filtroIncompletas = document.querySelector('.incompleto'); 

// todas
filtroTodas.addEventListener('click', () => {
    const tareas = document.querySelectorAll('#checklist li');
    tareas.forEach(tarea => {
        tarea.style.display = 'flex'; 
    });
});

// completas
filtroCompletas.addEventListener('click', () => {
    const tareas = document.querySelectorAll('#checklist li');
    tareas.forEach(tarea => {
        const icono = tarea.querySelector('.fa-circle-check');
        if (icono) {
            tarea.style.display = 'flex'; 
        } else {
            tarea.style.display = 'none'; 
        }
    });
});

// incompletas
filtroIncompletas.addEventListener('click', () => {
    const tareas = document.querySelectorAll('#checklist li');
    tareas.forEach(tarea => {
        const icono = tarea.querySelector('.fa-circle-check');
        if (!icono) {
            tarea.style.display = 'flex';
        } else {
            tarea.style.display = 'none'; 
        }
    });
});
