import './App.css'
import { Header } from './components/Header'
import { Outlet } from "react-router-dom";
import { useBoards } from './hooks/useBoards';

export function App() {
  // Query de boards (para que esté disponible en toda la app)
  useBoards();

  return (
    <>
      <div className='flex flex-col min-h-screen'>
        <Header/>
        <main className='flex flex-col items-center bg-white flex-grow'>
          <Outlet />
        </main>
      </div>      
    </>
  )
}

export default App