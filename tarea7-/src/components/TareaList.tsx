import { useSetAtom, useAtomValue, atom } from "jotai";
import { baseURL, errorAtom, filtroAtom, loadingAtom, paginaActualAtom, tableroActualAtom, tareasAtom, tareasFiltradasAtom, tareasPorPaginaAtom, useFetchTareas } from "./store/tareasStore";
import { TareaItem } from "./TareaItem"
import type { Tarea } from "../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import spinner from '../assets/spinner.png'
import errorcito from '../assets/errorcito.png'
import notareas from '../assets/notareas.png'
import { toast } from "sonner";
import { use, type FormEvent } from "react";


export function TareaList() {
    useFetchTareas();
    const setFiltro = useSetAtom(filtroAtom);
    const setTareas = useSetAtom(tareasAtom);
    const tableroActual = useAtomValue(tableroActualAtom);

    const paginaActual = useAtomValue(paginaActualAtom)
    const setPaginaActual = useSetAtom(paginaActualAtom);
    const tareasPorPagina = useAtomValue(tareasPorPaginaAtom)
    const setTareasPorPagina = useSetAtom(tareasPorPaginaAtom);
    const lastTareaIndex: number = paginaActual * tareasPorPagina;
    const firstTareaIndex = lastTareaIndex - tareasPorPagina;
    const tareas = useAtomValue(tareasFiltradasAtom).filter((t) => t.idTablero == tableroActual.id).slice(firstTareaIndex, lastTareaIndex);
    const queryClient = useQueryClient();
    const cargando = useAtomValue(loadingAtom)
    const setLoading = useSetAtom(loadingAtom)
    const error = useAtomValue(errorAtom)
    const setError = useSetAtom(errorAtom)


    const { mutate: handleDltCompleted } = useMutation({
        mutationFn: async () => {
            setLoading(true);
            setError(null);
            const response = await fetch(`${baseURL}/tasks`, {
                method: 'POST',
                body: JSON.stringify({ action: 'borrar-completas' }),
                headers: { 'Content-Type': 'application/json' },
            });
            const data: { tasks: Tarea[] } = await response.json();
            return data.tasks;
        },

        onSuccess: (data) => {
            queryClient.setQueryData(['listaTareas'], () => data);
            alert('Borramos las completas');
        },
        onError: (error) => {
            setError(error.message);
            alert('Se rompió: ' + error.message);
        },
        onSettled: () => {
            setLoading(false);
        },
    });

    const handleDltComplete = async () => {
        const response = await fetch(`${baseURL}/tasks`, {
            method: "POST",
            body: JSON.stringify({ action: "borrar-completas" }),
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Error al borrar tareas");

        const data: { tasks: Tarea[] } = await response.json();
        console.log(data.tasks)
        setTareas(data.tasks);
        toast.success("Exitazo!", { description: "Tarea editada (:" })
    };

    function handleClickLeft() {
        if (paginaActual >= 1) {
            toast.error("lo sentimos):", { description: "no hay mas paginas atras" })
        } else {
            setPaginaActual(paginaActual - 1)
        }

    }

    function handleClickRight() {
        if (tareas.length/tareasPorPagina <= paginaActual) {
            toast.error("lo sentimos):", { description: "no hay mas paginas adelante" })
        } else {
            setPaginaActual(paginaActual + 1)
        }
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const formData = new FormData(target);
        const content = formData.get("content")?.toString();
        if (!content) { return alert("el formulario esta vacio") }
        setPaginaActual(parseInt(content))
    }

    const render = () => {
        if (cargando) {
            return (
                <section className=" flex justify-center items-center  bg-[rgb(177,228,228)] rounded-xl mx-auto w-3/5 p-3 gap-2 h-full font-bold">
                    <img src={spinner} className="animate-spin duration-initial h-20" />
                    <p className="text-white">Cargando mensajes...</p>
                </section>
            )
        }
        if (error) {
            return (
                <section className=" flex justify-center items-center  bg-[rgb(228,177,177)] rounded-xl mx-auto w-3/5 p-3 gap-2 h-full font-bold">
                    <img src={errorcito} className="h-20" />
                    <p className="text-white">Error: {error}</p>
                </section>
            )
        }

        if (tareas.length < 1) {
            return (<>
                <section className=" flex justify-center items-center  bg-[#c4ab8b] rounded-xl mx-auto w-3/5 p-3 gap-2 h-full font-bold">
                    <img src={notareas} className="h-20" />
                    <p className="text-white">Aun no hay tareas.</p>
                </section>
            </>)
        }

        return (
            <section className="bg-[#faebd7] rounded-xl mx-auto w-3/5 p-3">
                <ul id="task-list" >
                    {
                        tareas.map((tarea) => (
                            <TareaItem
                                key={tarea.id}
                                tarea={tarea}
                            />
                        ))
                    }
                </ul>
            </section>)
    }


    return (
        <section>
            {render()}
            <section className="h-5" />
            <section className="flex justify-center bg-[#b1e4e4] rounded-xl mx-auto w-1/5 p-1 gap-1">
                <button
                    className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm"
                    onClick={() => handleClickLeft()}
                >{"<"}</button>
                <form className="w-8 flex justify-center items-center" onSubmit={(e) => handleSubmit(e)}>
                    <input type="text" name="content" className="w-2" placeholder={paginaActual.toString()} />
                </form>
                <button className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm"
                    onClick={() => handleClickRight()}
                >{">"}</button>
            </section>
            <section className="h-5" />

            <section
                className="flex justify-center bg-[#faebd7] rounded-xl mx-auto w-3/5 p-3 gap-2"
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

