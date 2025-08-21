import React from "react"
import { bookss } from "@/types";
import LibroItem from "./libroItem";


const page = async () => {
    const data = await fetch('https://www.googleapis.com/books/v1/volumes?q=harry+potter');
    const books : bookss= await data.json();
    const array = books.items

    //console.log(books);
    console.log(array[0]);

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