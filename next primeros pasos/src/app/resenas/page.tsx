'use client'
import React, { useEffect } from "react"
import { Card } from "@/components/ui/card"
import { resenasStore, resena } from "@/resenaStore"
import { title } from "process"
import ResenaItem from "./resenaItem"
import ResenaList from "./resenaList"


const page = async () => {
    return (<>
        <div className="">
            <div className="flex justify-center">
                <h1>resenas</h1>
            </div>
¿            <a className="flex justify-center p-5 hover:bg-red-500 hover:text-white" href="/libros">Quiero crear mi reseña!</a>
            <ResenaList></ResenaList>
        </div>
    </>)
}

export default page