import TaskManager from "./components/TaskManager";

function App() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f5f5dc] p-4">
      <main className="w-full max-w-[50vw] min-h-[50vh] bg-[#efd8a4] p-8 rounded-lg shadow-lg">
        <TaskManager />
      </main>
    </div>
  );
}

export default App;