import { type Tarea } from "../types"
import { TareaItem } from "./TareaItem"
import { useEffect, useState } from "react";

type TareasListProps =
    {
        tareas: Tarea[],
        action: (id: string, accion: string) => void,
        dltCompletas: (action: string) => void,
    }
    


export function TareaList({ tareas, action, dltCompletas }: TareasListProps) {
    const [tareasRender, setTareasR] = useState(tareas);
    const [filtro, setFiltro] = useState("");
    console.log(tareas)

    function handleDltComplete()
    {
        dltCompletas("borrar-completas");
        setTareasR(tareas.filter((t) => !t.checked));
    }

    useEffect(() => {
        console.log(tareas)

        switch (filtro) {
            case "completas":
                setTareasR(tareas.filter((t) => t.checked))
                break
            case "incompletas":
                setTareasR(tareas.filter((t) => !t.checked))
                break
            default:
                setTareasR(tareas)
                break
        }

    })


    return (
        <section>
            <ul id="task-list">
                {

                    tareasRender.map((tarea) => (
                        <TareaItem
                            key={tarea.id}
                            tarea={tarea}
                            action={action}
                        />
                    ))

                }
            </ul>
            <section
                className="flex justify-center bg-[#faebd7] rounded-b-xl mx-auto w-3/5 p-3 gap-2"
            >
                <button
                    type="submit"
                    name="action"
                    value="delete-checked"
                    data-action-button="delete-button"
                    className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm"
                    onClick={(e) => { e.preventDefault(); handleDltComplete() }}
                >
                    Borrar completadas
                </button>
                <button
                    type="submit"
                    name="action"
                    value="list-check"
                    data-action-button="check-button"
                    className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm"
                    onClick={() => { setFiltro("completas") }}
                >Completadas
                </button>

                <button
                    type="submit"
                    name="action"
                    value="list-uncheck"
                    data-action-button="uncheck-button"
                    className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm"
                    onClick={() => { setFiltro("incompletas") }}
                >Faltantes
                </button>

                <button
                    type="submit"
                    name="action"
                    value="list-all"
                    data-action-button="list-button"
                    className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm"
                    onClick={() => { setFiltro("") }}
                >Todas
                </button>
            </section>
        </section>


    )
}

