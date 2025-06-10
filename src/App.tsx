import TaskManager from "./components/TaskManager";
import SettingsPage from "./components/SettingsPage";
import { useSettings } from "./context/settings-context";

function App() {
  const { showSettingsPage } = useSettings(); // 👈 controlás si mostrar TaskManager o SettingsPage

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f5f5dc] p-2">
      <main className="w-[50vw] min-h-[60vh] bg-[#efd8a4] p-8 rounded-lg shadow-lg">
        {showSettingsPage ? <SettingsPage /> : <TaskManager />}
      </main>
    </div>
  );
}


export default App;