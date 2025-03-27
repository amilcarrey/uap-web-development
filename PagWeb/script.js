document.addEventListener("DOMContentLoaded", function () {
    const forms = document.querySelectorAll("form");

    forms.forEach(form => {
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const input = this.querySelector("input");
            const lista = this.nextElementSibling;
            const tareaTexto = input.value.trim();

            if (tareaTexto !== "") {
                const nuevaTarea = document.createElement("li");

                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.addEventListener("change", function () {
                    if (this.checked) {
                        nuevaTarea.classList.add("completada");
                    } else {
                        nuevaTarea.classList.remove("completada");
                    }
                });

                const eliminarBtn = document.createElement("button");
                eliminarBtn.textContent = "❌";
                eliminarBtn.classList.add("eliminar-btn");
                eliminarBtn.addEventListener("click", function () {
                    nuevaTarea.remove();
                });

                nuevaTarea.appendChild(checkbox);
                nuevaTarea.appendChild(document.createTextNode(" " + tareaTexto));
                nuevaTarea.appendChild(eliminarBtn);

                lista.appendChild(nuevaTarea);
                input.value = "";
            }
        });
    });

    const filtroBtns = document.querySelectorAll(".filtros button");

    filtroBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const tipo = btn.dataset.filtro;
            document.querySelectorAll("ul").forEach(ul => {
                ul.querySelectorAll("li").forEach(li => {
                    const esCompleta = li.classList.contains("completada");
                    li.style.display =
                        tipo === "todas" ||
                        (tipo === "completas" && esCompleta) ||
                        (tipo === "incompletas" && !esCompleta)
                            ? ""
                            : "none";
                });
            });
        });
    });

    const deleteSelectedBtn = document.getElementById("deleteSelected");

    deleteSelectedBtn.addEventListener("click", () => {
        document.querySelectorAll("ul").forEach(ul => {
            ul.querySelectorAll("li").forEach(li => {
                const checkbox = li.querySelector("input[type='checkbox']");
                if (checkbox && checkbox.checked) {
                    li.remove(); // Elimina las seleccionadas
                } else if (li.classList.contains("completada")) {
                    li.remove(); // Elimina las completadas
                }
            });
        });
    });
});