import type { Tablero, Tarea } from "../types"
import basura from "../assets/tacho.png"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtomValue, useSetAtom } from "jotai";
import { toast } from "sonner";
import { errorAtom, loadingAtom, baseURL, tiempoCargando, tableroActualAtom } from "./store/tareasStore";


type TableroItemProps =
    {
        tablero: Tablero
    }

export function TableroItem({ tablero }: TableroItemProps) {
    const setError = useSetAtom(errorAtom);
    const setLoading = useSetAtom(loadingAtom);
    const setTableroActual = useSetAtom(tableroActualAtom)
    const queryClient = useQueryClient();

    const { mutate: actionTablero } = useMutation({
        mutationFn: async ({ action, id }: { action: string, id: string }) => {
            setLoading(true);
            setError(null);
            const response = await fetch(`${baseURL}/${id}`,
                {
                    method: 'POST',
                    body: JSON.stringify({ action: action, id: id }),
                    headers: { "Content-Type": "application/json" },
                }
            )
            const data: { tablero: Tablero } = await response.json();
            return data.tablero
        },

        onSuccess: (data, actions) => {
            queryClient.setQueryData(['listaTareas'], (current: Tarea[]) => {
                if (actions.action === "delete") return current.filter((t) => t.id !== data.id)
            })
            queryClient.invalidateQueries({ queryKey: ['listaTableros'] });
            toast.success("Exitazo!", { description: "Tablero eliminado (:" })
        },

        onError: (e) => {
            setError(e.message)
            toast.error('Se rompió: ', { description: `${e.message}` })

        },

        onSettled: () => {
            setTimeout(() => {
                setLoading(false);
            }, tiempoCargando)
        }
    })

    function handleClickDelete() {
        actionTablero({ action: "delete", id: tablero.id })
    }

    function handleSelectTablero() {
        setTableroActual(tablero);
        setLoading(true)
        setTimeout(() => {
            queryClient.invalidateQueries({ queryKey: ['listaTareas'] })
        }, tiempoCargando/2)
        setLoading(false);
    }

    console.log(useAtomValue(tableroActualAtom))

    return (<>
        <div className="flex gap-10">
            <button onClick={() => handleSelectTablero()} className="font-medium">{tablero.nombre}</button>
            <button
                onClick={(e) => { e.preventDefault(); handleClickDelete() }}
                data-action-button="delete-button"
                className="text-gray-500 hover:text-red-500 transition-colors"
            >
                <img src={basura} className="h-4" />
            </button>
        </div>
    </>)
}