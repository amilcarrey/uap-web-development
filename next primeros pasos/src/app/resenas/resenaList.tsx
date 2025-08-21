import { resena, resenasStore } from "@/resenaStore"
import ResenaItem from "./resenaItem"

export default function ResenaList() {
    const resenasState = resenasStore()
    const resenas = resenasState.resenas.toSorted((resA, resB) =>  (resB.likes-resB.dislikes) - (resA.likes-resA.dislikes));


    return (
            <div>
                {
                    resenas.map((res) =>
                        <ResenaItem resena={res} key={res.id}></ResenaItem>
                    )
                }
            </div>
)
}
