import type { Tarea } from "../types";
import basura from "../assets/tacho.png"
import lapiz from "../assets/lapiz.png"
import { baseURL, configContentAtom, editAtom, editContentAtom, errorAtom, loadingAtom, tareaEditable, tiempoCargando } from "./store/tareasStore";
import { useAtomValue, useSetAtom } from "jotai";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type TareaItemProps =
    {
        tarea: Tarea,
    }


export function TareaItem({ tarea }: TareaItemProps) {
    const setError = useSetAtom(errorAtom);
    const setLoading = useSetAtom(loadingAtom);
    const setEditing = useSetAtom(editAtom);
    const setTareaEditable = useSetAtom(tareaEditable);
    const capsLock = useAtomValue(configContentAtom).capsLck;
    const queryClient = useQueryClient();

    const { mutate: actionTarea } = useMutation({
        mutationFn: async ({ action, id, content }: { action: string, id: string, content: string }) => {
            setLoading(true);
            setError(null);
            const response = await fetch(`${baseURL}/tasks/${id}`,
                {
                    method: 'POST',
                    body: JSON.stringify({ action: action, id: id, content: content}),
                    headers: { "Content-Type": "application/json" },
                }
            )
            const data: { tarea: Tarea } = await response.json();
            return data.tarea
        },

        onSuccess: (data, actions) => {
            queryClient.setQueryData(['listaTareas'], (current: Tarea[]) => {
                if (actions.action === "delete") return current.filter((t) => t.id !== data.id)
                return current.map((t) => t.id === data.id ? t = data : t)
            })
            toast.success("Exitazo!", {description: "Tarea editada (:"})
        },

        onError: (e) => {
            setError(e.message)
            toast.error('Se rompió: ', {description: `${e.message}`})

        },

        onSettled: () => {
            setTimeout(() => {
                setLoading(false);
            }, tiempoCargando)
        }
    })


    function handleClickCheck() {
        actionTarea({ action: "check", id: tarea.id , content: "relleno"});
    }

    function handleClickDelete() {
        actionTarea({ action: "delete", id: tarea.id, content: "relleno"});
    }

    function handleClickEdit()
    {
        setEditing(true)
        setTareaEditable(tarea)
        
    }

    

    return (
        <section className="flex justify-center items-center border-b border-[#b1e4e4] bg-[#faebd7] mx-auto w-auto p-3" >
            <li data-id={tarea.id} className="flex justify-around items-center w-200 gap-3">
                <button
                    className="w-18 h-6 rounded flex justify-center items-center text-sm bg-[#f0f8ff]"
                    onClick={(e) => { e.preventDefault(); handleClickCheck() }}
                    data-action-button="check-button"
                    data-checked={tarea.checked}
                >{tarea.checked ? "checked:)" : "check"}</button>
                <p data-content="content" className="flex-grow">{capsLock? tarea.content.toUpperCase() : tarea.content}</p>
                <button
                    onClick={(e) => { e.preventDefault(); handleClickEdit() }}
                    data-action-button="delete-button"
                    className="text-gray-500 hover:text-red-500 transition-colors"
                >
                    <img src={lapiz} className="h-4" />
                </button>
                <button
                    onClick={(e) => { e.preventDefault(); handleClickDelete() }}
                    data-action-button="delete-button"
                    className="text-gray-500 hover:text-red-500 transition-colors"
                >
                    <img src={basura} className="h-4" />
                </button>
            </li>
        </section>
    )
}