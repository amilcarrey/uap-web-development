'use server'
import { resena, resenaItemState, resenasDB, resenasStore } from "@/resenaStore"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { FormEvent } from "react";
import { toast } from "sonner";

type nuevaResenaProps = 
{
    libroId : string
}

export default async function NuevaResena({libroId} : nuevaResenaProps){

    async function handleSubmit(formData : FormData)
    {
        "use server";
        const titulo = formData.get('titulo')?.toString();
        const opinion = formData.get('opinion')?.toString();
        const estrellas = formData.get('estrellas')?.toString();
        if(!titulo || !opinion || !estrellas || parseInt(estrellas)<0 || parseInt(estrellas)>5) throw new Error('laca');
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

        resenasDB.unshift(newResena);
        console.log(resenasDB)
        redirect('/resenas');
    }

    return(<>
        <form className="flex justify-around" action={handleSubmit} data-testid = 'form'>
            <input className="bg-red-100 rounded-md" type="text" name="titulo" placeholder="Titulo de tu reseña" required={true} />
            <input className="bg-red-100 rounded-md" type="text" name="opinion"  placeholder="Aqui tu opinion" required={true}/>
            <input className="bg-red-100 rounded-md" type="number" name="estrellas" placeholder="Del 1 al 5 cuantas estrellas?" required={true}/>
            <input data-testid ='botonSubmit' type="submit" className="hover:bg-red-400 rounded-md p-1" />
        </form>
    </>)
}