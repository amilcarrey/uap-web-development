import { atom, createStore, useAtomValue, useSetAtom } from "jotai";
import type { Configuracion, Tablero, Tarea } from "../../types";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import type { Notificacion } from "../../types"

export const baseURL = "http://localhost:4321/api/tableros";
export const tiempoCargando = 250

export const tareasAtom = atom<Tarea[]>([]); // Array of tareas
export const loadingAtom = atom(false); // Loading state
export const errorAtom = atom<string | null>(null); // Error state
export const store = createStore(); // Store
export const filtroAtom = atom<string>("");
export const notificacionesAtom = atom<Notificacion[]>([])
export const editAtom = atom(false);
export const editContentAtom = atom<string>("")
export const tareaEditable = atom<Tarea | null>(null)
export const configAtom = atom(false);
export const configContentAtom = atom<Configuracion>({ intervaloRefetch: 10000, capsLck: false });
export const tableroActualAtom = atom<Tablero>({ id: "0", nombre: "Personal", tareas: [] })
export const tablerosAtom = atom<Tablero[]>([{ id: "0", nombre: "Personal", tareas: [] }])
export const paginaActualAtom = atom(1);
export const tareasPorPaginaAtom = atom(3);


export function useFetchTareas() {
    const tableroActual = useAtomValue(tableroActualAtom);
    const refetchIntervalo = useAtomValue(configContentAtom).intervaloRefetch
    const setError = useSetAtom(errorAtom);
    const setLoading = useSetAtom(loadingAtom);
    const setTareas = useSetAtom(tareasAtom);

    const { status, data, error } = useQuery({
        queryKey: ['listaTareas'],
        queryFn: async () => {
            const response = await fetch(`${baseURL}/tasks`);
            const data: { tasks: Tarea[] } = await response.json()
            return data.tasks
        },
        refetchInterval: refetchIntervalo
    });

    useEffect(() => {
        if (status === "pending") {
            setLoading(true);
            setError(null);
        }

        if (status === "error" && error) {
            setError(error.message);
            setLoading(false);
        }

        if (status === "success" && data) {
            setTimeout(() => {
                setLoading(false);
                setTareas(data);
            }, tiempoCargando)
        }
    }, [status, data, error]);

    return { status, data, error };
}

export function useFetchTableros() {
    const setError = useSetAtom(errorAtom);
    const setLoading = useSetAtom(loadingAtom);
    const setTableros = useSetAtom(tablerosAtom);

    const { status, data, error } = useQuery({
        queryKey: ['listaTableros'],
        queryFn: async () => {
            const response = await fetch(`${baseURL}`);
            const data: { tableros: Tablero[] } = await response.json()
            return data.tableros;
        }
    });

    useEffect(() => {
        if (status === "pending") {
            setLoading(true);
            setError(null);
        }

        if (status === "error" && error) {
            setError(error.message);
            setLoading(false);
        }

        if (status === "success" && data) {
            setTimeout(() => {
                setLoading(false);
                setTableros(data);
            }, tiempoCargando)
        }
    }, [status, data, error]);

    return { status, data, error };
}

export const tareasFiltradasAtom = atom((get => {
    const tareas = get(tareasAtom);
    const filtro = get(filtroAtom);
    switch (filtro) {
        case "completas":
            return tareas.filter((t) => t.checked)
        case "incompletas":
            return tareas.filter((t) => !t.checked)
        default:
            return tareas;
    }
}
))




