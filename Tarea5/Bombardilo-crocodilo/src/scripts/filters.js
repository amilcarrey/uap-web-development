document.querySelectorAll('[data-filter]').forEach(button => {
	button.addEventListener('click', async (e) => {
		e.preventDefault();

		const filter = e.target.dataset.filter;
		const res = await fetch(`/get-tasks?filter=${filter}`);
		const tasks = await res.json();

		const list = document.getElementById('task-list');
		list.innerHTML = '';

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
			list.appendChild(li);
		});
	});
});
