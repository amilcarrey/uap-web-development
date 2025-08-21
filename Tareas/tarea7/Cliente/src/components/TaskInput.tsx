import { useState } from "react";
import { useAddTask } from "../hooks/task";
import toast from 'react-hot-toast';

export interface Props {
  tabId: string;
  onTaskAdded: (data: any) => void;
}

export function TaskInput({ tabId, onTaskAdded }: Props) {

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const { mutateAsync } = useAddTask();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    if (!text.trim()) return;
    setLoading(true);

    try {
      const data = await mutateAsync({ text, tabId });
      setText("");
      onTaskAdded(data);
      toast.success('Tarea Agregada');

    } catch (err) {
      console.error("Error al enviar la tarea:", err);
      toast.error("No se pudo agregar la tarea.");

    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      method="POST"
      className="input-container flex mb-[20px] w-full"
      id="taskForm"
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="action" value="add" />
      <input type="hidden" name="tabId" value={tabId} />
      <input
        type="text"
        name="text"
        placeholder="What do you need to do?"
        required
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="task-input bg-[antiquewhite] p-[10px] border border-[#ccc] rounded-l-[2vh] flex-grow border-r-0"
      />
      <button
        type="submit"
        className="add-button bg-[burlywood] border-none cursor-pointer rounded-r-[2vh] p-[10px_20px] text-[16px] hover:bg-[#a57a5a]"
        disabled={loading}
      >
        Add
      </button>
    </form>
  );
}
