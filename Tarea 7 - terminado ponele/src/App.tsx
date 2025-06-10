import "./App.css";
import { Link, Outlet } from "@tanstack/react-router";

export function App() {
  return (
    <>
      <h1>Hello World</h1>
      <Outlet /> 
    </>
  );
}
