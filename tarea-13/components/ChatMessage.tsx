// components/ChatMessage.tsx
export default function ChatMessage({ sender, text }: {
  sender: "user" | "bot";
  text: string;
}) {
  return (
    <div className={`p-3 rounded-lg my-2 max-w-lg ${
      sender === "user" ? "bg-blue-500 text-white ml-auto" : "bg-gray-200"
    }`}>
      {text}
    </div>
  );
}
