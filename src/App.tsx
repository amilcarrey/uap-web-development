import TaskManager from "./components/TaskManager";

function App() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f5f5dc] p-2">
      <main className=" w-[50vw] min-h-[60vh] bg-[#efd8a4] p-8 rounded-lg shadow-lg">
        <TaskManager />
      </main> 
    </div>
  );
}

export default App;