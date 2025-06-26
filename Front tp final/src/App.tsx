import "./App.css";
import { 
  //Link, 
  Outlet } from "@tanstack/react-router";
import ToastContainer from "./components/ToastContainer";

export function App() {
  return (
    <>
      <Outlet />
      <ToastContainer />
    </>
  );
}
