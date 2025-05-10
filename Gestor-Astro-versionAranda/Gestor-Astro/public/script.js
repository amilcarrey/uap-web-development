// public/script.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-reminder-form');
    const list = document.getElementById('remindersList');
    const template = document.getElementById('reminder-template');
    if (!form || !list || !template) {
      console.warn('Faltan elementos para el JS');
      return;
    }
  
    form.addEventListener('submit', ev => {
      ev.preventDefault();
      ev.stopPropagation();
      console.log('✅ Form submit interceptado');
  
      const input = form.querySelector('input[name="text"]');
      const text = input.value.trim();
      if (!text) return;
  
      fetch('/api/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ text })
      })
      .then(res => {
        if (!res.ok) return res.json().then(err => { throw err });
        return res.json();
      })
      .then(newReminder => {
        const clone = template.content.cloneNode(true);
  
        const completeForm = clone.querySelector('.toggle-reminder');
        completeForm.action = '/api/complete';
        clone.querySelector('input[name="id"]').value = newReminder.id;
        clone.querySelector('input[name="completed"]').value = String(!newReminder.completed);
  
        const checkbox = clone.querySelector('.checkbox-box');
        const textSpan = clone.querySelector('.reminder-text');
        textSpan.textContent = newReminder.text;
        if (newReminder.completed) {
          checkbox.classList.add('bg-rose-600','border-rose-600','text-white');
          textSpan.classList.add('line-through','text-gray-500');
        }
  
        const deleteForm = clone.querySelector('.delete-reminder');
        deleteForm.action = '/api/delete';
        clone.querySelector('.delete-reminder input[name="id"]').value = newReminder.id;
  
        list.prepend(clone);
        input.value = '';
      })
      .catch(err => {
        console.error('Error al crear recordatorio:', err);
      });
    });
  });
  