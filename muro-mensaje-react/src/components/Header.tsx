import añadir from '../assets/añadir.png'
import listo from '../assets/task.png'

export function Header() {
    return (
        <>
                    <header className="bg-[rgb(177,228,228)]">
            <div id="title" className="h-24 flex justify-center items-center">
              <h1 className="flex items-center gap-2 text-2xl font-bold">
                tasking.com
                <img src={listo} alt="imagen de tareas" className="h-8" />
              </h1>
            </div>
          </header>

          <div className="windows flex justify-between items-center px-8 py-4">
            <div className="window flex justify-around w-full bg-[#f0f8ff] border-b-2 border-[#7fffd4]l mx-4">
              <div>
                <p className="font-medium">Personal</p>
              </div>
              <div>
                <p className="font-medium">Profesional</p>
              </div>
            </div>
            <img src={añadir} className="h-8 cursor-pointer" />
          </div>
        </>
    )
}