export function renderTodos(todos: any[]) {
    console.log("RENDERING TODOS");

  
    const ul = document.querySelector("ul");
    if (!ul) return;
  
    ul.innerHTML = ""; // Borra todo lo que haya en la lista
  
    todos.forEach(todo => {
      const li = document.createElement("li");

      li.className = "flex mt-2 items-center p-2";

      li.innerHTML = `
        <form action="/api/backend" method="POST" class="inline">
        <button type="submit" name="action" value="toggle" class="flex-shrink-0 bg-transparent border-2 border-gray-500 rounded-full py-2 px-3 mr-5 transition-all duration-500 cursor-pointer ${todo.completed ? 'border-orange-500 border-2 text-orange-500 font-extrabold' : 'text-transparent'}" title="Toggle">
          ✓
        </button>
        <input type="hidden" name="id" value="${todo.id}" />
        <input type="hidden" name="action" value="toggle" />
      </form>
      
      <p class="flex-grow font-sans text-lg pb-2 mb-0 border-b border-[rgb(116,178,202)] transition-all duration-500 ${todo.completed ? 'line-through opacity-50 text-[rgb(158,151,151)]' : ''}">${todo.text}</p>
      
      <form action="/api/backend" method="POST" class="inline">
        <button type="submit" name="action" value="delete" class="flex-shrink-0 bg-transparent border-0 text-orange-500 text-base px-2 cursor-pointer" title="Delete">
          <i class="fa-solid fa-trash"></i>
        </button>
        <input type="hidden" name="id" value="${todo.id}" />
        <input type="hidden" name="action" value="delete" />
      </form>
      `;
  
      ul.appendChild(li); // Agrega el <li> a la lista
    });
  }