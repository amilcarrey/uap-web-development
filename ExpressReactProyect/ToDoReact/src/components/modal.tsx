import { useModalStore } from "../store/modalStore";

export default function Modal() {
  const { isOpen, message, type} = useModalStore();

  if (!isOpen) return null;

  return (
    <div className="fixed top-6 right-6 z-50">
      <div
        className={`px-4 py-3 rounded shadow-lg text-white flex items-center gap-2
          ${type === "success" ? "bg-green-600" : "bg-red-600"}`}>
        <span>{message}</span>
      </div>
    </div>
  );
}