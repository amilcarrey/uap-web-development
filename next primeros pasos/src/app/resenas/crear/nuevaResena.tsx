'use client'
import { resena, resenaItemState, resenasStore } from "@/resenaStore"
import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { FormEvent } from "react";
import { toast } from "sonner";

export default function NuevaResena (){
    const resenaStore = resenasStore()
    const resenas = resenaStore.resenas;
    const libroId = resenaStore.idLibro_NuevaResena;
    const setResenas = resenaStore.setResenas;

    console.log(libroId)


    const handleSubmit = (e: FormEvent<HTMLFormElement>) =>
    {
        e.preventDefault();
        const target = e.target;
        const formData = new FormData(target as HTMLFormElement);
        const titulo = formData.get('titulo')?.toString();
        const opinion = formData.get('opinion')?.toString();
        const estrellas = formData.get('estrellas')?.toString();
        if(!titulo || !opinion || !estrellas || parseInt(estrellas)<0 || parseInt(estrellas)>5) return toast.error('completar adecuadamente los campos');
        const r = Math.random()*10000
        const newResena: resena = {
            id: r.toString(),
            libroId: libroId,
            title: titulo,
            opinion: opinion,
            calificacion: parseInt(estrellas),
            likes: 0,
            dislikes: 0
        }

        resenas.unshift(newResena);
        const newResenasList = resenas
        setResenas(newResenasList);
        console.log(newResenasList)
        redirect('/resenas');
    }

    return(<>
        <form className="flex justify-around" onSubmit={handleSubmit}>
            <input className="bg-red-100 rounded-md" type="text" name="titulo" placeholder=" Titulo de tu reseña"/>
            <input className="bg-red-100 rounded-md" type="text" name="opinion"  placeholder=" Aqui tu opinion" />
            <input className="bg-red-100 rounded-md" type="number" name="estrellas" placeholder="Del 1 al 5 cuantas estrellas?" />
            <input type="submit" />
        </form>
    </>)
}