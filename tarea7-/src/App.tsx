import './App.css'
import { TareaList } from './components/TareaList';
import { Header } from './components/Header';
import { NuevaTareaForm } from './components/NuevoTareaForm';
import { Toaster } from 'sonner';
import { useAtomValue, useSetAtom } from 'jotai';
import { configAtom, configContentAtom } from './components/store/tareasStore';
import { Configuracion } from './components/Configuracion';

function App() {
  const toggleConfig = useAtomValue(configAtom)
  const render = () => {
    if (!toggleConfig) {
      return (
        <>
          <NuevaTareaForm />
          <TareaList />
        </>
      )
    } else{
      return(
            <><Configuracion/></>
      )
    }
  }
  return (
    <>
      <Toaster />
      <Header />
      {render()}
    </>)



}
export default App
