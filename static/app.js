document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#add-form");
  const input = form.querySelector("input[name='task']");
  const taskList = document.getElementById("task-list");

  if (!form || !input || !taskList) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const task = input.value.trim();
    if (!task) return;
    const res = await fetch("/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task })
    });
    const data = await res.json();
    const li = document.createElement("li");
    li.className = "flex items-center gap-2 bg-gray-100 px-4 py-2 rounded justify-between";
    li.innerHTML = `
      <form method="post" action="/toggle/${data.id}" class="flex-1 flex gap-2 items-center">
        <input type="checkbox" onchange="this.form.submit()" class="w-5 h-5">
        <span class="flex-1 text-left">${data.text}</span>
      </form>
      <form method="post" action="/delete/${data.id}">
        <button class="hover:scale-110 transition-transform">🗑️</button>
      </form>
    `;
    taskList.appendChild(li);
    input.value = "";
    input.focus();
  });
});
