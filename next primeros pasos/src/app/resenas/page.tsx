import React from "react"
import ResenaList from "./resenaList"


const page = async () => {
    return (<>
        <div className="">
            <div className="flex justify-center p-4">
                <h1 data-testid = 'resenas'>Reseñas</h1>
            </div>
            <a className="flex justify-center p-5 hover:bg-[#406db0] hover:text-white" href="/libros">Quiero crear mi reseña!</a>
            <ResenaList></ResenaList>
        </div>
    </>)
}

export default page