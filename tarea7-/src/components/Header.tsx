import listo from '../assets/task.png'
import config from '../assets/config.png'
import { configAtom } from './store/tareasStore';
import { useSetAtom } from 'jotai';
import { Tableros } from './TableroList';

export function Header() { 
  const setConfig = useSetAtom(configAtom);
  function handleConfig()
  {
    setConfig(true)
  }

  return (    
    <>
      <header className="bg-[#b1e4e4]">
        <div id="title" className="h-24 flex justify-center items-center">
          <h1 className="flex justify-center items-center text-2xl font-bold w-9/10">
            tasking.com
            <img src={listo} alt="imagen de tareas" className="h-8" />

          </h1>

          <button className=' flex justify-end' onClick={() => handleConfig()}>

            <img src={config} className='h-8' />
          </button>
        </div>
      </header>
      <Tableros/>
    </>
  )
}