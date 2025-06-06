import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type FormEvent, type MouseEvent } from "react";
import type { Tarea } from "../types.ts";
import { useAtomValue, useSetAtom } from "jotai";
import { baseURL, editAtom, editContentAtom, errorAtom, loadingAtom, tableroActualAtom, tareaEditable, tiempoCargando } from "./store/tareasStore.tsx";
import { toast } from "sonner";

export function NuevaTareaForm() {
    const tableroActual = useAtomValue(tableroActualAtom)
    const setError = useSetAtom(errorAtom);
    const setLoading = useSetAtom(loadingAtom);
    const setEditContent = useSetAtom(editContentAtom);
    const setEditAtom = useSetAtom(editAtom);
    const tareaEdit = useAtomValue(tareaEditable);
    const toggleEdit = useAtomValue(editAtom);
    const queryClient = useQueryClient();

    const { mutate: addTarea } = useMutation({
        mutationFn: async ({content, idTablero}: {content: string, idTablero: string}) => {
            setLoading(true);
            setError(null);
            const response = await fetch(`${baseURL}/tasks`, {
                method: 'POST',
                body: JSON.stringify({ action: 'agregar-tarea', content, idTablero }),
                headers: { 'Content-Type': 'application/json' },
            });
            const data: { tarea: Tarea } = await response.json();
            return data.tarea;
        },

        onSuccess: (data) => {
            queryClient.setQueryData(['listaTareas'], (prev: Tarea[]) => [...prev, data]);
            toast.success("Exitazo!", {description: "Tarea agregada (:"})
        },
        onError: (error) => {
            setError(error.message);
            toast.error('Se rompió: ', {description: `${error.message}`})
        },
        onSettled: () => {
            setTimeout(() => {
                setLoading(false);
            }, tiempoCargando)
        },
    });

    const { mutate: editTarea } = useMutation({
        mutationFn: async ({ action, id, content }: { action: string, id: string, content: string }) => {
            setLoading(true);
            setError(null);
            const response = await fetch(`${baseURL}/tasks/${id}`,
                {
                    method: 'POST',
                    body: JSON.stringify({ action: action, id: id, content: content }),
                    headers: { "Content-Type": "application/json" },
                }
            )
            const data: { tarea: Tarea } = await response.json();
            return data.tarea
        },

        onSuccess: (data) => {
            queryClient.setQueryData(['listaTareas'], (current: Tarea[]) => {
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

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const formData = new FormData(target);
        const content = formData.get("content")?.toString();
        if (!content) { return alert("el formulario esta vacio") }
        if (toggleEdit) {
            setEditContent(content)
            editTarea({ action: "edit", id: tareaEdit?.id!, content: content })
        }
        else {
            addTarea({content: content, idTablero: tableroActual.id});
        }
        setEditAtom(false)
        target.reset();
    }

    function handleCancelEdit(e: MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        setEditAtom(false);
    }

    function render() {
        if (useAtomValue(editAtom)) {
            return (
                <>
                    <input
                        className="border border-gray-300 rounded px-3 py-1 flex-grow"
                        type="text"
                        name="content"
                        placeholder={tareaEdit?.content}
                    />

                    <button
                        className="bg-[#7fffd4]l hover:bg-red-300 px-4 py-1 rounded"
                        onClick={(e) => handleCancelEdit(e as unknown as MouseEvent<HTMLButtonElement, MouseEvent>)}
                    >
                        Cancelar
                    </button>

                    <button
                        className="bg-[#7fffd4]l hover:bg-[#b1e4e4] px-4 py-1 rounded"
                        type="submit"
                    >
                        Guardar
                    </button>
                </>
            )
        }
        return (
            <>
                <input
                    className="border border-gray-300 rounded px-3 py-1 flex-grow"
                    type="text"
                    name="content"
                    placeholder="Contenido de la tarea"
                />
                <button
                    className="bg-[#7fffd4]l hover:bg-teal-300 px-4 py-1 rounded"
                    type="submit"
                >
                    Add
                </button>
            </>
        )

    }


    return (
        <section className="px-4 py-2">
            <form
                action="/api/tasks"
                method="post"
                className="flex justify-center items-center bg-[#faebd7] rounded-xl mx-auto w-3/5 p-3 gap-3 mb-5"
                onSubmit={handleSubmit}
            >
                {render()}
            </form>
        </section>

    )
}
