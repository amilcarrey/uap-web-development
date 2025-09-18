import { ToastContainer } from "./components/ToastContainer";
import { Outlet } from "@tanstack/react-router";


export function App() {  

  return (
    <>
      <ToastContainer />
      <header>
      {/* Título principal con un diseño simple donde "TO" y "DO" están separados para dar énfasis */}
        <h1 className="font-bold text-center text-[32px] text-[#333] my-4"><span className="text-[#e08e36]">TO</span>DO</h1>
      </header>
      
      <Outlet />
    </>
  );
}

export default App;