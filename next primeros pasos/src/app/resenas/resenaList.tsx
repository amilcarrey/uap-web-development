import { resena, resenasDB, resenasStore } from "@/resenaStore"
import ResenaItem from "./resenaItem"

export default function ResenaList() {
    const resenasdb = resenasDB.toSorted((resA, resB) =>  (resB.likes-resB.dislikes) - (resA.likes-resA.dislikes));


    return (
            <div className="flex-wrap flex justify-center">
                {
                    resenasdb.map((res) =>
                        <ResenaItem resena={res} key={res.id}></ResenaItem>
                    )
                }
            </div>
)
}
