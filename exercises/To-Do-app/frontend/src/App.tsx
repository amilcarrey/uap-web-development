import { Routes, Route } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Boards } from './pages/Boards';
import { Board } from './pages/Board';

export default function App() {
  return (
    <div>
      <NavBar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/boards" element={<Boards />} />
          <Route path="/boards/:id" element={<Board />} />
        </Routes>
      </div>
    </div>
  );
}