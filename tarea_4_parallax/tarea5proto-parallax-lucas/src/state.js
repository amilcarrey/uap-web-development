const tareas_de_ejemplo = [
    {
        id: 1,
        testo: 'ser un buen programador',
        completada: false
    },
    {
        id: 2,
        testo: 'ser una lacra',
        completada: true
    },
    {
        id: 3,
        testo: 'terminar esta cosa bosta',
        completada: true
    },
    {
        id: 4,
        testo: 'hacer la tarea de la clase',
        completada: false
    },
]

export const state = {
    filtro: 'Todos',
    tareas: [...tareas_de_ejemplo],
    
};