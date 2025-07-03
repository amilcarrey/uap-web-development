import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import Register from './pages/Register.tsx';
import Login from './pages/Login.tsx';
import Boards from './pages/Boards.tsx';
import Tasks from './pages/Tasks.tsx';
import Permissions from './pages/Permissions.tsx';
import Settings from './pages/Settings.tsx';
import './css/styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/boards" element={<Boards />} />
        <Route path="/boards/:boardId/tasks" element={<Tasks />} />
        <Route path="/boards/:boardId/permissions" element={<Permissions />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);