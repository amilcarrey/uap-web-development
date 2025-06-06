import { useAtomValue, useSetAtom } from 'jotai'
import añadir from '../assets/añadir.png'
import { TableroItem } from './TableroItem'
import { baseURL, errorAtom, loadingAtom, tablerosAtom, tiempoCargando, useFetchTableros } from './store/tareasStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Tablero } from '../types'
import { use } from 'react'
import { toast } from 'sonner'

export function Tableros() {
    useFetchTableros()
    const setError = useSetAtom(errorAtom);
    const setLoading = useSetAtom(loadingAtom);
    const tablerosList = useAtomValue(tablerosAtom);
    const queryClient = useQueryClient();


    const { mutate: addTablero } = useMutation(
        {
            mutationFn: async (nombre: string) => {
                const response = await fetch(`${baseURL}`,
                    {
                        method: "POST",
                        body: JSON.stringify({ nombre: nombre }),
                        headers: { "Content-Type": "application/json" }
                    }
                )
                const data: { tablero: Tablero } = await response.json()
                return data.tablero
            },

            onSuccess: (data) => {
                queryClient.setQueryData(["listaTableros"], (current: Tablero[]) => [...current, data])
                toast.success("Exitazo!", { description: "Tablero agregada (:" })
            },
            onError: (error) => {
                setError(error.message);
                toast.error('Se rompió: ', { description: `${error.message}` })
            },
            onSettled: () => {
                setTimeout(() => {
                    setLoading(false);
                }, tiempoCargando)
            },
        });

    function handleClickAdd()
    {
        const content = prompt("Ingresa el nombre del nuevo tablero");
        addTablero(content!)
    }

    return (<>
        <div className="windows flex justify-between items-center px-8 py-4">
            <div className="window flex justify-around w-full bg-[#f0f8ff] border-b-2 border-[#7fffd4]l mx-4">
                {
                    tablerosList.map((t) => (
                        <TableroItem key={t.id} tablero={t} />
                    ))
                }
            </div>
            <button onClick={() => handleClickAdd()}>
                <img src={añadir} className="h-8 cursor-pointer" />
            </button>
        </div>
    </>)
}