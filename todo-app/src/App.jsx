import { useState, useEffect } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText]     = useState('');
  const [filter, setFilter] = useState('all');

  // 1) Traer tareas al montar
  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(setTasks);
  }, []);

  // 2) Agregar tarea (botón y Enter)
  async function addTask() {
    if (!text.trim()) return;               // valida texto no vacío
    const newTask = { text, completed: false };
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(newTask)
    });
    const saved = await res.json();
    setTasks([...tasks, saved]);
    setText('');
  }

  // 3) Toggle completo/incompleto
  async function toggleTask(t) {
    const res = await fetch(`/api/tasks/${t.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ completed: !t.completed })
    });
    const updated = await res.json();
    setTasks(tasks.map(x => x.id === t.id ? updated : x));
  }

  // 4) Eliminar una tarea
  async function deleteTask(id) {
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    setTasks(tasks.filter(t => t.id !== id));
  }

  // 5) Clear completed
  async function clearCompleted() {
    // json-server no soporta DELETE en bulk, así que:
    const done = tasks.filter(t => t.completed);
    await Promise.all(done.map(t =>
      fetch(`/api/tasks/${t.id}`, { method:'DELETE' })
    ));
    setTasks(tasks.filter(t => !t.completed));
  }

  // 6) Filtros
  const filtered = tasks.filter(t => {
    if (filter==='active')    return !t.completed;
    if (filter==='completed') return  t.completed;
    return true;
  });

  return (
    <div style={{maxWidth:500,margin:'2rem auto',textAlign:'center'}}>
      <h1>Mi To-Do en React</h1>

      {/* Input + botón */}
      <div>
        <input
          value={text}
          onChange={e=>setText(e.target.value)}
          onKeyDown={e => e.key==='Enter' && addTask()}
          placeholder="Nueva tarea…"
        />
        <button onClick={addTask}>Agregar</button>
      </div>

      {/* Lista de tareas */}
      <ul style={{listStyle:'none',padding:0}}>
        {filtered.map(t => (
          <li key={t.id} style={{display:'flex',alignItems:'center',justifyContent:'space-between',margin:'0.5rem 0'}}>
            <label style={{flexGrow:1, textDecoration: t.completed ? 'line-through' : 'none'}}>
              <input
                type="checkbox"
                checked={t.completed}
                onChange={()=>toggleTask(t)}
              />
              {' '}{t.text}
            </label>
            <button onClick={()=>deleteTask(t.id)}>❌</button>
          </li>
        ))}
      </ul>

      {/* Botones de filtro */}
      <div style={{margin:'1rem 0'}}>
        {['all','active','completed'].map(f => (
          <button
            key={f}
            onClick={()=>setFilter(f)}
            style={{fontWeight: filter===f ? 'bold':'normal',margin:'0 0.5rem'}}
          >
            {f==='all'?'Todas': f==='active'?'Incompletas':'Completas'}
          </button>
        ))}
      </div>

      {/* Clear */}
      <button onClick={clearCompleted}>Clear Completed</button>
    </div>
  );
}

export default App;
