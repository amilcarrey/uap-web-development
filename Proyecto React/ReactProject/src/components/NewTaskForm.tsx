import type { FormEvent } from "react";

type NewTaskFormProps = {
  addTask: (text: string) => void;
};

export function NewTaskForm({ addTask }: NewTaskFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const target = event.target as HTMLFormElement;
    const formData = new FormData(target);
    const text = formData.get("task")?.toString();

    if (!text) {
      return alert("Please enter a task");
    }

    addTask(text);
    target.reset();
  }

  return (
    <form method="POST" action="/api/agregar" className="flex justify-center items-center my-5 mx-auto max-w-xl" id="task-input" onSubmit={handleSubmit}>
      <input type="text" className="w-[60%] py-2 px-2 rounded-[20px] bg-[#eadecf] border-none placeholder:text-[13px] placeholder:text-[#888]" name="task" placeholder="What do you need to do?" required />
      <button type="submit" className="bg-[#65b8d8] text-white py-2 px-5 ml-2 rounded-[20px] cursor-pointer hover:bg-[#4a9cbd]" name="add-task">ADD</button>
    </form>
  );
};