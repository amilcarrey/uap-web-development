import React from "react"
import { Card } from "@/components/ui/card"
import { resenasStore, resena } from "@/resenaStore"
import { title } from "process"


const page = async () => {
    const resenhas: resena[] = [{id: '1', calificacion: 3, dislikes: 4, likes: 20,libroId: '4RENAQAAMAAJ', title: 'estabuenishimo', opinion: 'joya total mi loco 100%recomendau por el 99% de los odontologos' }]
    return(<>
        <div className="">
            <div className="flex justify-center">
                <h1>resenas</h1>
            </div>

            <div className="flex-wrap w-1/3 bg-amber-100">
                {resenhas.map((b) => 
                    <>
                        <Card key={b.id} className="w-40" >

                            <h2 className="font-bold">{b.title}</h2>
                            <p>{b.opinion}</p>
                        </Card>
                    </>
                )}
            </div>
        </div>
    </>)
}

export default page