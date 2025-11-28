//archivo que se encarga de la logica de busqueda de libros

import axios from "axios";
import { Libro } from "../app/tipos/libro";

export async function fetchBooks(query: string): Promise<Libro[]> {
    if (!query) return [];
    
    try {
        const res = await axios.get(
            `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=40`
        );

        if (!res.data.items) return [];
    
        return res.data.items.map((item: any) => {
            const links = item.volumeInfo.imageLinks || {};
            return {
                id: item.id,
                titulo: item.volumeInfo.title,
                autor: item.volumeInfo.authors || ["Autor desconocido"],
                descripcion: item.volumeInfo.description,
                imagen: links.extraLarge || links.large || links.medium || links.thumbnail || links.smallThumbnail || "",
                fechaPublicacion: item.volumeInfo.publishedDate,
                numPaginas: item.volumeInfo.pageCount,
                categorias: item.volumeInfo.categories || [],
            };
        });
    } catch (error) {
        console.error("Error obteniendo los libros:", error);
        return [];
    }
}