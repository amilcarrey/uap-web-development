import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { SearchPage } from './pages/SearchPage'
import { BookDetailPage } from './pages/BookDetailPage'

import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/book/:id" element={<BookDetailPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)