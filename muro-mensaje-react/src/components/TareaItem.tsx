import type { Tarea } from "../types";
import basura from "../assets/tacho.png"
import { useState } from "react";

type TareaItemProps =
    {
        tarea: Tarea,
        action: (id: string, accion: string) => void,
    }


export function TareaItem({ tarea, action }: TareaItemProps) {

    const [checked, setMensajeCheck] = useState<string>(tarea.checked ? "checked:)" : "check");
    function handleClickCheck() {
        action("check", tarea.id);
        tarea.checked ? setMensajeCheck("check") : setMensajeCheck("checked:)")
    }

    function handleClickDelete( e: React.MouseEvent<HTMLButtonElement>){
        action("delete", tarea.id);
        const target = e.target as HTMLElement;
        const todo = target.closest("section")!;
        todo? todo.remove() : new Error("no se encuentra la section");
    }

    return (
        <section className="flex justify-center items-center border-b border-[#b1e4e4] bg-[#faebd7] mx-auto w-3/5 p-3" >
            <li data-id={tarea.id} className="flex items-center gap-3 w-110">
                <button
                    className="w-18 h-6 rounded flex justify-center items-center text-sm bg-[#f0f8ff]"
                    name="action"
                    value="check"
                    onClick={(e) => { e.preventDefault(); handleClickCheck() }}
                    data-action-button="check-button"
                    data-checked={tarea.checked}
                >{checked}</button>
                <p data-content="content" className="flex-grow">{tarea.content}</p>
                <button
                    name="action"
                    value="delete"
                    onClick={(e) => { e.preventDefault(); handleClickDelete(e) }}
                    data-action-button="delete-button"
                    className="text-gray-500 hover:text-red-500 transition-colors"
                >
                    <img src={basura} className="h-4" />
                </button>
            </li>
        </section>
    )
}