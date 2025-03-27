document.addEventListener("DOMContentLoaded", function () {
    const forms = document.querySelectorAll("form");

    forms.forEach(form => {
        form.addEventListener("submit", function (event) {
            event.preventDefault(); // Evita que el formulario recargue la página

            const input = this.querySelector("input"); // Captura el input dentro del formulario
            const lista = this.nextElementSibling; // Captura el <ul> siguiente al formulario
            const tareaTexto = input.value.trim(); // Obtiene el texto del input sin espacios extras

            if (tareaTexto !== "") {
                const nuevaTarea = document.createElement("li");

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";

                nuevaTarea.appendChild(checkbox);
                nuevaTarea.appendChild(document.createTextNode(" " + tareaTexto));

                lista.appendChild(nuevaTarea); // Agrega la nueva tarea a la lista
                input.value = ""; // Limpia el input
            }
        });
    });
});