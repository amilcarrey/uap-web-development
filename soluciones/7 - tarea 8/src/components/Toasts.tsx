import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Toasts() {
  return (
    <ToastContainer
      position="top-center"
      autoClose={2200}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      pauseOnHover
      draggable
      theme="colored"
    />
  );
}
