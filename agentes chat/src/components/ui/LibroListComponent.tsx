import { libroInfoBasica } from "@/app/types"
import Image from "next/image"
import libroImg from "../../../public/libroImagen.jpg"

export default function LibrosListComponent({libros} : {libros: libroInfoBasica[]}) {
    return(
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5 mb-6 pt-2 ps-1">
            {libros.map((libro) =>
                <LibrosItem key={libro.ID} libro={libro} ></LibrosItem>
            )}
        </div>
    )

}

export function LibrosItem({libro} : {libro: libroInfoBasica}) {
    const autores = libro.autor && libro.autor.length > 1 ? libro.autor.reduce((acc : string, libro: string) =>
    {
        return acc + ', ' + libro
    }) : libro.autor
    return (
    <div className="flex p-1 bg-gray-600 rounded-md " >
        {libro.thumbnail ?
            <Image key={libro.ID} src={libro.thumbnail} alt="" width={35} height={35}/>
        :
            <Image key={libro.ID} src={libroImg} alt="" width={35} height={35}/>
        }
        <div className=" items-center p-3 gap-2">
            <h3 className="text-md font-bold">{libro.titulo}</h3>
            <p className="text-sm">{libro.autor.length == 1 ? `Autor: ${libro.autor}` : `Autores: ${autores}`}</p>
        </div>
    </div>)
}