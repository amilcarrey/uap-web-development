import { useToastStore } from "../stores/useToastStore";

export default function Toast() {
  const { isVisible, message, type } = useToastStore();

  if (!isVisible) return null;

  let bgColor = "bg-blue-500";
  if (type === "success") bgColor = "bg-green-500";
  if (type === "error") bgColor = "bg-red-500";

  return (
    <div
      className={`${bgColor} fixed  right-6 px-6 py-3 rounded-lg shadow-lg text-white text-lg z-50 animate-fadeIn`}
    >
      {message}
    </div>
  );
}
