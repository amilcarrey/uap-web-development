import { useAtomValue, useSetAtom } from "jotai";
import { configAtom, configContentAtom } from "./store/tareasStore";
import { type FormEvent } from "react";

export function Configuracion() {
    const setConfigState = useSetAtom(configAtom);
    const configContent = useAtomValue(configContentAtom)
    const setConfigContent = useSetAtom(configContentAtom)
    const iRefetch = ` ${(configContent.intervaloRefetch / 1000).toString()} s`

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const formData = new FormData(target);
        const content = formData.get("content")?.toString();
        if (!content) { return alert("el formulario esta vacio") }
        setConfigContent({ intervaloRefetch: parseInt(content) * 1000, capsLck: configContent.capsLck })
        target.reset();
    }

    function handleCaps() {
        setConfigContent({ intervaloRefetch: configContent.intervaloRefetch, capsLck: configContent.capsLck ? false : true })
    }

    function handleConfig() {
        setConfigState(false)
    }

    return (<>
        <div className="flex-col flex justify-center  bg-[#b1e4e4] rounded-xl mx-auto w-3/5 p-3 gap-2">
            <div className="items-center flex ">
                <h1 className="text-white font-bold">Configuraciones</h1>
            </div>
            <div>
                <ul>
                    <li className="flex justify-around items-center w-full gap-1 p-2">
                        <p className="flex-grow">Intervalo de Refectch</p>
                        <form onSubmit={handleSubmit} className="flex justify-around items-center gap-1">
                            <input name="content" type="text" className="w-10 h-6 rounded flex justify-center items-end-safe text-sm bg-[#f0f8ff]" placeholder={iRefetch} />
                            <button type="submit" className="w-9 h-6 rounded flex justify-center items-center text-sm bg-[#f0f8ff]  hover:bg-[#b1dbff] transition-colors">set</button>
                        </form>
                    </li>
                    <li className="flex justify-around items-center w-full gap-3 p-2" >
                        <p className="flex-grow">Activar Mayusculas</p>
                        <button
                            className="w-20 h-6 rounded flex justify-center items-center text-sm bg-[#f0f8ff] hover:bg-[#b1dbff] transition-colors"
                            onClick={(e) => { e.preventDefault(); handleCaps() }}
                        >{configContent.capsLck ? "ACTIVAU" : "singritar"}</button>
                    </li>
                </ul>
            </div>
            <div className="items-center flex justify-center" >
                <button className="w-20 h-6 rounded flex justify-center items-center text-sm bg-[#f0f8ff] hover:bg-[#b1dbff] transition-colors"
                    onClick={() => handleConfig()}
                >Volver</button>
            </div>
        </div>
    </>)
}

