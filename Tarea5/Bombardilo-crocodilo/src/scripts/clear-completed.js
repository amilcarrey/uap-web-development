document.getElementById('clear-completed')?.addEventListener('click', async (event) => {
	event.preventDefault(); // <-- esto previene la recarga de página

	const res = await fetch('/clear-completed', {
		method: 'POST',
	});

	if (res.ok) {
		// Obtener el filtro actual
		const currentFilter = document.querySelector('[data-filter].bg-blue-600')?.dataset.filter || 'all';
		const taskList = document.getElementById('task-list');

		const tasksRes = await fetch(`/get-tasks?filter=${currentFilter}`);
		const tasks = await tasksRes.json();

		// Limpiar lista
		taskList.innerHTML = '';

		tasks.forEach(task => {
			const li = document.createElement('li');
			li.className = 'bg-gray-100 mb-2 p-5 rounded-lg flex items-center justify-between';
			li.innerHTML = `
				<form method="POST" class="inline" action-toggle>
					<input type="hidden" name="id" value="${task.id}" />
					<button type="submit" name="action" value="toggle">
						${task.completed ? "✅" : "⬜"}
					</button>
				</form>
				<span class="${task.completed ? "line-through text-gray-500" : ""}">
					${task.task_content}
				</span>
				<form method="POST" class="inline" action-delete>
					<input type="hidden" name="id" value="${task.id}" />
					<button type="submit" name="action" value="delete">🗑</button>
				</form>
			`;
			taskList.appendChild(li);
		});
	}
});
