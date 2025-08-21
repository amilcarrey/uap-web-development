'use client'
import { Card } from "@/components/ui/card";
import { resena, resenasStore } from "@/resenaStore";
import like from "../../../public/8666702_thumbs_up_icon.png"
import dislike from "../../../public/8666748_thumbs_down_icon.png"
import Image from "next/image";
import estrella  from "../../../public/8666698_star_icon.png"
import { useEffect, useState } from "react";
import { libro, volumeInfo } from "@/types";


type ResenaItemProps = {
    resena: resena
}

export default function ResenaItem({ resena }: ResenaItemProps) {
    const [libro, setLibro] = useState<volumeInfo | null>(null);
    const resenaStore = resenasStore()
    const increaseLikes = resenaStore.likesCounter
    const increaseDislikes = resenaStore.likesCounter

    useEffect(() => {
    const getLibro = async (id: string) => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${id}`
        );
        const data = await response.json();
        setLibro(data.volumeInfo);
      } catch (err) {
        console.error("Error cargando libro", err);
      }
    };

    getLibro(resena.libroId);
  }, [resena.libroId]);
    const images = libro?.imageLinks

    const estrellas = () =>
    {
        switch(resena.calificacion){
            case 1: 
                return(<>
                    <Image src={estrella} alt="" height={10}></Image>
                </>)
            case 2:
                return(<>
                    <Image src={estrella} alt="" height={10}></Image>
                    <Image src={estrella} alt="" height={10}></Image>
                </>)
            case 3:
                return(<>
                    <Image src={estrella} alt="" height={10}></Image>
                    <Image src={estrella} alt="" height={10}></Image>
                    <Image src={estrella} alt="" height={10}></Image>
                </>)
            case 4:
                return(<>
                    <Image src={estrella} alt="" height={10}></Image>
                    <Image src={estrella} alt="" height={10}></Image>
                    <Image src={estrella} alt="" height={10}></Image>
                    <Image src={estrella} alt="" height={10}></Image>
                </>)
            case 5:
                return(<>
                    <Image src={estrella} alt="" height={10}></Image>
                    <Image src={estrella} alt="" height={10}></Image>
                    <Image src={estrella} alt="" height={10}></Image>
                    <Image src={estrella} alt="" height={10}></Image>
                    <Image src={estrella} alt="" height={10}></Image>
                </>)
        }
        
    }
    


    return (
        <div className="flex justify-center">
            <div className="flex justify-center w-1/3 bg-amber-100">
                <Card key={resena.id} className="w-90 p-4" >
                    <div className=" gap-2 flex justify-center items-center">
                        <div className="border-r-amber-200">
                            <div>

                            </div>
                            <h2 className="font-bold">{resena.title}</h2>
                            <div className="flex p-1">
                                {estrellas()}
                            </div>
                            <p>{resena.opinion}</p>
                            <div className="flex justify-around py-4">
                                <button className="flex items-center gap-2 hover:bg-gray-200 rounded-md" onClick={() =>increaseLikes(resena.id, 'like')}>
                                    <Image src={like} alt="" height={15}></Image>
                                    {resena.likes}
                                </button>
                                <button className="flex items-center gap-2 hover:bg-gray-200 rounded-md" onClick={() =>increaseDislikes(resena.id, 'dislike')}>
                                    <Image src={dislike} alt="" height={15}></Image>
                                    {resena.dislikes}
                                </button>
                            </div>
                        </div>
                        <div>
                            <img src={images?.thumbnail} alt="" />
                            <p className="text-xs">{libro?.title}</p>
                        </div>
                    </div>

                </Card>
            </div>
        </div >
    )
}