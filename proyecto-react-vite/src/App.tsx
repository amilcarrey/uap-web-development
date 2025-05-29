import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import FilterButtons from "./components/FilterButtons";

function App() {
  return (
    <div className="min-h-screen bg-white font-sans m-0 p-0">
      <h1 className="text-center text-black text-5xl my-5">Tareas a realizar</h1>

      <div className="flex justify-center gap-4 m-4 w-full">
        <button className="bg-pink-300 text-black py-4 px-10 border-none cursor-pointer w-1/4 text-xl hover:border-b-2 border-black">
          Personal
        </button>
        <button className="bg-pink-300 text-black py-4 px-10 border-none cursor-pointer w-1/4 text-xl hover:border-b-2 border-black">
          Profesional
        </button>
      </div>

      <main className="w-full flex flex-col items-center gap-6">
        <FilterButtons />
        <TaskForm />
        <TaskList />
      </main>
    </div>
  );
}

export default App;
