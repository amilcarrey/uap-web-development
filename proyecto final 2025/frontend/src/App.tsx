import TaskManager from "./components/TaskManager";
import SettingsPage from "./components/SettingsPage";
import RequireAuth from "./components/RequireAuth";
import { useSettings } from "./context/settings-context";

function App() {
  const { showSettingsPage } = useSettings();

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f5f5dc] p-2">
      <main className="w-[50vw] min-h-[60vh] bg-[#efd8a4] p-8 rounded-lg shadow-lg">
        <RequireAuth>
          {showSettingsPage ? <SettingsPage /> : <TaskManager />}
        </RequireAuth>
      </main>
    </div>
  );
}

export default App;
