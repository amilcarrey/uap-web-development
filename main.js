
function agregarTarea() {
    var form = document.getElementById("entrada");
    var lista_tareas = document.getElementById("tasklist");
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        var task = document.getElementById("tarea");
        if (task.value.length >= 1) {
            var nueva_tarea = document.createElement('div');
            nueva_tarea.classList = 'task';
            nueva_tarea.innerHTML = `<li> <button>check</button> <p>${task.value}</p> </li>  <button onclick=eliminarTarea() class = "dlt-btn"> <img src="tacho.png" height="15px" class="ej"></button>`;
            lista_tareas.append(nueva_tarea);
            alert('Tarea agregada');
            task.value = '';
        } else {
            alert("Por favor ingrese una tarea válida");
        }
    })
}

function completarTarea() {
    document.addEventListener("click", function (e) {
        if (e.target.classList == 'cmplt-btn') {
            var tarea = e.target.closest(".task");
        }
        tarea.classList.toggle("completada");
    })
}

function eliminarTarea() {
            document.addEventListener("click", function (e) {
                if (e.target.classList == 'dlt-btn') {
                    var tarea = e.target.closest(".task");
                    if (tarea) { tarea.remove(); }
                }
            })

        }

function eliminarCompletadas() {
            var tareas = document.querySelectorAll('.completada')
            console.log(tareas);
            tareas.forEach(x => x.remove());
        }

function mostrarCompletadas() {
            var tareas = document.querySelectorAll('.task')
            tareas.forEach(x => x.classList = 'oculto')
            var tareasc = document.querySelectorAll('.ocultoc')
            tareasc.forEach(x => x.classList = 'completada')
        }

function mostrarFaltantes() {
            var tareasc = document.querySelectorAll('.completada')
            tareasc.forEach(x => x.classList = 'ocultoc')
            var tareas = document.querySelectorAll('.oculto')
            tareas.forEach(x => x.classList = 'task')
        }

function mostrarTodas() {
            var tareasc = document.querySelectorAll('.ocultoc')
            tareasc.forEach(x => x.classList = 'completada')
            var tareas = document.querySelectorAll('.oculto')
            tareas.forEach(x => x.classList = 'task')

        }