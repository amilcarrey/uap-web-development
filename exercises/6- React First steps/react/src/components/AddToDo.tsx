import type { FormEvent } from "react";

type AddToDoProps = {
    addTodo: (text: string) => Promise<void>;
};

export function AddToDo({ addTodo }: AddToDoProps ) {
    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const target = event.target as HTMLFormElement;
        const formData = new FormData(target);
        const text = formData.get("text")?.toString();

        if (!text) {
            return alert("ESCRIBI ALGO GIL");
        }

        addTodo(text);
        target.reset();
    }

    return (
        <form 
            onSubmit={handleSubmit} 
            action="/api/todos" 
            method="POST" 
            className="flex items-center bg-[rgba(241,236,230,255)] my-6 rounded-full w-1/2 p-0"
            >
            <input 
            type="text" 
            name="text" 
            id="input-todo" 
            placeholder="What do you need to do?" required className="flex-grow bg-transparent border-0 font-montserrat text-lg p-3 ml-2 focus:outline-none" 
            />
            <button 
            type="submit" 
            id="add-todo-btn" 
            name="action" 
            value="add" 
            className="flex-shrink-0 bg-[rgb(116,178,202)] border-0 text-white text-2xl rounded-r-full py-3 px-5 cursor-pointer"
            >
                ADD
            </button>
        </form>
        );
}