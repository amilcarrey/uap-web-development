import { TaskForm } from "./components/TaskForm";
import { FilterButtons } from "./components/FilterButtons";
import { TaskList } from "./components/TaskList";
import { ClearCompleted } from "./components/ClearCompleted";

function App() {
  return (
    <div className="min-h-screen bg-[#f6f2ec] flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold mb-6">
        TO<span className="text-orange-500">DO</span>
      </h1>

      <div className="bg-white shadow-md rounded-xl p-6 w-[90%] max-w-xl">
        <TaskForm />
        <FilterButtons />
        <TaskList />
        <ClearCompleted />
      </div>
    </div>
  );
}

export default App;
