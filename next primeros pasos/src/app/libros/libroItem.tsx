'use client'

import { Card } from "@/components/ui/card";
import { resenasStore } from "@/resenaStore";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import newResena from "../../../public/8666681_edit_icon.svg"
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/dist/server/api-utils";

export default function LibroItem() {
    const useResenaStore = resenasStore();
    const libros = useResenaStore.libros;
    const modoBusqueda = useResenaStore.modoBusqueda;
    const idlibro = useResenaStore.idLibro_NuevaResena
    const searchIBSN = useResenaStore.searchByISBN;
    const searchTitulo = useResenaStore.searchByTitle;
    const searchAutor = useResenaStore.searchByAuthor;
    const setModoBusqueda = useResenaStore.setModoBusqueda;
    const setIdLibro = useResenaStore.setILNR


    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const formData = new FormData(target);
        const content = formData.get('busqueda')?.toString()
        if (!content) return toast.error('El formulario esta vacio');
        switch (modoBusqueda) {
            case 'titulo':
                searchTitulo(content);
                break;
            case 'autor':
                searchAutor(content);
                break;
            case 'IBSN':
                if (isNaN(Number(content))) return toast.error("El ISBN debe ser numérico");
                searchIBSN(parseInt(content));
                break;
        }

        target.reset()
    }

    console.log(idlibro)
    return (<>
        <div className="flex justify-center p-4">
            <form onSubmit={handleSubmit}>
                <input name="busqueda" className="bg-red-100 rounded-md" type="text" placeholder="  Buscar libro por..." />
                <select name="modoBusqueda" id="modoBusqueda" value={modoBusqueda} onChange={(e) => setModoBusqueda(e.target.value)}>
                    <option data-testid = 'titulo' value="titulo">Titulo</option>
                    <option data-testid = 'ISBN' value="IBSN">IBSN</option>
                    <option data-testid = 'author' value="autor">Autor</option>
                </select>
            </form>
        </div>
        <div className="flex-wrap flex justify-center bg-red-100 rounded-xl p-3 gap-3">
            {libros ? libros.map((b) =>
                <Card key={b.id} className="w-55" >
                    <Link href={`/libros/${b.id}`} >
                        <img key={b.id} src={b.volumeInfo.imageLinks.smallThumbnail} alt="" />
                    </Link>
                    <div className="flex items-center p-3 gap-2">
                        <div className="w-3/4">
                            <p data-testid = 'title' >{b.volumeInfo.title}</p>
                            <p data-testid = 'published'>{b.volumeInfo.publishedDate?.slice(0, 4)}</p>
                        </div>
                        <Link href="/resenas/crear" onClick={() => setIdLibro(b.id)}>
                            <Image src={newResena} alt="" height={20}></Image>
                        </Link>
                    </div>
                </Card>
            ) : <p>Busquemos un libro y cuentanos que piensas!</p>}
        </div>
    </>)

}