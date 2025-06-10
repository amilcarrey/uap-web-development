// src/pages/HomePage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBoards } from '../hooks/useBoards';

export default function HomePage() {
  const navigate = useNavigate();
  const { data: boards, isLoading } = useBoards();

  useEffect(() => {
    if (!isLoading && boards && boards.length > 0) {
      navigate(`/board/${boards[0].id}`);
    }
  }, [isLoading, boards, navigate]);

  if (isLoading) return <p>Cargando tableros…</p>;
  if (boards.length === 0) {
    return <p className="text-center mt-8">No hay tableros. Crea alguno arriba.</p>;
  }

  return null;
}
