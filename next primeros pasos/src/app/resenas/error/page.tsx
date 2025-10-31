import Image from "next/image"
import warning from "../../../../public/8666668_alert_octagon_icon.png"

const page = async () => {
    return (<>
        <div className="">
            <div className="flex justify-center p-4">
                <h1>Error</h1>
            </div>
            <div className="flex items-center justify-center p-4 gap-5">
                <Image src={warning} alt="" width={70}></Image>
                <p className="w-1/2">Parece que hay algo inusual en los campos del formulario, por favor verificalos antes de enviarlos</p>
            </div>
            <a className="flex justify-center p-5 hover:bg-[#406db0] hover:text-white" href="/resenas/crear">Volvamos a intentar!</a>
        </div>
    </>)
}

export default page