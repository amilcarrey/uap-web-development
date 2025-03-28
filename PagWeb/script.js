document.addEventListener("DOMContentLoaded", function () {
  const forms = document.querySelectorAll("form");

  forms.forEach((form) => {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const input = this.querySelector("input");
      const lista = this.nextElementSibling;
      const tareaTexto = input.value.trim();

      if (tareaTexto !== "") {
        const nuevaTarea = document.createElement("li");

        nuevaTarea.classList.add("animate__animated", "animate__fadeInDown");
        nuevaTarea.addEventListener("animationend", () => {
          nuevaTarea.classList.remove(
            "animate__animated",
            "animate__fadeInDown"
          );
        });

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.addEventListener("change", function () {
          nuevaTarea.classList.toggle("completada", this.checked);
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

  filtroBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tipo = btn.dataset.filtro;

      document.querySelectorAll("ul").forEach((ul) => {
        ul.querySelectorAll("li").forEach((li) => {
          const esCompleta = li.classList.contains("completada");
          const mostrar =
            tipo === "todas" ||
            (tipo === "completas" && esCompleta) ||
            (tipo === "incompletas" && !esCompleta);

          if (mostrar) {
            if (li.style.display === "none") {
              li.style.display = "";
              li.classList.add("animate__animated", "animate__fadeIn");
              li.addEventListener(
                "animationend",
                () => {
                  li.classList.remove("animate__animated", "animate__fadeIn");
                },
                { once: true }
              );
            }
          } else {
            li.classList.add("animate__animated", "animate__fadeOut");
            li.addEventListener(
              "animationend",
              () => {
                li.style.display = "none";
                li.classList.remove("animate__animated", "animate__fadeOut");
              },
              { once: true }
            );
          }
        });
      });
    });
  });

  const deleteSelectedBtn = document.getElementById("deleteSelected");

  deleteSelectedBtn.addEventListener("click", () => {
    document.querySelectorAll("ul").forEach((ul) => {
      ul.querySelectorAll("li").forEach((li) => {
        const checkbox = li.querySelector("input[type='checkbox']");
        if (checkbox && checkbox.checked) {
          li.remove();
        }
      });
    });
  });
});