import { create } from "zustand";
import { libro } from "./types";

export type resena = 
{
    id: string,
    libroId: string,
    title: string,
    opinion: string,
    calificacion: number
    likes: number,
    dislikes: number
}

export type resenaItemState = 
{
    resenas: resena[], 
    libros: libro[] | null,
    modoBusqueda: string,
    idLibro_NuevaResena: string,
    setILNR: (id: string) => void,
    setResenas: (newResenas: resena[]) => void,
    setModoBusqueda: (modoBusqueda: string) => void,
    likesCounter: (resenaId: string, action : string) => void,
    searchByTitle: (title: string) => void;
    getLibro: (id: string) => Promise<libro>,
    searchByISBN: (ISBN: number) => void;
    searchByAuthor: (author: string) => void;
}

export const resenasStore = create<resenaItemState>((set, get) =>
({
    
    resenas: [{ id: '1', calificacion: 3, dislikes: 4, likes: 20, libroId: '4RENAQAAMAAJ', title: 'estabuenishimo', opinion: 'joya total mi loco 100% recomendau por el 99% de los odontologos' }],
    libros: null,
    modoBusqueda: 'titulo',
    idLibro_NuevaResena: '',

    setResenas : (newResenas : resena[]) => set({resenas : newResenas}),
    setModoBusqueda: (modoBusqueda: string) => set({modoBusqueda: modoBusqueda}),
    setILNR : (id) => set({idLibro_NuevaResena: id}),

    likesCounter : (resenaId: string, action : string) => 
    {
        const resenas = get().resenas
        const index = resenas.findIndex((r) => r.id === resenaId);
        if(index == null) throw new Error('No se encontro la reseña especificada');
        action === 'like' ? resenas[index].likes = resenas[index].likes + 1 :resenas[index].dislikes = resenas[index].dislikes + 1;
        console.log(resenas)
        set({resenas: resenas})
    },

    searchByTitle: async (title: string) => 
    {
        const urlTitle = title.replaceAll(' ', '+')
        const response = await fetch( `https://www.googleapis.com/books/v1/volumes?q=${urlTitle}`);
        if(!response) throw new Error('Falla al fetchear')
        const data = await response.json();
        const libros = data.items
        set({libros: libros})
    },

    searchByISBN: async (ISBN: number) => 
    {
        const response = await fetch( `https://www.googleapis.com/books/v1/volumes?q=isbn:${ISBN}`);
        if(!response) throw new Error('Falla al fetchear')
        const data = await response.json()        
        const libros =  data.items
        set({libros: libros})
    },

    searchByAuthor: async (author: string) => 
    {
        const authorUrl = author.replaceAll(' ', '+')
        const response = await fetch( `https://www.googleapis.com/books/v1/volumes?q=author:${authorUrl}`);
        if(!response) throw new Error('Falla al fetchear')
        const data = await response.json();
        const libros = data.items
        set({libros: libros})
    },

    getLibro: async (id: string) =>
    {
        const response = await fetch( `https://www.googleapis.com/books/v1/volumes?q=id:${id}`);
        if(!response) throw new Error('Falla al fetchear')
        const data = await response.json();
        const libro: libro = await data.volumeInfo;
        return  libro
    }
}))


export const resenasDB = [
    {   
        id: '1', 
        calificacion: 3, 
        dislikes: 4, 
        likes: 20, 
        libroId: '4RENAQAAMAAJ', 
        title: 'estabuenishimo', 
        opinion: 'joya total mi loco 100% recomendau por el 99% de los odontologos'
    },

        {   
        id: '2', 
        calificacion: 5, 
        dislikes: 2, 
        likes: 40, 
        libroId: '2WhCEAAAQBAJ', 
        title: 'tusae grande Riordan', 
        opinion: 'todos los 5 libros just for starters que buena vaina mi cleptomaniaco'
    },
    {   
        id: '3', 
        calificacion: 3, 
        dislikes: 4, 
        likes: 20, 
        libroId: '4RENAQAAMAAJ', 
        title: 'estabuenishimo', 
        opinion: 'joya total mi loco 100% recomendau por el 99% de los odontologos'
    },

        {   
        id: '4', 
        calificacion: 5, 
        dislikes: 2, 
        likes: 40, 
        libroId: '2WhCEAAAQBAJ', 
        title: 'tusae grande Riordan', 
        opinion: 'todos los 5 libros just for starters que buena vaina mi cleptomaniaco'
    }
]

export const librosDB = [
    {}
]
