import { Outlet } from "@tanstack/react-router";

import Toast from './components/Toast';

function App() {

  return (
    <>
      <div className=' h-max flex flex-col gap-10 items-center justify-start w-full bg-gray-900'>
        <Outlet/>
         <Toast /> 
      </div>

    </>
  )
}

export default App
