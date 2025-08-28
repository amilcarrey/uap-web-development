// app/actions.ts
"use server"

import { resenasDB } from "@/resenaStore";
import { libro } from "@/types";

export async function getLibroById(idLibro: string) {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${idLibro}`);
    if (!response) throw new Error('Falla al fetchear')
    const data: libro = await response.json();
    const libro = data.volumeInfo;
    return libro
}

export async function likeAction(resenaId: string, action: string) {
    const resenas = resenasDB;
    const index = resenas.findIndex((r) => r.id === resenaId);
    if (index == null) throw new Error('No se encontro la reseña especificada');
    action === 'like' ? resenas[index].likes = resenas[index].likes + 1 : resenas[index].dislikes = resenas[index].dislikes + 1;
}

export async function getLibrosByISBN(ISBN: number) {
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${ISBN}`);
    if (!response) throw new Error('Falla al fetchear')
    const data = await response.json();
    const libros = await data.items
    return libros
}

export async function getLibrosByAuthor(author: string) {
    const authorUrl = author.replaceAll(' ', '+')
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=author:${authorUrl}`);
    if (!response) throw new Error('Falla al fetchear')
    const data = await response.json();
    const libros = await data.items
    return libros
}

export async function getLibrosByTitle(title: string) {
    const urlTitle = title.replaceAll(' ', '+')
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${urlTitle}`);
    if (!response) throw new Error('Falla al fetchear')
    const data = await response.json();
    const libros = await data.items
    return libros
}
