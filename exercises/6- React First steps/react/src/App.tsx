import { useState, useCallback, useEffect } from 'react'
import type{ TodoItem } from './types'
import './App.css'
import { Header } from './components/Header'
import { AddToDo } from './components/AddToDo'
import { FilterTasks } from './components/FilterTasks'
import { ToDoList } from './components/ToDoList'
import { ClearCompleted } from './components/ClearCompleted'


const BASE_URL = "http://localhost:4321/api";

function App() {
  const [todos, setTodo] = useState<TodoItem[]>([]);
  const [filter, setFilter] = useState<string>('all'); 

  const addTodo = useCallback(
    async (text: string) => {
    const response = await fetch(`${BASE_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, action: 'add' }),
    });
    const newTodo: TodoItem[] = await response.json();
    console.log(typeof newTodo[0]);
    console.log(newTodo);
    setTodo(newTodo);
  },
  [setTodo]
  );

  const deleteTodo = async (id: number) => {
      const response = await fetch(`${BASE_URL}/todos/${id}`, {
        method: 'POST',
        body: JSON.stringify({ action: 'delete' }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const newTodo: TodoItem[] = await response.json();
      setTodo(newTodo);
    };
    
    const toggleTodo = async (id: number) => {
      const response = await fetch(`${BASE_URL}/todos/${id}`, {
        method: 'POST',
        body: JSON.stringify({ action: 'toggle' }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const newTodos: TodoItem[] = await response.json();
      console.log(newTodos);
      setTodo(newTodos);
    }

  const clearCompletedTodos = async () => {
    const response = await fetch(`${BASE_URL}/todos`, {
      method: 'POST',
      body: JSON.stringify({ action: 'clearCompleted' }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const newTodos: TodoItem[] = await response.json();
    setTodo(newTodos);
  }

  useEffect(() => {
    console.log('useEffect');
    const fetchTodos = async () => {
      const response = await fetch(
        `${BASE_URL}/todos?filter=${filter}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
        
      );
      const filteredTodos: TodoItem[] = await response.json();
      //const data: {todos: TodoItem[]} = await response.json();
      setTodo(filteredTodos);
    }
    fetchTodos();
  }, [filter]);

  

  return (
    <>
      <div className='flex flex-col min-h-screen'>
          <Header/>
          <main className='flex flex-col items-center bg-white flex-grow'>
            <AddToDo addTodo={addTodo} />
            <div className='w-1/2 my-5 mt-2 p-2 bg-[rgba(241,236,230,255)] rounded-3xl'>
              <FilterTasks filter={filter} setFilter={setFilter} />
              <ToDoList
                todos={todos}
                deleteTodo={deleteTodo}
                toggleTodo={toggleTodo}
              />
              <ClearCompleted clearCompletedTodos={clearCompletedTodos} />

            </div>
          </main>
      </div>
    </>
  )

}




export default App
