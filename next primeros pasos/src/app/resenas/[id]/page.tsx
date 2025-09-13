import { Params } from "next/dist/server/request/params"
import NuevaResena from "./nuevaResena"

export async function Page ({ params }: { params: { id: string } }){
    return (
        <div className="">
            <div className="flex justify-center">
                <h1 data-testid ="header1" >Nueva Reseña</h1>
            </div>
            <div>
                <NuevaResena libroId = {params.id}></NuevaResena>
            </div>
        </div>
    );
}

export default Page