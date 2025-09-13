import ResenaItem from "@/app/resenas/resenaItem";
import { Card } from "@/components/ui/card";
import { resenasDB } from "@/resenaStore";
import Link from "next/link";
import { getLibroById } from "../serverActions";

const page = async ({ params }: { params: { id: string } }) => {
    const libro = await getLibroById(params.id);
    const resenasdb = resenasDB.filter((r) => r.libroId == params.id)


    return (<>
        <div className="">
            <div className="w-full flex justify-center text-3xl p-5 font-extrabold">
                <Link href="http://localhost:3000/">Libreate varon</Link>
            </div>
            <div className="flex justify-center">
                <Card className="flex-row p-4">
                    <div className="flex justify-center w-full">
                        <img src={libro?.imageLinks.thumbnail} alt="" className="w-70 h-140 rounded-md"></img>
                    </div>
                    <div className="w-fit">
                        <h1 datatest-id = 'title'>{libro.title} </h1>
                        <h3 datatest-id = 'autores' >{libro.authors?.length < 1 ? `Author: ${libro.authors}` : `Authors: ${libro.authors}`} </h3>
                        <h3 datatest-id = 'published'>Published: {libro.publishedDate}</h3>
                        <h3 datatest-id = 'categories'>{libro.categories?.length < 1 ? `Category: ${libro.categories}` : `Categories: ${libro.categories}`} </h3>
                        <p datatest-id = 'descripcion'>{libro.description}</p>
                        <p></p>
                    </div>
                </Card>
            </div>
            <p className="w-screen flex justify-center font-bold p-5">¿que dice el publico?</p>
            <div className="">
                {
                    resenasdb.map((res) =>
                        <ResenaItem resena={res} key={res.id}></ResenaItem>
                    )
                }
            </div>
        </div>
    </>)
}

export default page