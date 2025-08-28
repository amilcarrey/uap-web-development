import { Card } from "@/components/ui/card";
import { resena, resenasStore } from "@/resenaStore";
import like from "../../../public/8666702_thumbs_up_icon.png"
import dislike from "../../../public/8666748_thumbs_down_icon.png"
import Image from "next/image";
import estrella from "../../../public/8666698_star_icon.png"
import { useEffect, useState } from "react";
import { libro, volumeInfo } from "@/types";
import { getLibroById, likeAction } from "../libros/serverActions";
import { revalidatePath } from "next/cache";


type ResenaItemProps = {
    resena: resena
}

export default async function ResenaItem({ resena }: ResenaItemProps) {
    const libro = await getLibroById(resena.libroId);
    const images = libro?.imageLinks

    async function likeResena(formData: FormData) {
        "use server";
        const resenaId = formData.get("id")?.toString()!;
        const action = formData.get("accion")?.toString()!
        likeAction(resenaId, action);
        revalidatePath('/resenas')
    }

    const estrellas = () => {
        switch (resena.calificacion) {
            case 1:
                return (<>
                    <Image src={estrella} alt="" height={10} width={10}></Image>
                </>)
            case 2:
                return (<>
                    <Image src={estrella} alt="" height={10} width={10}></Image>
                    <Image src={estrella} alt="" height={10} width={10}></Image>
                </>)
            case 3:
                return (<>
                    <Image src={estrella} alt="" height={10} width={10}></Image>
                    <Image src={estrella} alt="" height={10} width={10}></Image>
                    <Image src={estrella} alt="" height={10} width={10}></Image>
                </>)
            case 4:
                return (<>
                    <Image src={estrella} alt="" height={10} width={10}></Image>
                    <Image src={estrella} alt="" height={10} width={10}></Image>
                    <Image src={estrella} alt="" height={10} width={10}></Image>
                    <Image src={estrella} alt="" height={10} width={10}></Image>
                </>)
            case 5:
                return (<>
                    <Image src={estrella} alt="" height={10} width={10}></Image>
                    <Image src={estrella} alt="" height={10} width={10}></Image>
                    <Image src={estrella} alt="" height={10} width={10}></Image>
                    <Image src={estrella} alt="" height={10} width={10}></Image>
                    <Image src={estrella} alt="" height={10} width={10}></Image>
                </>)
        }

    }



    return (
        <div className="flex w-max">
            <Card key={resena.id} className="w-full p-4 " >
                <div className=" gap-2 flex justify-center items-center">
                    <div className="border-r-amber-200">
                        <h2 className="font-bold" data-testid="title" >{resena.title}</h2>
                        <div className="flex p-1" data-testid="estrellas">
                            {estrellas()}
                        </div>
                        <p data-testid = "opinion">{resena.opinion}</p>
                        <div className="flex justify-around py-4">
                            <form data-testid = "formLikes" action={likeResena}>
                                <input type="hidden" name="id" value={resena.id} />
                                <input type="hidden" name="accion" value="like" />
                                <button data-testid = "likes" className="flex items-center gap-2 hover:bg-gray-200 rounded-md" type="submit">
                                    <Image src={like} alt="" height={15} width={15}></Image>
                                    {resena.likes}
                                </button>
                            </form>
                            <form action={likeResena} data-testid = "formDislikes">
                                <input type="hidden" name="id" value={resena.id} />
                                <input type="hidden" name="accion" value="dislike" />
                                <button data-testid = "dislikes" className="flex items-center gap-2 hover:bg-gray-200 rounded-md" >
                                    <Image src={dislike} alt="" height={15} width={15}></Image>
                                    {resena.dislikes}
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className=" flex-wrap flex justify-center w-50">
                        <img src={images?.thumbnail} alt="" className="w-25 h-40" />
                        <p data-testid = "libroTitle" className="text-xs">{libro?.title}</p>
                    </div>
                </div>
            </Card>
        </div >
    )
}