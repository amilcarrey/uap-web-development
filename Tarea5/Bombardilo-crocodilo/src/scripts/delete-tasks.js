document.addEventListener("DOMContentLoaded", function () {
    const buttonsDelete = document.querySelectorAll('button[name="action"][value="delete"]');
  
    buttonsDelete.forEach(button => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        const form = button.closest('form');
        const id = form.querySelector('input[name="id"]').value;
  
        fetch(`/`, {
          method: "POST",
          body: new URLSearchParams({
            action: "delete",
            id: id,
          }),
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            const taskItem = document.getElementById(`task-${id}`);
            taskItem.remove();
          }
        });
      });
    });
  });
  