
import { useState, type FormEvent } from "react";

type TaskFormProps = {
  addTask: (text: string) => void
}

function TaskForm({addTask}: TaskFormProps) {
    const [text, setText] = useState("");
    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const trimmed = text.trim();
        if(!trimmed) return alert("No puedes añadir una tarea vacia");
        addTask(trimmed);
        setText("");
    }
        
    
    return(
        <div>
            <form onSubmit={handleSubmit} className="flex content-center mt-6 h-5 ">
                <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Añadir tarea"
                className="w-96 h-12  bg-gray-100  rounded-2xl rounded-r-none p-5 focus:outline-0 text-black placeholder:text-gray-400 "/>
                <button type="submit" className=" bg-gray-950 h-12 w-14 rounded-bl-none rounded-br-xl rounded-tr-xl cursor-pointer text-amber-50 border border-transparent  hover:border-blue-700 transition-colors duration-300 ">ADD</button>
            </form>
        </div>
    )
}
export default TaskForm; 