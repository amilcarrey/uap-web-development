import { RouterProvider } from "@tanstack/react-router";
import router from "./router";
import Modal from "./components/modal";


function App() {

  return (
    <div className="font-sans bg-[rgba(247,242,245,0.848)] m-0 p-0 min-h-screen">
      <RouterProvider router={router} />
      <Modal/>
    </div>
  );
}

export default App;
