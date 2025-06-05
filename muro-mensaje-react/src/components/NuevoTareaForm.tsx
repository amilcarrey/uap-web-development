import type { FormEvent } from "react";

type NuevoMensajeFormProps = {
    addTarea: (action:string, content: string) => void;
}

export function NuevaTareaForm({addTarea}: NuevoMensajeFormProps) {

    function handleSubmit(e: FormEvent<HTMLFormElement>){
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const formData = new FormData(target);
        const content = formData.get("content")?.toString();

        if(!content){return alert("el formulario esta vacio")}

        addTarea('agregar-tarea', content);
        target.reset();
    }

    return (
        <section className="px-4 py-2">
            <form
                action="/api/tasks"
                method="post"
                className="flex justify-center items-center bg-[#faebd7] rounded-xl mx-auto w-3/5 p-3 gap-3 mb-5"
                onSubmit={handleSubmit}
            >
                <input
                    className="border border-gray-300 rounded px-3 py-1 flex-grow"
                    type="text"
                    name="content"
                    placeholder="Contenido del mensaje"
                />
                <button
                    className="bg-[#7fffd4]l hover:bg-teal-300 px-4 py-1 rounded"
                    type="submit"
                >
                    Add
                </button>
            </form>
        </section>

    )
}
