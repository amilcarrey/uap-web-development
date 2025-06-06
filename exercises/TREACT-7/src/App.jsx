// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import BoardPage from './pages/BoardPage';
import SettingsPage from './pages/SettingsPage';
import HomePage from './pages/HomePage';
import ToastContainer from './components/ToastContainer';
import './index.css';

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/boards/:boardId" element={<BoardPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
    </div>
  );
}
