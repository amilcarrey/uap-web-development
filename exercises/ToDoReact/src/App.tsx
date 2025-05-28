import TaskManager from "./components/taskManager";
import { Toaster } from "react-hot-toast";
import Modal from "./components/modal";

function App() {
  const url = new URL(window.location.href);
  const filtro = url.searchParams.get("filtro") as "completadas" | "pendientes" | null;

  return (
    <div className="font-sans bg-[rgba(247,242,245,0.848)] m-0 p-0 min-h-screen">
      <Toaster position="top-right" />
      <TaskManager filtro={filtro ?? undefined} />
      <Modal />
    </div>
  );
}

export default App;
