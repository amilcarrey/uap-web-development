type ClearCompletedProps = {
    clearCompletedTodos: () => void;
};

export function ClearCompleted({ clearCompletedTodos }: ClearCompletedProps) {
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        clearCompletedTodos();
    };

    return (
        <form 
        action="/" 
        method="POST" 
        id="clear-completed-form"
        onSubmit={handleSubmit}
        >
            <button 
            type="submit" 
            name="action" 
            value="clearCompleted" 
            className="text-orange-500 mx-8 my-2 mt-24 ml-auto block text-right cursor-pointer border-0 bg-transparent"
            >
                Clear Completed
            </button>
        </form>
    );
}