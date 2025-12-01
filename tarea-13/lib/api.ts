// lib/api.ts
export async function sendMessage(message: string) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    throw new Error("Error al comunicarse con el backend");
  }

  const data = await res.json();
  return data.reply;
}
