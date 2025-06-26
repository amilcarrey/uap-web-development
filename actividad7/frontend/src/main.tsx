import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { Toaster } from 'react-hot-toast'; 
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <>
          <App />
          <Toaster position="top-right" reverseOrder={false} /> {/* ✅ Toaster visible */}
        </>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
