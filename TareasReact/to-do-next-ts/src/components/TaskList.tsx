'use client';

import TaskItem from './TaskItem';
import { Tarea } from '@/lib/tareas';
import { useConfigStore } from '@/stores/configStore';


type Props = {
    tareas: Tarea[];
    onToggle?: (id: string) => void;
    onDelete?: (id: string) => void;
    onEdit?: (id: string, texto: string) => void;
};

export default function TaskList({ tareas, onToggle, onDelete, onEdit }: Props) {
    const { mayusculas } = useConfigStore();

    return (
        <ul className="space-y-2">
            {tareas.map((t) => {
                const texto = mayusculas ? t.texto.toUpperCase() : t.texto;
                return (
                    <li key={t.id}>
                        <TaskItem
                            tarea={{ ...t, texto }} // sobreescribimos texto ya formateado
                            onToggle={onToggle ? () => onToggle(t.id) : undefined}
                            onDelete={onDelete ? () => onDelete(t.id) : undefined}
                            onEdit={
                                onEdit
                                    ? () => {
                                        const nuevoTexto = prompt('Editar tarea:', t.texto);
                                        if (nuevoTexto !== null) {
                                            onEdit(t.id, nuevoTexto);
                                        }
                                    }
                                    : undefined
                            }
                        />
                    </li>
                );
            })}
        </ul>
    );
}

