import type { TodoItem } from "../types";

type ToDoItemProps = {
    todo: TodoItem;
    toggleTodo: () => void;
    deleteTodo: () => void;
};

export function ToDoItem({ 
    todo: { id, text, completed },
    toggleTodo,
    deleteTodo 
}: ToDoItemProps) {
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const target = event.target as HTMLFormElement;
        const formData = new FormData(target);
        const action = formData.get("action")?.toString();

        if (action === "toggle") {
            toggleTodo();
        } else if (action === "delete") {
            deleteTodo();
        }
    }

    return (
        <li
        className="flex mt-2 items-center p-2"
        >
        <form 
        action="/api/todos" 
        method="POST" 
        className="inline"
        onSubmit={handleSubmit}
        >
            <button 
            type="submit" 
            name="action" 
            value="toggle" 
            className={`flex-shrink-0 bg-transparent border-2 border-gray-500 rounded-full py-2 px-3 mr-5 transition-all duration-500 cursor-pointer ${completed ? 'border-orange-500 border-2 text-orange-500 font-extrabold' : 'text-transparent'}`} 
            title="Toggle"
            // onClick={toggleTodo}
            >
                ✓
            </button>
            <input 
            type="hidden" 
            name="id" 
            value={id} 
            />
            <input 
            type="hidden" 
            name="action" 
            value="toggle" 
            />
        </form>
      
        <p 
        className={`flex-grow font-sans text-lg pb-2 mb-0 border-b border-[rgb(116,178,202)] transition-all duration-500 ${completed ? 'line-through opacity-50 text-[rgb(158,151,151)]' : ''}`}
        >
            {text}
        </p>
      
        <form 
        action="/api/todos" 
        method="POST" 
        className="inline"
        onSubmit={handleSubmit}
        >
            <button 
            type="submit" 
            name="action" 
            value="delete" 
            className="flex-shrink-0 bg-transparent border-0 text-orange-500 text-base px-2 cursor-pointer" 
            title="Delete"
            // onClick={deleteTodo}
            >
                <i 
                className="fa-solid fa-trash"
                >    
                </i>
            </button>
            <input  
            type="hidden" 
            name="id" 
            value={id} 
            />
            <input 
            type="hidden" 
            name="action" 
            value="delete" 
            />
        </form>
    </li>
    );
}