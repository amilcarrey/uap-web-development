import NuevaResena from "./nuevaResena"

const page = async () => {
    return (<>
        <div className="">
            <div className="flex justify-center">
                <h1>Nueva Reseña</h1>
            </div>
            <div>
                <NuevaResena></NuevaResena>
            </div>
        </div>
    </>)
}

export default page