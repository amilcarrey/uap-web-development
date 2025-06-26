  import React from "react";
  import { Routes, Route, Navigate } from "react-router-dom";
  import { PrivateRoute } from "./components/Ruta";
  import  LoginForm  from "./components/Login";
  import TableroPage from "./pages/tablero/tablero[id]";
  import CrearTableroPage from "./pages/ToDoPagina"; 
  import { ToastContainer } from "./components/ContenedorNotificaciones";
  import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
  import  RegisterForm  from "./components/Register";
import ToDoRedirectPage from "./pages/ToDoPagina";

  const queryClient = new QueryClient();

  const App = () => {
    return (
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route
            path="/tablero/:tableroId"
            element={
              <PrivateRoute>
                <TableroPage />
              </PrivateRoute>
            }
          />
          <Route
          path="/crear-tablero"
          element={
            <PrivateRoute>
              <CrearTableroPage />
            </PrivateRoute>
          }
        />
          <Route
            path="/to-do"
            element={
              <PrivateRoute>
                <ToDoRedirectPage />
              </PrivateRoute>
            }
          />
        </Routes>
        <ToastContainer />
      </QueryClientProvider>
    );
  };

  export default App;
