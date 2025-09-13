import React from "react"
import { bookss } from "@/types";
import LibroItem from "./libroItem";


const page = async () => {
    return(<>
        <div className="">
            <div className="flex justify-center text-4xl font-extrabold p-5">
                <h1>Libros</h1>
            </div>
            <div>
                <LibroItem></LibroItem>
            </div>
        </div>
    </>)
}

export default page