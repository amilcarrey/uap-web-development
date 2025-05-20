import type { TodoItem } from "../types";
import { ToDoItem } from "./ToDoItem";

type ToDoListProps = {
    todos: TodoItem[];
    toggleTodo: (id: number) => void;
    deleteTodo: (id: number) => void;
};

export function ToDoList({ todos, toggleTodo, deleteTodo }: ToDoListProps) {
    return (
        <ul
        className="list-none p-0 m-0"
        >
            {todos.map((todo) => (
                <ToDoItem
                    key={todo.id}
                    todo={todo}
                    toggleTodo={() => toggleTodo(todo.id)}
                    deleteTodo={() => deleteTodo(todo.id)}
                />
            ))}
        </ul>
    );
};
