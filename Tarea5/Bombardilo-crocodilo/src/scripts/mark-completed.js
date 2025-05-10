document.addEventListener("DOMContentLoaded", function () {
    const buttonsToggle = document.querySelectorAll('button[name="action"][value="toggle"]');
  
    buttonsToggle.forEach(button => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        const form = button.closest('form');
        const id = form.querySelector('input[name="id"]').value;
  
        fetch(`/`, {
          method: "POST",
          body: new URLSearchParams({
            action: "toggle",
            id: id,
          }),
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            const taskItem = document.getElementById(`task-${id}`);
            const span = taskItem.querySelector("span");
            if (data.task.completed) {
              span.classList.add("line-through", "text-gray-500");
              button.textContent = "✅";
            } else {
              span.classList.remove("line-through", "text-gray-500");
              button.textContent = "⬜";
            }
          }
        });
      });
    });
  });
  